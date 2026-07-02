"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Weight, Scale, MapPin } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { armorSets, type ArmorSet } from "@/data/ds3";
import { useSound } from "../SoundManager";

export function ArmorSection() {
  const [selected, setSelected] = useState<ArmorSet | null>(null);
  const { play } = useSound();

  return (
    <PageShell
      id="armor"
      eyebrow="Garb of the Fallen"
      title="Armor Sets"
      intro="Knights, heralds, exiles, and kings — their raiment scattered across Lothric. Each set tells of a life, a vow, a fall. Don the steel of legends."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {armorSets.map((a, i) => (
          <SectionReveal key={a.id} delay={(i % 4) * 0.04}>
            <ParchmentCard className="h-full p-5">
              {/* Set crest */}
              <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-sm border border-gold/10 bg-gradient-to-b from-charcoal to-soot">
                <ArmorCrest name={a.name} />
              </div>
              <h3 className="font-display text-sm text-gold-bright">{a.name}</h3>
              <div className="mt-2 flex items-center justify-between font-serif text-xs text-ash/70">
                <span className="flex items-center gap-1">
                  <Weight className="h-3 w-3 text-gold" /> {a.weight}
                </span>
                <span className="flex items-center gap-1">
                  <Scale className="h-3 w-3 text-ember" /> {a.poise}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelected(a);
                  play("click");
                }}
                onMouseEnter={() => play("hover")}
                className="mt-3 w-full border border-gold/20 py-1.5 font-display text-[0.65rem] tracking-[0.2em] text-ash/70 uppercase transition-all hover:border-ember/50 hover:text-ember"
              >
                Examine
              </button>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </div>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name}>
        {selected && (
          <div>
            <div className="mb-6 flex h-32 items-center justify-center rounded-sm border border-gold/15 bg-gradient-to-b from-charcoal to-soot">
              <ArmorCrest name={selected.name} large />
            </div>
            <h3 className="font-display text-3xl text-gold-bright text-glow-gold">
              {selected.name}
            </h3>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="Total Weight" value={String(selected.weight)} />
              <Stat label="Poise" value={String(selected.poise)} />
              <Stat label="Physical Def" value={String(selected.physicalDef)} />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="mb-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  Pieces
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.pieces.map((p, i) => (
                    <Tag key={i} variant="gold">
                      <Shield className="h-3 w-3" /> {p}
                    </Tag>
                  ))}
                </div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="parchment rounded-sm border border-gold/15 p-3 text-center">
      <div className="font-serif text-[0.6rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-lg text-gold-bright">{value}</div>
    </div>
  );
}

function ArmorCrest({ name, large }: { name: string; large?: boolean }) {
  const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const size = large ? 90 : 56;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`ag-${name}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={`hsl(${hue},55%,40%)`} stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="40" r="34" fill={`url(#ag-${name})`} />
      {/* Shield silhouette */}
      <path
        d="M50,20 L72,28 L72,52 Q72,70 50,80 Q28,70 28,52 L28,28 Z"
        stroke="#c5a059"
        strokeWidth="2"
        fill="rgba(20,15,10,0.6)"
      />
      <path d="M50,30 L50,68 M38,42 L62,42" stroke="#c5a059" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}

export default ArmorSection;
