"use client";

interface CategoryCardProps {
    name: string;
    count: number;
    icon: string;
    isActive: boolean;
    onClick: () => void;
    delay?: number;
}

export default function CategoryCard({
    name,
    count,
    icon,
    isActive,
    onClick,
    delay = 0,
}: CategoryCardProps) {
    return (
        <button
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 animate-slide-up hover-glow text-left ${isActive
                    ? "bg-primary/10 border-primary text-white"
                    : "glass-panel text-muted-foreground hover:text-white"
                }`}
            onClick={onClick}
            style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-xl ${isActive ? "bg-primary/20 text-primary" : "bg-surface-alt/50"
                }`}>
                {icon}
            </div>
            <div className="flex flex-col min-w-0">
                <span className={`text-sm font-semibold truncate ${isActive ? "text-primary" : ""}`}>
                    {name}
                </span>
                <span className="text-xs opacity-70">{count} canais</span>
            </div>
        </button>
    );
}
