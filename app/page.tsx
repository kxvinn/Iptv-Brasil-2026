"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PiTelevisionSimpleBold, PiFilmSlateBold, PiLightningBold, PiGhostBold, PiShieldCheckBold, PiWifiHighBold, PiGlobeBold, PiPlayCircleBold, PiArrowRightBold, PiCaretDownBold } from "react-icons/pi";
import { HiOutlineSignal } from "react-icons/hi2";
import { RiLiveLine } from "react-icons/ri";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    }),
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" as any },
    }),
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Floating Navbar */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-4 left-4 right-4 z-50 bg-card/50 backdrop-blur-2xl border border-border/20 rounded-2xl"
            >
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Image src="/teste2.png" alt="Logo" width={100} height={50} className="object-contain" />
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-[#D1DABE]/60 hover:text-[#D1DABE] transition-colors duration-200 cursor-pointer">Recursos</a>
                    </nav>
                    <Link
                        href="/tv"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-background text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
                    >
                        <PiPlayCircleBold size={16} />
                        Assistir
                    </Link>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
                {/* Background Video */}
                <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                        }}
                    >
                        <source src="/videolp.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* BG effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />
                <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-[#D1DABE]/5 rounded-full blur-[100px] pointer-events-none z-0" />

                <div className="relative z-10 text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D1DABE]/15 bg-[#D1DABE]/5 mb-10"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                        <RiLiveLine className="text-red-400" size={14} />
                        <span className="text-xs font-medium text-[#D1DABE]/70 tracking-widest uppercase">Streaming ao vivo</span>
                    </motion.div>

                    {/* Logo */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        className="mb-8"
                    >
                        <Image
                            src="/teste2.png"
                            alt="Tiger TV"
                            width={200}
                            height={140}
                            className="mx-auto drop-shadow-[0_0_50px_rgba(245,184,46,0.12)]"
                            priority
                        />
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
                    >
                        <span className="text-[#D1DABE]">Sua TV.</span>
                        <br />
                        <span className="text-primary">Sem limites.</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        className="text-base md:text-lg text-[#D1DABE]/50 max-w-xl mx-auto leading-relaxed mb-12"
                    >
                        Centenas de canais ao vivo em qualidade Full HD.
                        Esportes, notícias, filmes e séries — tudo em um só lugar.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={4}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/tv"
                            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-primary text-background font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(245,184,46,0.25)] transition-all duration-300 cursor-pointer"
                        >
                            <PiPlayCircleBold size={20} />
                            Começar a assistir
                            <PiArrowRightBold size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 px-8 py-4 border border-[#D1DABE]/15 text-[#D1DABE]/80 font-semibold rounded-2xl hover:bg-[#D1DABE]/5 hover:border-[#D1DABE]/30 hover:text-[#D1DABE] transition-all duration-300 cursor-pointer"
                        >
                            Saiba mais
                        </a>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#D1DABE]/20 animate-bounce cursor-pointer"
                >
                    <a href="#features">
                        <PiCaretDownBold size={24} />
                    </a>
                </motion.div>
            </section>

            {/* Features */}
            <section id="features" className="px-6 py-28 max-w-6xl mx-auto">
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Tudo que você <span className="text-primary">precisa</span>
                    </h2>
                    <p className="text-[#D1DABE]/40 max-w-lg mx-auto">
                        Uma plataforma completa para assistir TV ao vivo com a melhor experiência.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { icon: HiOutlineSignal, title: "Ao Vivo", desc: "Canais abertos e fechados transmitindo 24 horas em tempo real." },
                        { icon: PiWifiHighBold, title: "Full HD", desc: "Streams em alta qualidade, com até 1080p de resolução." },
                        { icon: PiGlobeBold, title: "50+ Categorias", desc: "Esportes, notícias, filmes, séries, infantil e muito mais." },
                        { icon: PiShieldCheckBold, title: "Proxy Seguro", desc: "Streams roteados com proxy interno para máxima compatibilidade." },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            variants={scaleIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            custom={i}
                            className="group p-6 rounded-2xl border border-border/20 bg-card/20 hover:bg-card/50 hover:border-[#D1DABE]/15 transition-all duration-300 cursor-default"
                        >
                            <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                                <Icon size={22} />
                            </div>
                            <h3 className="text-base font-semibold text-[#D1DABE] mb-2">{title}</h3>
                            <p className="text-sm text-[#D1DABE]/40 leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Content Type Cards */}
            <section id="content" className="px-6 pb-28 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { href: "/tv", icon: PiTelevisionSimpleBold, label: "Live", title: "TV Ao Vivo", desc: "Centenas de canais em tempo real" },
                        { href: "/tv?filter=filmes", icon: PiFilmSlateBold, label: "Cinema", title: "Filmes", desc: "Lançamentos e clássicos" },
                        { href: "/tv?filter=series", icon: PiLightningBold, label: "Maratona", title: "Séries", desc: "Temporadas completas" },
                        { href: "/tv?filter=animes", icon: PiGhostBold, label: "Otaku", title: "Animes", desc: "Mundos e aventuras épicas" },
                    ].map(({ href, icon: Icon, label, title, desc }, i) => (
                        <motion.div
                            key={title}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            custom={i}
                        >
                            <Link href={href} className="group block cursor-pointer">
                                <div className="relative overflow-hidden rounded-2xl border border-border/20 bg-card/15 p-8 h-56 flex flex-col justify-end hover:border-primary/25 hover:bg-card/30 transition-all duration-300">
                                    <div className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                                        <Icon size={30} />
                                    </div>
                                    <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-2">{label}</span>
                                    <h3 className="text-xl font-bold text-[#D1DABE] group-hover:text-primary transition-colors duration-200">{title}</h3>
                                    <p className="text-sm text-[#D1DABE]/35 mt-1">{desc}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section id="stats" className="border-t border-border/15">
                <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                    {[
                        { value: "500+", label: "Canais" },
                        { value: "50+", label: "Categorias" },
                        { value: "FHD", label: "Qualidade", highlight: true },
                        { value: "24/7", label: "Disponível" },
                    ].map(({ value, label, highlight }, i) => (
                        <motion.div
                            key={label}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={i}
                        >
                            <div className={`text-3xl md:text-4xl font-extrabold tracking-tight ${highlight ? "text-primary" : "text-[#D1DABE]"}`}>
                                {value}
                            </div>
                            <div className="text-sm text-[#D1DABE]/35 mt-2 font-medium">{label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/10 py-10 text-center">
                <p className="text-xs text-[#D1DABE]/20 tracking-wide">
                    © 2026 · Tiger TV.
                </p>
            </footer>
        </div>
    );
}
