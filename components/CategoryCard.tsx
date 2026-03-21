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
            className={`category-card${isActive ? " active" : ""}`}
            onClick={onClick}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="category-icon">{icon}</div>
            <div className="category-info">
                <div className="category-name">{name}</div>
                <div className="category-count">{count} canais</div>
            </div>
        </button>
    );
}
