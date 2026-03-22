import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Channel } from "@/lib/m3uParser";

interface VodCardProps {
    channel: Channel;
    onClick: () => void;
}

export default function VodCard({ channel, onClick }: VodCardProps) {
    const [imgState, setImgState] = useState<"loading" | "error" | "loaded">("loading");

    // Extract year from name if it exists like "Movie Name (2023)"
    const match = channel.name.match(/\((\d{4})\)/);
    const year = match ? match[1] : null;

    // Clean name by removing tags like [FHD], (2023), etc
    const cleanName = channel.name
        .replace(/\[.*?\]|\(.*?\)/g, "")
        .replace(/FHD|HD|SD|4K/g, "")
        .trim();

    return (
        <div
            className="group relative flex-none w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] aspect-[2/3] rounded-md overflow-hidden cursor-pointer bg-card/40 border border-border/20 transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:border-primary/50"
            onClick={onClick}
        >
            {/* Poster Image / Fallback */}
            {channel.logo && imgState !== "error" ? (
                <Image
                    src={channel.logo}
                    alt={cleanName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onLoadingComplete={() => setImgState("loaded")}
                    onError={() => setImgState("error")}
                    sizes="(max-width: 768px) 140px, 200px"
                    unoptimized
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-card to-background flex items-center justify-center p-4">
                    <span className="text-muted-foreground/50 font-bold text-center text-sm leading-tight break-words line-clamp-3">
                        {cleanName}
                    </span>
                </div>
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

            {/* Hover Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play size={24} className="ml-1" />
                </div>
            </div>

            {/* Badges / Text metadata */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                {channel.quality && (
                    <span className="px-1.5 py-0.5 bg-primary rounded shadow-sm text-[9px] font-extrabold uppercase tracking-wide text-primary-foreground">
                        {channel.quality}
                    </span>
                )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none transform transition-transform group-hover:-translate-y-2">
                <h4 className="text-white font-bold text-xs sm:text-sm leading-tight line-clamp-2 md:line-clamp-2 drop-shadow-md">
                    {cleanName}
                </h4>
                {year && (
                    <p className="text-white/70 text-[10px] font-medium mt-0.5 drop-shadow-md">
                        {year}
                    </p>
                )}
            </div>
        </div>
    );
}
