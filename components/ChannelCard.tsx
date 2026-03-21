"use client";

import Image from "next/image";
import type { Channel } from "@/lib/m3uParser";

interface ChannelCardProps {
    channel: Channel;
    onClick: (channel: Channel) => void;
    delay?: number;
}

export default function ChannelCard({ channel, onClick, delay = 0 }: ChannelCardProps) {
    return (
        <button
            className="flex flex-col text-left group cursor-pointer animate-fade-in w-full"
            onClick={() => onClick(channel)}
            style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}
        >
            {/* Thumbnail 16:9 */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-card border border-border/30 group-hover:rounded-none transition-all duration-300">
                {channel.logo ? (
                    <Image
                        src={channel.logo}
                        alt={channel.name}
                        fill
                        className="object-contain p-8 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-black text-muted-foreground/30 uppercase tracking-wider">
                            {channel.name.substring(0, 3)}
                        </span>
                    </div>
                )}

                {/* Live Badge */}
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded-sm tracking-wide">
                    AO VIVO
                </span>

                {/* Quality Badge */}
                {channel.quality && (
                    <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${channel.quality === "FHD" ? "bg-primary/90 text-background" :
                            channel.quality === "HD" ? "bg-blue-500/90 text-white" :
                                "bg-gray-600/80 text-white"
                        }`}>
                        {channel.quality}
                    </span>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            {/* Meta: Avatar + Title */}
            <div className="flex gap-3 mt-3 pr-2">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-card border border-border/50 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                    {channel.logo ? (
                        <Image
                            src={channel.logo}
                            alt={channel.name}
                            width={36}
                            height={36}
                            className="object-contain p-1"
                            unoptimized
                        />
                    ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                            {channel.name.substring(0, 2).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Text */}
                <div className="flex flex-col min-w-0 gap-1">
                    <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {channel.name}
                    </h3>
                    <span className="text-xs text-muted-foreground truncate">
                        {channel.group}
                    </span>
                </div>
            </div>
        </button>
    );
}
