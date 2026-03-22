"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Play, Info } from "lucide-react";
import type { Channel } from "@/lib/m3uParser";
import VodCard from "./VodCard";

interface VodLayoutProps {
    channels: Channel[];
    onPlay: (channel: Channel) => void;
}

export default function VodLayout({ channels, onPlay }: VodLayoutProps) {
    const { heroChannel, groupedChannels } = useMemo(() => {
        // Group channels by group
        const groups: Record<string, Channel[]> = {};
        for (const ch of channels) {
            if (!groups[ch.group]) groups[ch.group] = [];
            groups[ch.group].push(ch);
        }

        // Convert to array and sort by group name
        const groupedArray = Object.entries(groups)
            .map(([name, items]) => ({ name, items }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Pick a random hero channel that has a logo
        const channelsWithLogo = channels.filter(c => c.logo);
        const hero = channelsWithLogo.length > 0
            ? channelsWithLogo[Math.floor(Math.random() * channelsWithLogo.length)]
            : channels[0];

        return { heroChannel: hero, groupedChannels: groupedArray };
    }, [channels]);

    if (!channels.length) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Nenhum título encontrado nesta categoria.
            </div>
        );
    }

    const cleanTitle = heroChannel ? heroChannel.name.replace(/\[.*?\]|\(.*?\)/g, "").replace(/FHD|HD|SD|4K/g, "").trim() : "";
    const match = heroChannel ? heroChannel.name.match(/\((\d{4})\)/) : null;
    const year = match ? match[1] : new Date().getFullYear().toString();

    return (
        <div className="flex flex-col w-full pb-20 animate-fade-in relative z-0">
            {/* Hero Section */}
            {heroChannel && (
                <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] flex-none mb-8 md:mb-12 rounded-xl overflow-hidden shadow-2xl">
                    {/* Background Image */}
                    {heroChannel.logo ? (
                        <Image
                            src={heroChannel.logo}
                            alt={cleanTitle}
                            fill
                            className="object-cover object-top opacity-60"
                            unoptimized
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-card to-background opacity-60" />
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent w-full md:w-3/4 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

                    {/* Hero Content */}
                    <div className="absolute bottom-[10%] left-6 md:left-12 max-w-2xl z-20 flex flex-col gap-4">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest w-fit shadow-md">
                            Destaque
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg leading-tight">
                            {cleanTitle}
                        </h1>

                        <div className="flex items-center gap-4 text-sm font-medium drop-shadow-md">
                            <span className="text-green-400 font-bold tracking-wider">★ 9.8</span>
                            <span className="text-white/80">{year}</span>
                            {heroChannel.quality && (
                                <span className="px-1.5 py-0.5 border border-white/40 text-white/90 rounded text-[10px] tracking-widest uppercase">
                                    {heroChannel.quality}
                                </span>
                            )}
                        </div>

                        <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4 max-w-lg mt-2 drop-shadow-md">
                            Assista agora a {cleanTitle} e milhares de outros títulos no Tigre TV. Tudo em um só lugar com qualidade premium.
                        </p>

                        <div className="flex items-center gap-4 mt-6">
                            <button
                                onClick={() => onPlay(heroChannel)}
                                className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-3 rounded-md font-bold text-sm md:text-base hover:bg-white/80 transition-colors shadow-lg"
                            >
                                <Play fill="currentColor" size={20} />
                                Assistir
                            </button>
                            <button
                                onClick={() => alert("Mais informações em breve!")}
                                className="flex items-center gap-2 bg-gray-500/50 text-white backdrop-blur-md px-6 md:px-8 py-3 rounded-md font-bold text-sm md:text-base hover:bg-gray-500/70 transition-colors border border-white/10"
                            >
                                <Info size={20} />
                                Mais Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Rows */}
            <div className="flex flex-col gap-10 md:gap-12 px-2 md:px-6 z-20 relative -mt-20">
                {groupedChannels.map(({ name, items }) => (
                    <div key={name} className="flex flex-col gap-3">
                        <h2 className="text-white font-bold text-lg md:text-xl drop-shadow-md pl-2 md:pl-0">
                            {name.replace(/^CANAIS \| |^VOD \| /, "")}
                        </h2>

                        {/* Horizontal Scroll Container */}
                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 pt-2 px-2 md:px-0 scrollbar-hide snap-x snap-mandatory">
                            {items.map((ch, idx) => (
                                <div key={ch.url + idx} className="snap-start flex-none">
                                    <VodCard channel={ch} onClick={() => onPlay(ch)} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom scrollbar hiding style */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
