import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "IPTV Brasil 2026 — Canais ao Vivo",
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
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
