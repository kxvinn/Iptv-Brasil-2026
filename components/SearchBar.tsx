"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder = "Pesquisar",
}: SearchBarProps) {
    return (
        <div className="flex w-full">
            <div className="relative flex-1">
                <input
                    type="text"
                    className="w-full bg-background border border-border text-foreground text-sm rounded-l-full py-2.5 pl-5 pr-10 focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                {value && (
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        onClick={() => onChange("")}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
            <button className="px-5 bg-surface border border-l-0 border-border rounded-r-full hover:bg-surface-hover transition-colors text-muted-foreground">
                <Search size={18} />
            </button>
        </div>
    );
}
