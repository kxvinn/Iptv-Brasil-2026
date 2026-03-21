"use client";

import { Play } from "lucide-react";
import type { Channel } from "@/lib/m3uParser";

interface ChannelCardProps {
    channel: Channel;
    onClick: (channel: Channel) => void;
    delay?: number;
}

export default function ChannelCard({
    channel,
    onClick,
    delay = 0,
}: ChannelCardProps) {
    const qualityClass =
        channel.quality === "FHD"
            ? "fhd"
            : channel.quality === "HD"
                ? "hd"
                : "sd";

    const initials = channel.name
        .replace(/\s+(FHD|HD|SD|Alternativo|\d+)/gi, "")
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <button
            className="channel-card"
            onClick={() => onClick(channel)}
            style={{ animationDelay: `${delay}ms` }}
        >
            {channel.logo ? (
                <div className="channel-logo-wrapper">
                    <img
                        src={channel.logo}
                        alt={channel.name}
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                                parent.className = "channel-logo-placeholder";
                                parent.textContent = initials;
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="channel-logo-placeholder">{initials}</div>
            )}

            <div className="channel-info">
                <div className="channel-name">{channel.name}</div>
                <div className="channel-group">{channel.group}</div>
            </div>

            <div className="channel-meta">
                <span className={`quality-badge ${qualityClass}`}>
                    {channel.quality}
                </span>
                <Play size={16} className="play-icon" />
            </div>
        </button>
    );
}
