"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Youtube, Clock } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { videos, type VideoCategory } from "@/data/ds3";
import { useSound } from "../SoundManager";

const FILTERS: (VideoCategory | "All")[] = [
  "All",
  "Launch Trailer",
  "Gameplay",
  "Bosses",
  "Lore",
  "Music",
  "Developer",
];

export function VideosSection() {
  const [filter, setFilter] = useState<VideoCategory | "All">("All");
  const [active, setActive] = useState<(typeof videos)[number] | null>(null);
  const { play } = useSound();

  const list = filter === "All" ? videos : videos.filter((v) => v.category === filter);

  return (
    <PageShell
      id="videos"
      eyebrow="Moving Pictures of the End"
      title="Videos"
      intro="Official trailers, gameplay, and developer glimpses into the world of Dark Souls III. Embedded from authorized video platforms."
    >
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              play("click");
            }}
            onMouseEnter={() => play("hover")}
            className={`border px-3 py-1.5 font-serif text-xs tracking-wide transition-all ${
              filter === f
                ? "border-ember bg-ember/10 text-ember"
                : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v, i) => (
          <SectionReveal key={v.id} delay={(i % 3) * 0.06}>
            <ParchmentCard className="h-full p-0">
              <button
                onClick={() => {
                  setActive(v);
                  play("click");
                }}
                onMouseEnter={() => play("hover")}
                className="group block w-full text-left"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden border-b border-gold/15 bg-gradient-to-b from-charcoal to-soot">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(60% 80% at 50% 40%, rgba(139,0,0,0.4), #0a0604 75%)",
                    }}
                  />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/40 bg-soot/60 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:border-ember group-hover:shadow-[0_0_24px_rgba(255,122,24,0.5)]">
                      <Play className="h-5 w-5 fill-gold text-gold group-hover:fill-ember group-hover:text-ember" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-sm border border-gold/20 bg-soot/70 px-1.5 py-0.5">
                    <Clock className="h-2.5 w-2.5 text-gold" />
                    <span className="font-serif text-[0.6rem] text-ash/70">{v.duration}</span>
                  </div>
                </div>
                <div className="p-4">
                  <Tag variant="ember">{v.category}</Tag>
                  <h3 className="mt-2 font-display text-sm text-gold-bright">{v.title}</h3>
                  <p className="mt-1 line-clamp-2 font-serif text-xs text-ash/60">
                    {v.description}
                  </p>
                </div>
              </button>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </div>

      {/* Player modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <Tag variant="ember">{active.category}</Tag>
                  <h3 className="mt-1 font-display text-lg text-gold-bright">{active.title}</h3>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-ash hover:border-ember hover:text-ember"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="aspect-video overflow-hidden rounded-sm border border-gold/20 bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
                  title={active.title}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-3 flex items-center gap-2 font-serif text-sm italic text-ash/60">
                <Youtube className="h-4 w-4 text-ember" /> {active.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

export default VideosSection;
