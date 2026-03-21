"use client";

import SearchBar from "./SearchBar";
import Link from "next/link";
import Image from "next/image";
import { Menu, Bell, User } from "lucide-react";

interface NavbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onToggleSidebar?: () => void;
}

export default function Navbar({ searchValue, onSearchChange, onToggleSidebar }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b border-border/30">
            <div className="h-full px-4 flex items-center justify-between gap-4">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-full hover:bg-surface transition-colors text-foreground"
                        title="Menu"
                    >
                        <Menu size={20} />
                    </button>
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/teste2.png"
                            alt="Logo"
                            width={120}
                            height={60}
                            className="drop-shadow-md object-contain"
                        />
                    </Link>
                </div>

                {/* Center: Search */}
                <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
                    <SearchBar
                        value={searchValue}
                        onChange={onSearchChange}
                        placeholder="Pesquisar"
                    />
                </div>

                {/* Right: Action Icons */}
                <div className="flex items-center gap-1 shrink-0">
                    <div className="sm:hidden">
                        <SearchBar
                            value={searchValue}
                            onChange={onSearchChange}
                            placeholder="Pesquisar"
                        />
                    </div>
                    <button className="p-2 rounded-full hover:bg-surface transition-colors text-foreground hidden md:flex" title="Notificações">
                        <Bell size={20} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-background ml-2" title="Perfil">
                        <User size={16} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
