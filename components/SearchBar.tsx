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
    placeholder = "Buscar canais...",
}: SearchBarProps) {
    return (
        <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
                type="text"
                className="search-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {value && (
                <button className="search-clear" onClick={() => onChange("")}>
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
