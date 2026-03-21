"use client";

import { useState, useMemo } from "react";
import { Zap, Radio, Tv } from "lucide-react";
import type { Channel } from "@/lib/m3uParser";
import Navbar from "@/components/Navbar";
import ChannelCard from "@/components/ChannelCard";
import CategoryCard from "@/components/CategoryCard";
import PlayerModal from "@/components/PlayerModal";

interface HomeClientProps {
    channels: Channel[];
    groups: { name: string; count: number; icon: string }[];
}

export default function HomeClient({ channels, groups }: HomeClientProps) {
    const [search, setSearch] = useState("");
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

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

    const qualityStats = useMemo(() => {
        const fhd = channels.filter((c) => c.quality === "FHD").length;
        const hd = channels.filter((c) => c.quality === "HD").length;
        return { fhd, hd, total: channels.length };
    }, [channels]);

    const handleGroupClick = (groupName: string) => {
        setSelectedGroup(selectedGroup === groupName ? null : groupName);
    };

    return (
        <>
            <Navbar searchValue={search} onSearchChange={setSearch} />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-grid" />
                <div className="hero-content">
                    <div className="hero-badge">
                        <Zap size={14} />
                        Streaming ao vivo — 2026
                    </div>

                    <h1 className="hero-title">
                        TV ao vivo.
                        <br />
                        <span className="highlight">Sem limites.</span>
                    </h1>

                    <p className="hero-subtitle">
                        Acesse centenas de canais brasileiros ao vivo, organizados por
                        categoria. Globo, SBT, Record, Band, esportes, notícias e muito
                        mais.
                    </p>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-value">{qualityStats.total}+</div>
                            <div className="hero-stat-label">Canais</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">{groups.length}</div>
                            <div className="hero-stat-label">Categorias</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">{qualityStats.fhd}</div>
                            <div className="hero-stat-label">Full HD</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section" id="categorias">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="accent">Categorias</span>
                    </h2>
                    <span className="section-count">{groups.length} categorias</span>
                </div>

                <div className="categories-grid">
                    {groups.map((group, i) => (
                        <CategoryCard
                            key={group.name}
                            name={group.name}
                            count={group.count}
                            icon={group.icon}
                            isActive={selectedGroup === group.name}
                            onClick={() => handleGroupClick(group.name)}
                            delay={i * 40}
                        />
                    ))}
                </div>
            </section>

            {/* Channels */}
            <section className="section" id="canais">
                <div className="section-header">
                    <h2 className="section-title">
                        {selectedGroup ? (
                            <>
                                <span className="accent">{selectedGroup}</span>
                            </>
                        ) : (
                            <>
                                Todos os <span className="accent">Canais</span>
                            </>
                        )}
                    </h2>
                    <span className="section-count">
                        {filteredChannels.length} canais
                    </span>
                </div>

                {/* Quality filter chips */}
                <div className="filter-bar">
                    <button
                        className={`filter-chip${!selectedGroup ? " active" : ""}`}
                        onClick={() => setSelectedGroup(null)}
                    >
                        <Radio size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                        Todos
                    </button>
                    {groups.slice(0, 8).map((g) => (
                        <button
                            key={g.name}
                            className={`filter-chip${selectedGroup === g.name ? " active" : ""
                                }`}
                            onClick={() => handleGroupClick(g.name)}
                        >
                            {g.name}
                        </button>
                    ))}
                </div>

                {filteredChannels.length > 0 ? (
                    <div className="channels-grid">
                        {filteredChannels.slice(0, 60).map((channel, i) => (
                            <ChannelCard
                                key={channel.id}
                                channel={channel}
                                onClick={setSelectedChannel}
                                delay={Math.min(i * 30, 600)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Tv size={48} className="empty-state-icon" />
                        <div className="empty-state-title">Nenhum canal encontrado</div>
                        <div className="empty-state-text">
                            Tente buscar por outro termo ou selecione uma categoria diferente.
                        </div>
                    </div>
                )}

                {filteredChannels.length > 60 && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "32px 0",
                            color: "var(--color-text-muted)",
                            fontSize: "14px",
                        }}
                    >
                        Mostrando 60 de {filteredChannels.length} canais. Use a busca para
                        encontrar canais específicos.
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        IPTV <span>Brasil</span> 2026
                    </div>
                    <p className="footer-text">
                        Todas as ligações de streams disponibilizados nas listas foram
                        retiradas da internet. A comunidade apenas as organiza, disponibiliza
                        e partilha.
                    </p>
                    <div className="footer-bottom">
                        © 2026 IPTV Brasil. Projeto open-source.
                    </div>
                </div>
            </footer>

            {/* Player Modal */}
            {selectedChannel && (
                <PlayerModal
                    channel={selectedChannel}
                    onClose={() => setSelectedChannel(null)}
                />
            )}
        </>
    );
}
