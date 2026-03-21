"use client";

import SearchBar from "./SearchBar";

interface NavbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
}

export default function Navbar({ searchValue, onSearchChange }: NavbarProps) {
    return (
        <nav className="navbar">
            <a href="/" className="navbar-logo">
                <span className="logo-dot" />
                IPTV <span>Brasil</span>
            </a>

            <div className="navbar-right">
                <div className="navbar-links">
                    <a href="#categorias">Categorias</a>
                    <a href="#canais">Canais</a>
                </div>
                <SearchBar
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder="Buscar canais..."
                />
            </div>
        </nav>
    );
}
