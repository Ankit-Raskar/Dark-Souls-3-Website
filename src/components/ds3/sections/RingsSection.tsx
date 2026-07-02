"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { rings, type Ring, type RingCategory } from "@/data/ds3";
import { useSound } from "../SoundManager";

const FILTERS: (RingCategory | "All")[] = ["All", "Utility", "Defense", "Offense", "Covenant"];

export function RingsSection() {
  const [filter, setFilter] = useState<RingCategory | "All">("All");
  const [selected, setSelected] = useState<Ring | null>(null);
  const { play } = useSound();

  const list = useMemo(
    () => (filter === "All" ? rings : rings.filter((r) => r.category === filter)),
    [filter]
  );

  return (
    <PageShell
      id="rings"
      eyebrow="Bands of Binding Power"
      title="Rings"
      intro="Four slots. Forty-five rings. From the humble Life Ring to the accursed Calamity — each grants power at a price, and many grow stronger across NG+ cycles."
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
            className={`border px-4 py-2 font-display text-xs tracking-[0.2em] uppercase transition-all ${
              filter === f
                ? "border-ember bg-ember/10 text-ember shadow-[0_0_16px_rgba(255,122,24,0.3)]"
                : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((r, i) => (
          <SectionReveal key={r.id} delay={(i % 4) * 0.04}>
            <ParchmentCard className="h-full p-5">
              <div className="mb-3 flex h-20 items-center justify-center">
                <RingGlyph name={r.name} />
              </div>
              <h3 className="font-display text-sm text-gold-bright">{r.name}</h3>
              <p className="mt-2 line-clamp-2 font-serif text-xs text-ash/70">{r.effect}</p>
              <div className="mt-3 flex items-center justify-between">
                <Tag variant={categoryVariant(r.category)}>{r.category}</Tag>
                <button
                  onClick={() => {
                    setSelected(r);
                    play("click");
                  }}
                  onMouseEnter={() => play("hover")}
                  className="font-display text-[0.65rem] tracking-[0.2em] text-ember/80 uppercase hover:text-ember"
                >
                  Lore →
                </button>
              </div>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </motion.div>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name}>
        {selected && (
          <div>
            <div className="mb-6 flex h-32 items-center justify-center rounded-sm border border-gold/15 bg-gradient-to-b from-charcoal to-soot">
              <RingGlyph name={selected.name} large />
            </div>
            <Tag variant={categoryVariant(selected.category)}>{selected.category}</Tag>
            <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold">
              {selected.name}
            </h3>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="mb-1 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  <Sparkles className="h-4 w-4 text-ember" /> Effect
                </h4>
                <p className="font-serif text-sm leading-relaxed text-ash/80">{selected.effect}</p>
              </div>
              <div>
                <h4 className="mb-1 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  Variants
                </h4>
                <p className="font-serif text-sm text-ash/75">{selected.variants}</p>
              </div>
              <div>
                <h4 className="mb-1 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  Location
                </h4>
                <p className="flex items-center gap-2 font-serif text-sm text-ash/75">
                  <MapPin className="h-3 w-3 text-ember" /> {selected.location}
                </p>
              </div>
              <div>
                <h4 className="mb-1 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  Lore
                </h4>
                <p className="font-serif text-sm italic leading-relaxed text-ash/80">
                  {selected.lore}
                </p>
              </div>
            </div>
          </div>
        )}
      </DetailDialog>
    </PageShell>
  );
}

function categoryVariant(c: RingCategory): "gold" | "ember" | "blood" | "muted" {
  switch (c) {
    case "Offense":
      return "blood";
    case "Defense":
      return "gold";
    case "Covenant":
      return "ember";
    default:
      return "muted";
  }
}

function RingGlyph({ name, large }: { name: string; large?: boolean }) {
  const size = large ? 90 : 50;
  const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`rg-${name}`} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor={`hsl(${hue},60%,45%)`} stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="34" fill={`url(#rg-${name})`} />
      <circle cx="50" cy="50" r="34" stroke="#c5a059" strokeWidth="2" />
      <circle cx="50" cy="50" r="22" stroke="#c5a059" strokeWidth="1" opacity="0.6" />
      <circle cx="50" cy="50" r="6" fill={`hsl(${hue},70%,50%)`} opacity="0.7" />
    </svg>
  );
}

export default RingsSection;
