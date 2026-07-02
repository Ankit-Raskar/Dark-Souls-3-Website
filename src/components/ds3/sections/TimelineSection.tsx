"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { PageShell } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { timelineEvents } from "@/data/ds3";

export function TimelineSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <PageShell
      id="timeline"
      eyebrow="An Age of Endings"
      title="Timeline"
      intro="From the dawn of the Age of Ancients to the rising of the Ashen One — the chronicle of fire, dark, and the endless cycle of sacrifice."
    >
      <div className="relative">
        {/* Scroll buttons */}
        <div className="mb-4 flex justify-end gap-2">
          <button
            onClick={() => scroll(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-gold/20 text-ash hover:border-ember hover:text-ember"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            onClick={() => scroll(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-gold/20 text-ash hover:border-ember hover:text-ember"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6"
        >
          {/* Central ember line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[7.5rem] h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />

          {timelineEvents.map((ev, i) => (
            <SectionReveal
              key={ev.id}
              delay={(i % 3) * 0.05}
              className="relative w-[20rem] shrink-0 snap-center"
            >
              <div className="flex flex-col items-center text-center">
                {/* Year node */}
                <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ember/50 bg-soot shadow-[0_0_18px_rgba(255,122,24,0.35)]">
                  <Flame className="h-5 w-5 text-ember animate-flicker" />
                </div>
                <span className="section-eyebrow mb-1">{ev.era}</span>
                <span className="font-display text-xs text-gold-bright">{ev.year}</span>
              </div>

              <motion.div
                whileHover={{ y: -4 }}
                className="parchment mt-4 rounded-sm border border-gold/15 p-5 text-left"
              >
                <h3 className="font-display text-base text-gold-bright">{ev.title}</h3>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ash/75">
                  {ev.description}
                </p>
                <div className="mt-3 font-display text-[0.65rem] tracking-[0.2em] text-muted-foreground">
                  EVENT {String(i + 1).padStart(2, "0")} / {timelineEvents.length}
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default TimelineSection;
