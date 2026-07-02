"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Maximize2 } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { EntityImage } from "../EntityImage";
import { SectionReveal } from "../SectionReveal";
import { galleryItems, type GalleryCategory } from "@/data/ds3";
import { useSound } from "../SoundManager";

const CATEGORIES: (GalleryCategory | "All")[] = [
  "All",
  "Wallpapers",
  "Bosses",
  "Characters",
  "Landscapes",
  "Artwork",
  "Screenshots",
];

export function GallerySection() {
  const [cat, setCat] = useState<GalleryCategory | "All">("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { play } = useSound();

  const list = useMemo(
    () => (cat === "All" ? galleryItems : galleryItems.filter((g) => g.category === cat)),
    [cat]
  );

  return (
    <PageShell
      id="gallery"
      eyebrow="Visions of Lothric"
      title="Gallery"
      intro="A curated bestiary of images from the dying kingdom — bosses, landscapes, characters, and artwork rendered in ash and ember."
    >
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCat(c);
              play("click");
            }}
            onMouseEnter={() => play("hover")}
            className={`border px-3 py-1.5 font-serif text-xs tracking-wide transition-all ${
              cat === c
                ? "border-ember bg-ember/10 text-ember"
                : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Masonry */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
        {list.map((item, i) => (
          <SectionReveal key={item.id} delay={(i % 4) * 0.04} className="break-inside-avoid">
            <button
              onClick={() => {
                setLightbox(i);
                play("menu");
              }}
              onMouseEnter={() => play("hover")}
              className="group relative block w-full overflow-hidden rounded-sm border border-gold/15 transition-all hover:border-ember/50"
            >
              <GalleryTile item={item} />
              <div className="absolute inset-0 bg-gradient-to-t from-soot/90 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                <Tag variant="muted" className="mb-1">
                  {item.category}
                </Tag>
                <p className="font-display text-sm text-gold-bright">{item.title}</p>
                <p className="font-serif text-xs italic text-ash/60">{item.caption}</p>
              </div>
              <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-ember/30 bg-soot/70 opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-4 w-4 text-ember" />
              </div>
            </button>
          </SectionReveal>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && list[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-ash hover:border-ember hover:text-ember"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-4xl"
            >
              <GalleryTile item={list[lightbox]} large />
              <div className="mt-3 text-center">
                <Tag variant="ember">{list[lightbox].category}</Tag>
                <h4 className="mt-2 font-display text-xl text-gold-bright">
                  {list[lightbox].title}
                </h4>
                <p className="font-serif text-sm italic text-ash/70">
                  {list[lightbox].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/**
 * Gallery tile — uses a real image with a procedural gothic fallback.
 */
function GalleryTile({
  item,
  large,
}: {
  item: (typeof galleryItems)[number];
  large?: boolean;
}) {
  const aspect =
    item.aspect === "portrait" ? "3/4" : item.aspect === "square" ? "1/1" : "4/3";
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: aspect }}
    >
      <EntityImage
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full"
        fallback={<GalleryFallback item={item} />}
      />
    </div>
  );
}

function GalleryFallback({ item }: { item: (typeof galleryItems)[number] }) {
  const seed = item.id.charCodeAt(0) + item.id.length;
  const palettes = [
    ["#2a0a06", "#5a1a08", "#ff7a18"],
    ["#0a0a14", "#1a1a3a", "#6b7fb5"],
    ["#140a0a", "#3a1a1a", "#b91c1c"],
    ["#0a0f0a", "#1a2a1a", "#c5a059"],
    ["#0f0a14", "#2a1a3a", "#a878d8"],
    ["#0a0806", "#1a1208", "#e8c878"],
  ];
  const [d, m, accent] = palettes[seed % palettes.length];
  return (
    <div
      className="h-full w-full"
      style={{ background: `radial-gradient(60% 80% at 50% 40%, ${m}, ${d} 75%)` }}
    >
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <radialGradient id={`gt-${item.id}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#gt-${item.id})`} opacity="0.6" />
        {/* Architecture */}
        <g fill="#000" opacity="0.85">
          <path d={`M0,300 L0,${180 + (seed % 40)} L40,${150 + (seed % 30)} L40,300 Z`} />
          <path d={`M360,300 L360,${190 + (seed % 30)} L400,${170 + (seed % 25)} L400,300 Z`} />
          <path d={`M${160 + (seed % 20)},300 L${160 + (seed % 20)},120 L${180 + (seed % 20)},100 L${200 + (seed % 20)},120 L${200 + (seed % 20)},300 Z`} />
          <path d={`M${220 + (seed % 20)},300 L${220 + (seed % 20)},140 L${235 + (seed % 20)},125 L${250 + (seed % 20)},140 L${250 + (seed % 20)},300 Z`} />
        </g>
        {/* Embers */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 37 + seed) % 400}
            cy={260 - ((i * 53 + seed) % 220)}
            r={1.5}
            fill={accent}
            opacity={0.7}
          />
        ))}
      </svg>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 50% 100%, rgba(255,122,24,0.12), transparent 60%)" }}
      />
    </div>
  );
}

export default GallerySection;
