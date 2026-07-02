"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown, Flame, Skull, BookOpen } from "lucide-react";
import { AshField } from "./AshField";
import { FogLayer } from "./FogLayer";
import { useSound } from "./SoundManager";
import { useDS3Store, type DS3Page } from "./useDS3Store";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { play } = useSound();
  const { setPage } = useDS3Store();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const ySky = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const yFront = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Mouse parallax
  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--mx", `${x * 20}px`);
    el.style.setProperty("--my", `${y * 20}px`);
  };

  const goTo = (p: DS3Page) => {
    play("click");
    setPage(p);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMouseMove}
      className="vignette relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Home page background — real Dark Souls III wallpaper */}
      <motion.div
        style={{ y: reduce ? 0 : ySky }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 animate-slow-pan bg-cover bg-center"
          style={{ backgroundImage: "url(/home-bg.jpg)" }}
        />
        {/* Cinematic dark gradient + ember horizon glow over the image for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,4,3,0.7) 0%, rgba(5,4,3,0.3) 28%, rgba(5,4,3,0.7) 72%, rgba(5,4,3,0.98) 100%)",
          }}
        />
        {/* Subtle ember warm-up at the base */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 100%, rgba(255,90,20,0.22), transparent 70%)",
          }}
        />
      </motion.div>

      {/* Gothic cathedral / ruined castle silhouette */}
      <motion.div
        style={{ y: reduce ? 0 : yMid }}
        className="absolute inset-x-0 bottom-0"
        aria-hidden
      >
        <GothicSilhouette />
      </motion.div>

      {/* Bonfire glow at the base */}
      <motion.div
        style={{ y: reduce ? 0 : yFront }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        aria-hidden
      >
        <div
          className="absolute inset-x-0 bottom-0 h-40 animate-flicker"
          style={{
            background:
              "radial-gradient(50% 100% at 50% 100%, rgba(255,140,40,0.5), rgba(255,80,20,0.15) 40%, transparent 75%)",
          }}
        />
      </motion.div>

      {/* Fog + ash */}
      <FogLayer intensity="heavy" className="absolute inset-0 z-[5]" />
      <AshField density={1.3} variant="ember" className="absolute inset-0 z-[6]" />

      {/* Content */}
      <motion.div
        style={{ y: reduce ? 0 : yContent, opacity }}
        className="relative z-20 flex flex-col items-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="section-eyebrow mb-6"
        >
          FromSoftware · A Fading Flame
        </motion.p>

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-5xl font-black leading-[0.95] tracking-[0.12em] text-ash sm:text-7xl md:text-8xl lg:text-9xl"
        >
          <span className="block shimmer-gold">DARK SOULS</span>
          <span className="mt-2 block font-display-deco text-6xl font-black text-glow-ember text-ember sm:text-8xl md:text-9xl lg:text-[10rem]">
            III
          </span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-8 h-px w-64 origin-center bg-gradient-to-r from-transparent via-gold to-transparent sm:w-96"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-6 font-display text-base tracking-[0.4em] text-gold-bright text-glow-gold uppercase sm:text-xl"
        >
          Prepare to Die Once More
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.2 }}
          className="mt-6 max-w-xl font-serif text-sm leading-relaxed text-ash/60 sm:text-base"
        >
          The fire fades, and the lords go without thrones. Rise, accursed undead,
          and journey through the dying kingdom of Lothric — where every soul is a
          story, and every story ends in ash.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => goTo("story")}
            onMouseEnter={() => play("hover")}
            className="btn-ember animate-pulse-glow group flex items-center gap-2 px-7 py-3 font-display text-sm tracking-[0.2em] uppercase"
          >
            <Flame className="h-4 w-4" />
            Enter the Kingdom
          </button>
          <button
            onClick={() => goTo("bosses")}
            onMouseEnter={() => play("hover")}
            className="btn-ember group flex items-center gap-2 px-7 py-3 font-display text-sm tracking-[0.2em] uppercase"
          >
            <Skull className="h-4 w-4" />
            Begin Journey
          </button>
          <button
            onClick={() => goTo("lore")}
            onMouseEnter={() => play("hover")}
            className="btn-ember group flex items-center gap-2 px-7 py-3 font-display text-sm tracking-[0.2em] uppercase"
          >
            <BookOpen className="h-4 w-4" />
            Explore Lore
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => goTo("story")}
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-ash/50 transition-colors hover:text-gold-bright"
        aria-label="Scroll down"
      >
        <span className="font-serif text-[0.65rem] tracking-[0.3em] uppercase">
          Descend
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.button>

      {/* Lightning flash overlay (occasional) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(200,210,255,0.18), transparent 50%)",
          animation: "lightning 14s infinite",
        }}
      />
    </section>
  );
}

/** Stylized ruined gothic cathedral / castle silhouette (SVG). */
function GothicSilhouette() {
  return (
    <svg
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMax slice"
      className="h-[55vh] w-full md:h-[60vh]"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#050403" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* Distant range */}
      <path
        d="M0,300 L120,250 L220,290 L340,230 L460,280 L600,240 L760,290 L900,250 L1060,290 L1200,240 L1340,280 L1440,250 L1440,400 L0,400 Z"
        fill="#0c0907"
        opacity="0.7"
      />
      {/* Main ruined cathedral cluster */}
      <g fill="url(#sil)">
        {/* Left tower */}
        <path d="M120,400 L120,180 L140,160 L140,140 L155,150 L155,170 L175,160 L175,400 Z" />
        <rect x="118" y="200" width="60" height="6" fill="#1a1208" />
        {/* Broken spire */}
        <path d="M250,400 L250,210 L262,200 L262,150 L278,160 L278,205 L300,210 L300,400 Z" />
        <path d="M262,150 L262,120 L270,110 L278,120 L278,150" opacity="0.85" />
        {/* Central grand cathedral */}
        <path d="M420,400 L420,170 L460,140 L470,100 L485,80 L500,100 L510,140 L550,170 L550,400 Z" />
        <rect x="430" y="210" width="20" height="50" fill="#2a1a0c" opacity="0.7" />
        <rect x="510" y="210" width="20" height="50" fill="#2a1a0c" opacity="0.7" />
        {/* Rose window hint */}
        <circle cx="485" cy="200" r="14" fill="#3a1f0a" opacity="0.6" />
        {/* Right towers */}
        <path d="M640,400 L640,190 L660,170 L660,130 L675,140 L675,180 L700,190 L700,400 Z" />
        <path d="M740,400 L740,220 L760,200 L760,160 L775,170 L775,205 L800,220 L800,400 Z" />
        {/* Collapsed section */}
        <path d="M880,400 L880,260 L900,250 L900,230 L920,240 L920,265 L950,260 L950,400 Z" />
        {/* Right distant tower */}
        <path d="M1080,400 L1080,200 L1100,180 L1100,150 L1115,160 L1115,195 L1140,205 L1140,400 Z" />
        <path d="M1240,400 L1240,230 L1260,215 L1260,180 L1275,190 L1275,225 L1300,235 L1300,400 Z" />
        {/* Ground / wall */}
        <rect x="0" y="380" width="1440" height="20" />
      </g>
      {/* Bonfire */}
      <g transform="translate(700,372)">
        <ellipse cx="0" cy="20" rx="40" ry="6" fill="#000" opacity="0.6" />
        <path d="M-14,18 L14,18 L10,4 L4,-6 L0,-18 L-4,-6 L-10,4 Z" fill="#3a1a08" />
        <path
          d="M-8,16 L8,16 L6,6 L2,-2 L0,-10 L-2,-2 L-6,6 Z"
          fill="#ff7a18"
          opacity="0.9"
        >
          <animate
            attributeName="opacity"
            values="0.85;0.55;1;0.7;0.9"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </path>
        {/* Coiled sword */}
        <path d="M0,-10 L0,-40 L-2,-44 L2,-44 L0,-40" stroke="#8a8174" strokeWidth="2" fill="none" />
        <circle cx="0" cy="-44" r="2" fill="#c5a059" />
      </g>
    </svg>
  );
}

export default Hero;
