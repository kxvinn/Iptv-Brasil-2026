"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tv, Home, Flame, Music, Gamepad2, Newspaper, Church, Baby, Film, Trophy, Radio, ChevronLeft, Ghost } from "lucide-react";
import type { Channel } from "@/lib/m3uParser";
import Navbar from "@/components/Navbar";
import ChannelCard from "@/components/ChannelCard";
import PlayerModal from "@/components/PlayerModal";

interface HomeClientProps {
    channels: Channel[];
    groups: { name: string; count: number; icon: string }[];
}

const SIDEBAR_ICONS: Record<string, React.ReactNode> = {
    "default": <Tv size={20} />,
    "ESPORTES": <Trophy size={20} />,
    "ESPORTES PPV": <Trophy size={20} />,
    "NOTÍCIAS": <Newspaper size={20} />,
    "FILMES": <Film size={20} />,
    "CANAIS | FILMES E SERIES": <Film size={20} />,
    "CANAIS | DESENHOS": <Baby size={20} />,
    "CANAIS | EVANGÉLICOS": <Church size={20} />,
    "Canais | Religiosos": <Church size={20} />,
    "MÚSICA": <Music size={20} />,
    "GAMES": <Gamepad2 size={20} />,
    "ANIMES": <Ghost size={20} />,
    "CANAIS | ANIMES": <Ghost size={20} />,
    "Animes": <Ghost size={20} />,
};

function getSidebarIcon(name: string): React.ReactNode {
    return SIDEBAR_ICONS[name] || SIDEBAR_ICONS["default"];
}

export default function HomeClient({ channels, groups }: HomeClientProps) {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState("");
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    // Read ?filter= from URL and match to a group
    useEffect(() => {
        const filter = searchParams.get("filter");
        if (filter && groups.length > 0) {
            const keyword = filter.toLowerCase();
            const match = groups.find((g) => g.name.toLowerCase().includes(keyword));
            if (match) {
                setSelectedGroup(match.name);
            }
        }
    }, [searchParams, groups]);

    const filteredChannels = useMemo(() => {
        let result = channels;

        if (selectedGroup) {
            result = result.filter((c) => c.group === selectedGroup);
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
    }, [channels, search, selectedGroup]);

    const handleGroupClick = (groupName: string) => {
        setSelectedGroup(selectedGroup === groupName ? null : groupName);
    };

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
                        {/* Home */}
                        <button
                            onClick={() => setSelectedGroup(null)}
                            className={`w-full flex items-center gap-5 px-3 py-2.5 text-sm font-medium transition-colors rounded-lg mx-1 ${!selectedGroup
                                ? "bg-surface text-foreground"
                                : "text-muted-foreground hover:bg-surface/50 hover:text-foreground"
                                } ${sidebarOpen ? "pr-4" : "flex-col gap-1 text-[10px] px-0 mx-0 rounded-none justify-center"}`}
                        >
                            <Home size={20} className="shrink-0" />
                            {sidebarOpen ? "Início" : "Início"}
                        </button>



                        {sidebarOpen && (
                            <div className="border-t border-border/20 my-3 mx-3" />
                        )}

                        {sidebarOpen && (
                            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Categorias
                            </div>
                        )}

                        {/* Category List */}
                        {groups.map((group) => (
                            <button
                                key={group.name}
                                onClick={() => handleGroupClick(group.name)}
                                className={`w-full flex items-center gap-5 px-3 py-2 text-sm transition-colors rounded-lg mx-1 ${selectedGroup === group.name
                                    ? "bg-surface text-foreground font-medium"
                                    : "text-muted-foreground hover:bg-surface/50 hover:text-foreground"
                                    } ${sidebarOpen ? "pr-4" : "flex-col gap-1 text-[10px] px-0 mx-0 rounded-none justify-center"}`}
                                title={group.name}
                            >
                                <span className="shrink-0">{getSidebarIcon(group.name)}</span>
                                {sidebarOpen ? (
                                    <span className="truncate">{group.name}</span>
                                ) : null}
                                {sidebarOpen && (
                                    <span className="ml-auto text-xs text-muted-foreground/60">{group.count}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
                        }`}
                >
                    {/* Filter Chips (horizontal scroll) */}
                    <div className="sticky top-14 z-30 bg-background border-b border-border/20 px-4 md:px-6">
                        <div className="flex items-center gap-3 overflow-x-auto py-3 scrollbar-hide">
                            <button
                                className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-colors ${!selectedGroup
                                    ? "bg-foreground text-background"
                                    : "bg-surface text-foreground hover:bg-surface-hover"
                                    }`}
                                onClick={() => setSelectedGroup(null)}
                            >
                                Todos
                            </button>
                            {groups.slice(0, 12).map((g) => (
                                <button
                                    key={g.name}
                                    className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-colors ${selectedGroup === g.name
                                        ? "bg-foreground text-background"
                                        : "bg-surface text-foreground hover:bg-surface-hover"
                                        }`}
                                    onClick={() => handleGroupClick(g.name)}
                                >
                                    {g.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected group header */}
                    {selectedGroup && (
                        <div className="px-4 md:px-6 pt-6 flex items-center gap-3">
                            <button
                                onClick={() => setSelectedGroup(null)}
                                className="p-1.5 rounded-full hover:bg-surface transition-colors text-muted-foreground"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-xl font-bold">{selectedGroup}</h2>
                            <span className="text-sm text-muted-foreground">
                                {filteredChannels.length} canais
                            </span>
                        </div>
                    )}

                    {/* Video Grid */}
                    <div className="px-4 md:px-6 py-6">
                        {filteredChannels.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                                {filteredChannels.slice(0, 80).map((channel, i) => (
                                    <ChannelCard
                                        key={channel.id}
                                        channel={channel}
                                        onClick={setSelectedChannel}
                                        delay={Math.min(i * 20, 400)}
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

                        {filteredChannels.length > 80 && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                Mostrando 80 de {filteredChannels.length} canais. Use a busca para
                                encontrar canais específicos.
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Player Modal */}
            {selectedChannel && (
                <PlayerModal
                    channel={selectedChannel}
                    onClose={() => setSelectedChannel(null)}
                />
            )}
        </div>
    );
}
