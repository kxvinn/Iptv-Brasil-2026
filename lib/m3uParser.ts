export interface Channel {
    id: string;
    name: string;
    logo: string;
    group: string;
    url: string;
    quality: "FHD" | "HD" | "SD";
}

function detectQuality(name: string): "FHD" | "HD" | "SD" {
    const upper = name.toUpperCase();
    if (upper.includes("FHD") || upper.includes("FULL HD")) return "FHD";
    if (upper.includes("HD")) return "HD";
    return "SD";
}

export function parseM3U(content: string): Channel[] {
    const lines = content.split(/\r?\n/);
    const channels: Channel[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        if (line.startsWith("#EXTINF:")) {
            const nameMatch = line.match(/,(.+)$/);
            const logoMatch = line.match(/tvg-logo="([^"]*)"/);
            const groupMatch = line.match(/group-title="([^"]*)"/);
            const idMatch = line.match(/tvg-id="([^"]*)"/);

            const name = nameMatch ? nameMatch[1].trim() : "Canal Desconhecido";
            const logo = logoMatch ? logoMatch[1] : "";
            const group = groupMatch ? groupMatch[1] : "Outros";
            const tvgId = idMatch ? idMatch[1] : "";

            // Next line should be the URL
            const urlLine = i + 1 < lines.length ? lines[i + 1].trim() : "";

            if (urlLine && !urlLine.startsWith("#")) {
                channels.push({
                    id: `${tvgId || name}-${channels.length}`,
                    name,
                    logo,
                    group,
                    url: urlLine,
                    quality: detectQuality(name),
                });
                i += 2;
                continue;
            }
        }
        i++;
    }

    return channels;
}

export function getUniqueGroups(channels: Channel[]): string[] {
    const groups = new Set(channels.map((c) => c.group));
    return Array.from(groups).sort();
}

export function getChannelsByGroup(
    channels: Channel[],
    group: string
): Channel[] {
    return channels.filter((c) => c.group === group);
}
