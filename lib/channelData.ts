import fs from "fs";
import path from "path";
import { parseM3U, type Channel } from "./m3uParser";

let cachedChannels: Channel[] | null = null;

const MAX_FILE_SIZE = 20 * 1024 * 1024; // Skip files larger than 20MB

export function getAllChannels(): Channel[] {
    if (cachedChannels) return cachedChannels;

    const listDir = path.join(process.cwd(), "list");
    const allChannels: Channel[] = [];
    const seenIds = new Set<string>();

    const filesToLoad = ["CanaisIPTV.m3u", "CanaisBR01.m3u8"];

    for (const fileName of filesToLoad) {
        try {
            const filePath = path.join(listDir, fileName);
            if (!fs.existsSync(filePath)) continue;

            const stat = fs.statSync(filePath);
            if (stat.size <= MAX_FILE_SIZE) {
                const content = fs.readFileSync(filePath, "utf-8");
                const parsed = parseM3U(content);

                for (const ch of parsed) {
                    const key = `${ch.name}||${ch.url}`;
                    if (!seenIds.has(key)) {
                        seenIds.add(key);
                        allChannels.push(ch);
                    }
                }
            }
        } catch {
            // file not found or unreadable
        }
    }

    cachedChannels = allChannels;
    return allChannels;
}

export function getGroups(): { name: string; count: number; icon: string }[] {
    const channels = getAllChannels();
    const groupMap = new Map<string, number>();

    for (const ch of channels) {
        groupMap.set(ch.group, (groupMap.get(ch.group) || 0) + 1);
    }

    const groupIcons: Record<string, string> = {
        "GLOBO SUDESTE": "📺",
        "GLOBO NORDESTE": "📺",
        "GLOBO SUL": "📺",
        "GLOBO CENTRO OESTE": "📺",
        "GLOBO NORTE": "📺",
        RECORD: "🔴",
        SBT: "🟡",
        BAND: "🔵",
        ABERTOS: "📡",
        NOTÍCIAS: "📰",
        "ESPORTES PPV": "⚽",
        "BBB 26": "🏠",
        "BBB 2026": "🏠",
        "Romania ": "🇷🇴",
        "CANAIS | ESTADO DO PARÁ": "📺",
        "CANAIS | FILMES E SERIES": "🎬",
        "CANAIS | DESENHOS": "🧸",
        "Canais | NOVELAS": "📺",
        "CANAIS | EVANGÉLICOS": "⛪",
        "Canais | Religiosos": "🙏",
        "Canais | BBB": "🏠",
        "ANIMES": "💮",
        "CANAIS | ANIMES": "💮",
        "Animes": "💮",
    };

    return Array.from(groupMap.entries())
        .map(([name, count]) => ({
            name,
            count,
            icon: groupIcons[name] || "📺",
        }))
        .sort((a, b) => b.count - a.count);
}
