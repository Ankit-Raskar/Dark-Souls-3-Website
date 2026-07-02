"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Skull, MapPin, Heart, Droplet, Package } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { enemies, type Enemy } from "@/data/ds3";
import { useSound } from "../SoundManager";

export function EnemiesSection() {
  const [selected, setSelected] = useState<Enemy | null>(null);
  const { play } = useSound();

  return (
    <PageShell
      id="enemies"
      eyebrow="The Hollowed Host"
      title="Enemies"
      intro="Not every foe is a lord. The hollows, knights, demons, and beasts of Lothric will fell you a hundred times before you reach the kiln. Know thy enemy."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {enemies.map((e, i) => (
          <SectionReveal key={e.id} delay={(i % 4) * 0.04}>
            <ParchmentCard className="h-full p-5">
              <div className="mb-3 flex h-16 items-center justify-center overflow-hidden rounded-sm border border-gold/10 bg-gradient-to-b from-charcoal to-soot">
                <EnemyGlyph name={e.name} />
              </div>
              <h3 className="font-display text-sm text-gold-bright">{e.name}</h3>
              <p className="mt-1 flex items-center gap-1 font-serif text-[0.7rem] text-ash/60">
                <MapPin className="h-3 w-3 text-ember" /> {e.location}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <ThreatMeter value={e.threat} />
                <span className="flex items-center gap-1 font-serif text-xs text-ash/60">
                  <Heart className="h-3 w-3 text-blood-bright" /> {e.hp}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelected(e);
                  play("click");
                }}
                onMouseEnter={() => play("hover")}
                className="mt-3 w-full border border-gold/20 py-1.5 font-display text-[0.65rem] tracking-[0.2em] text-ash/70 uppercase transition-all hover:border-ember/50 hover:text-ember"
              >
                Bestiary
              </button>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </div>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name}>
        {selected && (
          <div>
            <div className="mb-6 flex h-32 items-center justify-center rounded-sm border border-gold/15 bg-gradient-to-b from-charcoal to-soot">
              <EnemyGlyph name={selected.name} large />
            </div>
            <h3 className="font-display text-3xl text-gold-bright text-glow-gold">{selected.name}</h3>
            <p className="mt-1 flex items-center gap-1 font-serif text-sm text-ash/60">
              <MapPin className="h-3 w-3 text-ember" /> {selected.location}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="parchment rounded-sm border border-gold/15 p-3 text-center">
                <div className="font-serif text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                  HP
                </div>
                <div className="mt-1 font-display text-lg text-blood-bright">{selected.hp}</div>
              </div>
              <div className="parchment rounded-sm border border-gold/15 p-3 text-center">
                <div className="font-serif text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                  Threat
                </div>
                <div className="mt-1 flex justify-center">
                  <ThreatMeter value={selected.threat} />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  <Droplet className="h-4 w-4 text-ember" /> Weaknesses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.weaknesses.map((w) => (
                    <Tag key={w} variant="ember">
                      {w}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  <Package className="h-4 w-4 text-ember" /> Drops
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.drops.map((d, i) => (
                    <Tag key={i} variant="muted">
                      {d}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-1 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  <Skull className="h-4 w-4 text-ember" /> Lore
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

function ThreatMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" title={`Threat ${value}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rotate-45 ${
            i < value ? "bg-blood-bright shadow-[0_0_5px_rgba(185,28,28,0.7)]" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

function EnemyGlyph({ name, large }: { name: string; large?: boolean }) {
  const size = large ? 70 : 36;
  const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`en-${name}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={`hsl(${hue},40%,25%)`} stopOpacity="0.7" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="42" r="30" fill={`url(#en-${name})`} />
      <path
        d="M50,25 C60,25 65,33 65,42 C65,50 60,55 55,57 L60,80 L40,80 L45,57 C40,55 35,50 35,42 C35,33 40,25 50,25 Z"
        fill="#000"
        opacity="0.9"
      />
      <circle cx="46" cy="40" r="1.8" fill="#ff7a18" />
      <circle cx="54" cy="40" r="1.8" fill="#ff7a18" />
    </svg>
  );
}

export default EnemiesSection;
