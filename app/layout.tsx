import type { Metadata } from "next";
import { Amethysta } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/SmoothCursor";

const amethysta = Amethysta({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-amethysta",
});

export const metadata: Metadata = {
  title: "IPTV Brasil 2026 — Canais ao Vivo",
  icons: {
    icon: "/favicon.png",
  },
  description:
    "Acesse centenas de canais brasileiros ao vivo: Globo, SBT, Record, Band, esportes, notícias e muito mais. Gratuito e organizado.",
  keywords: [
    "iptv",
    "canais brasileiros",
    "tv ao vivo",
    "streaming",
    "globo",
    "sbt",
    "record",
    "band",
  ],
  openGraph: {
    title: "IPTV Brasil 2026",
    description: "Centenas de canais brasileiros ao vivo, grátis e organizados.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn(amethysta.variable)}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
