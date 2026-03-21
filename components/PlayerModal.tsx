"use client";

import { useEffect, useRef, useState } from "react";
import { X, AlertCircle, Volume2, VolumeX } from "lucide-react";
import type { Channel } from "@/lib/m3uParser";
import mpegts from "mpegts.js";

interface PlayerModalProps {
    channel: Channel;
    onClose: () => void;
}

function proxyUrl(url: string): string {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
}

export default function PlayerModal({ channel, onClose }: PlayerModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<import("hls.js").default | null>(null);
    const playerRef = useRef<mpegts.Player | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [muted, setMuted] = useState(false);

    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let loadTimeout: NodeJS.Timeout;
        let originalUrl = channel.url;

        // Try the XTream Codes HLS trick unless it explicitly failed before
        // But some TS streams are just raw HTTP TS. If hls.js fails we should fallback.
        if (originalUrl.includes("/live/") && originalUrl.endsWith(".ts")) {
            originalUrl = originalUrl.substring(0, originalUrl.length - 3) + ".m3u8";
        }

        let streamUrl = proxyUrl(originalUrl);

        const destroyPlayers = () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.removeAttribute("src");
                videoRef.current.load();
            }
        };

        const initPlayer = async (forceMpegTs = false) => {
            setLoading(true);
            setError(null);

            // Timeout if connection hangs for more than 15s
            loadTimeout = setTimeout(() => {
                setError("Tempo esgotado. O stream pode estar offline ou muito lento.");
                setLoading(false);
                destroyPlayers();
            }, 18000);

            const isHls =
                !forceMpegTs &&
                (originalUrl.endsWith(".m3u8") ||
                    originalUrl.includes("/live/") ||
                    originalUrl.includes(":8080") ||
                    originalUrl.includes(":80/"));

            if (isHls) {
                try {
                    const HlsModule = await import("hls.js");
                    const Hls = HlsModule.default;

                    if (Hls.isSupported()) {
                        const hls = new Hls({
                            enableWorker: true,
                            lowLatencyMode: true,
                            maxBufferLength: 30,
                            maxMaxBufferLength: 60,
                            xhrSetup: (xhr, url) => {
                                if (!url.startsWith("/api/proxy")) {
                                    xhr.open("GET", proxyUrl(url), true);
                                }
                            },
                        });

                        hlsRef.current = hls;
                        hls.loadSource(streamUrl);
                        hls.attachMedia(video);

                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                            clearTimeout(loadTimeout);
                            setLoading(false);
                            video.play().catch(() => { });
                        });

                        hls.on(Hls.Events.ERROR, (_, data) => {
                            if (data.fatal) {
                                clearTimeout(loadTimeout);
                                // If HLS fails and it wasn't explicitly m3u8 in the original source,
                                // try MPEG-TS as fallback
                                if (!forceMpegTs && channel.url.endsWith(".ts")) {
                                    destroyPlayers();
                                    initPlayer(true); // Retry with mpegts
                                } else {
                                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                                        setError("Falha na rede. Verifique se o canal está online.");
                                    } else {
                                        setError("Erro ao carregar o canal. Stream offline ou bloqueado.");
                                    }
                                    setLoading(false);
                                }
                            }
                        });
                    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = streamUrl;
                        video.addEventListener("loadeddata", () => {
                            clearTimeout(loadTimeout);
                            setLoading(false);
                        });
                        video.addEventListener("error", () => {
                            clearTimeout(loadTimeout);
                            setError("Erro ao reproduzir o stream HLS nativo.");
                            setLoading(false);
                        });
                    }
                } catch {
                    clearTimeout(loadTimeout);
                    setError("Erro ao inicializar o HLS.js.");
                    setLoading(false);
                }
            } else {
                // If it's a TS stream or forced fallback to mpegts
                if (mpegts.getFeatureList().mseLivePlayback) {
                    try {
                        const originalUrlIsTs = channel.url.endsWith(".ts") || forceMpegTs;
                        streamUrl = proxyUrl(channel.url); // Use the real URL

                        const player = mpegts.createPlayer({
                            type: originalUrlIsTs ? 'mse' : 'mp4',
                            isLive: true,
                            url: streamUrl,
                        });

                        player.attachMediaElement(video);
                        player.load();
                        playerRef.current = player;

                        player.on(mpegts.Events.ERROR, () => {
                            clearTimeout(loadTimeout);
                            setError("Erro ao reproduzir o stream TS/MPEG.");
                            setLoading(false);
                        });

                        video.addEventListener("loadeddata", () => {
                            clearTimeout(loadTimeout);
                            setLoading(false);
                        });

                        player.play().catch(() => { });
                    } catch {
                        clearTimeout(loadTimeout);
                        setError("Erro ao inicializar MPEG-TS player.");
                        setLoading(false);
                    }
                } else {
                    // Fallback to basic HTML5 video
                    video.src = streamUrl;
                    video.addEventListener("loadeddata", () => {
                        clearTimeout(loadTimeout);
                        setLoading(false);
                    });
                    video.addEventListener("error", () => {
                        clearTimeout(loadTimeout);
                        setError("Erro ao carregar o vídeo nativamente.");
                        setLoading(false);
                    });
                    video.play().catch(() => { });
                }
            }
        };

        initPlayer();

        return () => {
            clearTimeout(loadTimeout);
            destroyPlayers();
        };
    }, [channel.url, retryCount]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(!muted);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <span className="live-dot" />
                        {channel.name}
                        {channel.quality && (
                            <span className={`quality-badge ${channel.quality.toLowerCase()}`}>
                                {channel.quality}
                            </span>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                            className="modal-close"
                            onClick={toggleMute}
                            title={muted ? "Ativar som" : "Silenciar"}
                        >
                            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button className="modal-close" onClick={onClose} title="Fechar">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="video-container">
                    <video ref={videoRef} controls autoPlay playsInline />

                    {loading && !error && (
                        <div className="video-loading">
                            <div className="spinner" />
                            Conectando ao stream...
                        </div>
                    )}

                    {error && (
                        <div className="video-error">
                            <AlertCircle size={36} />
                            <div>{error}</div>
                            <button
                                onClick={() => setRetryCount(c => c + 1)}
                                style={{
                                    marginTop: "12px",
                                    padding: "8px 20px",
                                    background: "var(--primary)",
                                    color: "#000",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                }}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                </div>

                <div
                    style={{
                        padding: "12px 20px",
                        borderTop: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                    }}
                >
                    <span>{channel.group}</span>
                    <span style={{ opacity: 0.5 }}>AO VIVO</span>
                </div>
            </div>
        </div>
    );
}
