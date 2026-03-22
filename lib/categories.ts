export type TopLevelCategory = "live" | "filmes" | "series" | "animes";

export function getCategoryForGroup(groupName: string): TopLevelCategory {
    const lower = groupName.toLowerCase();

    if (lower.includes("anime") || lower.includes("crunchyroll") || lower.includes("hentai")) {
        return "animes";
    }

    if (lower.includes("filme") || lower.includes("cinema") || lower.includes("ação") ||
        lower.includes("terror") || lower.includes("doramas") || lower.includes("família") ||
        lower.includes("comédia") || lower.includes("faroeste") || lower.includes("ficção") ||
        lower.includes("romance") || lower.includes("suspense") || lower.includes("telecine")) {
        return "filmes";
    }

    if (lower.includes("serie") || lower.includes("série") || lower.includes("netflix") ||
        lower.includes("apple") || lower.includes("prime") || lower.includes("max") ||
        lower.includes("disney") || lower.includes("hulu") || lower.includes("paramount") ||
        lower.includes("globoplay") || lower.includes("lionsgate") || lower.includes("reelshort") ||
        lower.includes("univer") || lower.includes("universal+")) {
        return "series";
    }

    return "live";
}
