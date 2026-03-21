"use client";

import { useEffect, useRef, useState } from "react";
import { X, AlertCircle, Volume2, VolumeX } from "lucide-react";
import type { Channel } from "@/lib/m3uParser";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface PlayerModalProps {
    channel: Channel;
    onClose: () => void;
}

function proxyUrl(url: string): string {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
}

export default function PlayerModal({ channel, onClose }: PlayerModalProps) {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [muted, setMuted] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!videoRef.current) return;

        let loadTimeout: NodeJS.Timeout;

        // Determine the stream URL and type
        let originalUrl = channel.url;
        if (originalUrl.includes("/live/") && originalUrl.endsWith(".ts")) {
            originalUrl = originalUrl.substring(0, originalUrl.length - 3) + ".m3u8";
        }

        const streamUrl = proxyUrl(originalUrl);
        const isHls = originalUrl.endsWith(".m3u8") || originalUrl.includes("/live/") || originalUrl.includes(":8080") || originalUrl.includes(":80/");

        // Create video element
        const videoElement = document.createElement("video-js");
        videoElement.classList.add("vjs-big-play-centered", "vjs-fluid");
        videoRef.current.appendChild(videoElement);

        // Initialize Video.js
        const player = videojs(videoElement, {
            controls: true,
            autoplay: true,
            preload: "auto",
            fluid: true,
            responsive: true,
            liveui: true,
            html5: {
                vhs: {
                    overrideNative: true,
                    enableLowInitialPlaylist: true,
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false,
            },
            sources: [{
                src: streamUrl,
                type: isHls ? "application/x-mpegURL" : "video/mp2t",
            }],
        });

        playerRef.current = player;

        // Timeout
        loadTimeout = setTimeout(() => {
            setError("Tempo esgotado. O stream pode estar offline ou muito lento.");
            setLoading(false);
        }, 20000);

        player.on("loadeddata", () => {
            clearTimeout(loadTimeout);
            setLoading(false);
        });

        player.on("playing", () => {
            clearTimeout(loadTimeout);
            setLoading(false);
        });

        player.on("error", () => {
            clearTimeout(loadTimeout);
            const err = player.error();
            if (err) {
                setError("Erro ao carregar o canal. O stream pode estar offline.");
            }
            setLoading(false);
        });

        return () => {
            clearTimeout(loadTimeout);
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
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
        if (playerRef.current) {
            const isMuted = playerRef.current.muted();
            playerRef.current.muted(!isMuted);
            setMuted(!isMuted);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8 animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-5xl bg-card border border-border/30 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-background/80">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        <h2 className="text-sm font-semibold text-foreground truncate">{channel.name}</h2>
                        {channel.quality && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${channel.quality === "FHD" ? "bg-primary/20 text-primary" :
                                    channel.quality === "HD" ? "bg-blue-500/20 text-blue-400" :
                                        "bg-muted text-muted-foreground"
                                }`}>
                                {channel.quality}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded-full transition-colors"
                            onClick={toggleMute}
                        >
                            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded-full transition-colors"
                            onClick={onClose}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Video.js Container */}
                <div className="relative w-full aspect-video bg-black">
                    <div ref={videoRef} className="w-full h-full" />

                    {loading && !error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
                            <div className="w-10 h-10 border-3 border-muted border-t-primary rounded-full animate-spin mb-3" />
                            <div className="text-xs font-medium text-primary animate-pulse">Conectando...</div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center z-10">
                            <AlertCircle size={40} className="text-destructive mb-3" />
                            <div className="text-sm font-medium text-foreground mb-4 max-w-sm">{error}</div>
                            <button
                                onClick={() => setRetryCount(c => c + 1)}
                                className="px-5 py-2 bg-foreground text-background text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-background/80 text-xs text-muted-foreground border-t border-border/30">
                    <span>{channel.group}</span>
                    <span className="font-mono tracking-widest opacity-50">AO VIVO</span>
                </div>
            </div>
        </div>
    );
}
