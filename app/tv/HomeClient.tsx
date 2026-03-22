"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tv, Home, Flame, Music, Gamepad2, Newspaper, Church, Baby, Film, Trophy, Radio, ChevronLeft, Ghost } from "lucide-react";
import type { Channel } from "@/lib/m3uParser";
import { getCategoryForGroup, type TopLevelCategory } from "@/lib/categories";
import Navbar from "@/components/Navbar";
import ChannelCard from "@/components/ChannelCard";
import PlayerModal from "@/components/PlayerModal";
import VodLayout from "@/components/VodLayout";

interface HomeClientProps {
    channels: Channel[];
    groups: { name: string; count: number; icon: string }[];
}

const TOP_LEVEL_CATEGORIES: { id: TopLevelCategory; label: string; icon: any }[] = [
    { id: "live", label: "TV Ao Vivo", icon: Tv },
    { id: "filmes", label: "Filmes", icon: Film },
    { id: "series", label: "Séries", icon: Flame },
    { id: "animes", label: "Animes", icon: Ghost },
];

export default function HomeClient({ channels, groups }: HomeClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<TopLevelCategory>("live");
    const [selectedLiveGroup, setSelectedLiveGroup] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    // Read ?filter= from URL properly
    useEffect(() => {
        const filter = searchParams.get("filter");
        if (filter) {
            const valid = TOP_LEVEL_CATEGORIES.find(c => c.id === filter.toLowerCase());
            if (valid) {
                setSelectedCategory(valid.id as TopLevelCategory);
            }
        }
    }, [searchParams]);

    const handleCategorySelect = (categoryId: TopLevelCategory) => {
        setSelectedCategory(categoryId);
        setSelectedLiveGroup(null);
        setSearch("");
        router.replace(`/tv?filter=${categoryId}`);
    };

    // Filter channels for the active category
    const categoryChannels = useMemo(() => {
        return channels.filter((c) => getCategoryForGroup(c.group) === selectedCategory);
    }, [channels, selectedCategory]);

    // Live specific groups for chips
    const liveGroups = useMemo(() => {
        return groups.filter(g => getCategoryForGroup(g.name) === "live");
    }, [groups]);

    // Final filtered channels (for TV ao vivo grid)
    const liveFilteredChannels = useMemo(() => {
        let result = categoryChannels;

        if (selectedCategory === "live" && selectedLiveGroup) {
            result = result.filter((c) => c.group === selectedLiveGroup);
        }

        if (search.trim()) {
            const query = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(query) ||
                    c.group.toLowerCase().includes(query)
            );
        }

        return result;
    }, [categoryChannels, search, selectedLiveGroup, selectedCategory]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Fixed Top Navbar */}
            <Navbar
                searchValue={search}
                onSearchChange={setSearch}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex pt-14 flex-1">
                {/* Sidebar */}
                <aside
                    className={`fixed top-14 left-0 bottom-0 z-40 bg-background overflow-y-auto scrollbar-hide transition-all duration-300 border-r border-border/20 ${sidebarOpen ? "w-60" : "w-[72px]"
                        } hidden md:block`}
                >
                    <div className="py-3">
                        <button
                            onClick={() => router.push("/")}
                            className={`w-full flex items-center gap-5 px-3 py-2.5 text-sm font-medium transition-colors rounded-lg mx-1 text-muted-foreground hover:bg-surface/50 hover:text-foreground ${sidebarOpen ? "pr-4" : "flex-col gap-1 text-[10px] px-0 mx-0 rounded-none justify-center"
                                }`}
                        >
                            <Home size={20} className="shrink-0" />
                            {sidebarOpen ? "Início" : "Início"}
                        </button>

                        {sidebarOpen && (
                            <div className="border-t border-border/20 my-3 mx-3" />
                        )}

                        {sidebarOpen && (
                            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Menu
                            </div>
                        )}

                        {/* Top Level Categories in Sidebar */}
                        {TOP_LEVEL_CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`w-full flex items-center gap-5 px-3 py-2.5 text-sm transition-colors rounded-lg mx-1 ${isActive
                                        ? "bg-surface text-foreground font-medium border-l-2 border-primary"
                                        : "text-muted-foreground hover:bg-surface/50 hover:text-foreground border-l-2 border-transparent"
                                        } ${sidebarOpen ? "pr-4" : "flex-col gap-1 text-[10px] px-0 mx-0 rounded-none justify-center border-none"
                                        }`}
                                >
                                    <Icon size={20} className="shrink-0" />
                                    {sidebarOpen ? <span className="truncate">{cat.label}</span> : null}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
                        }`}
                >
                    {/* Render VodLayout for VOD Categories */}
                    {selectedCategory !== "live" ? (
                        <div className="pt-4 md:pt-6 px-2 md:px-6">
                            <VodLayout
                                channels={categoryChannels.filter(c => search.trim() ? c.name.toLowerCase().includes(search.toLowerCase()) : true)}
                                onPlay={setSelectedChannel}
                            />
                        </div>
                    ) : (
                        /* Render classic Grid for Live TV */
                        <>
                            {/* Filter Chips (horizontal scroll) */}
                            <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md border-b border-border/20 px-4 md:px-6">
                                <div className="flex items-center gap-3 overflow-x-auto py-3 scrollbar-hide">
                                    <button
                                        className={`px-4 py-1.5 whitespace-nowrap rounded-full border text-sm font-medium transition-colors ${!selectedLiveGroup
                                            ? "bg-foreground text-background border-transparent"
                                            : "bg-surface text-foreground border-border hover:bg-surface-hover hover:border-foreground/30"
                                            }`}
                                        onClick={() => setSelectedLiveGroup(null)}
                                    >
                                        Todos os Canais
                                    </button>
                                    {liveGroups.map((g) => (
                                        <button
                                            key={g.name}
                                            className={`px-4 py-1.5 whitespace-nowrap rounded-full border text-sm font-medium transition-colors ${selectedLiveGroup === g.name
                                                ? "bg-foreground text-background border-transparent"
                                                : "bg-surface text-foreground border-border hover:bg-surface-hover hover:border-foreground/30"
                                                }`}
                                            onClick={() => setSelectedLiveGroup(g.name)}
                                        >
                                            {g.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected group header */}
                            {selectedLiveGroup && (
                                <div className="px-4 md:px-6 pt-6 flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedLiveGroup(null)}
                                        className="p-1.5 rounded-full hover:bg-surface transition-colors text-muted-foreground"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <h2 className="text-xl font-bold">{selectedLiveGroup}</h2>
                                    <span className="text-sm text-muted-foreground">
                                        {liveFilteredChannels.length} canais
                                    </span>
                                </div>
                            )}

                            {/* Video Grid */}
                            <div className="px-4 md:px-6 py-6 pb-20">
                                {liveFilteredChannels.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                                        {liveFilteredChannels.slice(0, 100).map((channel, i) => (
                                            <ChannelCard
                                                key={channel.id}
                                                channel={channel}
                                                onClick={setSelectedChannel}
                                                delay={Math.min(i * 20, 300)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                                        <Tv size={64} className="text-muted-foreground/20 mb-6" />
                                        <h3 className="text-lg font-semibold mb-2">Nenhum canal encontrado</h3>
                                        <p className="text-muted-foreground text-sm max-w-sm">
                                            Tente buscar por outro termo ou selecione uma categoria diferente.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Player Modal */}
            {selectedChannel && (
                <PlayerModal
                    channel={selectedChannel}
                    onClose={() => setSelectedChannel(null)}
                />
            )}

            {/* Styles for scrollbar */}
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
