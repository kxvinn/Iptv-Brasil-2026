export default function TvLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="pt-4">
            {children}
        </div>
    );
}
