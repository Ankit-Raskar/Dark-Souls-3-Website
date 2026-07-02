"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, Crown, Gift, ScrollText } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { covenants, type Covenant } from "@/data/ds3";
import { useSound } from "../SoundManager";

export function CovenantsSection() {
  const [selected, setSelected] = useState<Covenant | null>(null);
  const { play } = useSound();

  return (
    <PageShell
      id="covenants"
      eyebrow="Oaths of the Accursed"
      title="Covenants"
      intro="Eight covenants bind the undead of Lothric — to the sun, to the dark moon, to chaos, to the abyss. Pledge your sword, climb the ranks, and reap the rewards of devotion."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {covenants.map((c, i) => (
          <SectionReveal key={c.id} delay={(i % 4) * 0.06}>
            <ParchmentCard className="h-full p-6 text-center">
              <CovenantSigil name={c.name} />
              <h3 className="mt-4 font-display text-base text-gold-bright">{c.name}</h3>
              <p className="mt-2 line-clamp-3 font-serif text-xs text-ash/70">{c.description}</p>
              <div className="mt-3 flex items-center justify-center gap-3 font-serif text-[0.65rem] text-ash/60">
                <span className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-gold" /> {c.ranks.length} ranks
                </span>
              </div>
              <button
                onClick={() => {
                  setSelected(c);
                  play("menu");
                }}
                onMouseEnter={() => play("hover")}
                className="mt-4 w-full border border-gold/20 py-1.5 font-display text-[0.65rem] tracking-[0.2em] text-ash/70 uppercase transition-all hover:border-ember/50 hover:text-ember"
              >
                Swear Oath
              </button>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </div>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name}>
        {selected && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <CovenantSigil name={selected.name} large />
            </div>
            <h3 className="font-display text-3xl text-gold-bright text-glow-gold">
              {selected.name}
            </h3>
            <p className="mx-auto mt-4 max-w-xl font-serif text-sm leading-relaxed text-ash/80">
              {selected.description}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="parchment rounded-sm border border-gold/15 p-4 text-left">
                <div className="flex items-center gap-2 font-display text-xs tracking-wider text-gold-bright uppercase">
                  <Users className="h-4 w-4 text-ember" /> Leader
                </div>
                <p className="mt-1 font-serif text-sm text-ash/75">{selected.leader || "—"}</p>
              </div>
              <div className="parchment rounded-sm border border-gold/15 p-4 text-left">
                <div className="flex items-center gap-2 font-display text-xs tracking-wider text-gold-bright uppercase">
                  <MapPin className="h-4 w-4 text-ember" /> Location
                </div>
                <p className="mt-1 font-serif text-sm text-ash/75">{selected.location}</p>
              </div>
            </div>

            <div className="mt-6 text-left">
              <h4 className="mb-3 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                <Crown className="h-4 w-4 text-ember" /> Ranks & Rewards
              </h4>
              <ol className="space-y-2">
                {selected.ranks.map((r) => (
                  <li
                    key={r.rank}
                    className="flex items-start gap-3 border-l-2 border-gold/20 p-3"
                  >
                    <span className="font-display text-lg text-gold-bright">{r.rank}</span>
                    <div className="flex-1">
                      <p className="font-serif text-sm text-ash/80">
                        <span className="text-muted-foreground">Offering:</span> {r.requirement}
                      </p>
                      <p className="mt-1 flex items-center gap-1 font-serif text-sm text-gold-bright">
                        <Gift className="h-3 w-3 text-ember" /> {r.reward}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 text-left">
              <h4 className="mb-1 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                <ScrollText className="h-4 w-4 text-ember" /> Lore
              </h4>
              <p className="font-serif text-sm italic leading-relaxed text-ash/80">
                {selected.lore}
              </p>
            </div>
          </div>
        )}
      </DetailDialog>
    </PageShell>
  );
}

function CovenantSigil({ name, large }: { name: string; large?: boolean }) {
  const size = large ? 96 : 56;
  const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="mx-auto">
      <defs>
        <radialGradient id={`cv-${name}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`hsl(${hue},60%,45%)`} stopOpacity="0.7" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#cv-${name})`} />
      <circle cx="50" cy="50" r="36" stroke="#c5a059" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="28" stroke="#c5a059" strokeWidth="1" opacity="0.5" />
      {/* 8-point star */}
      <path
        d="M50,15 L55,45 L85,50 L55,55 L50,85 L45,55 L15,50 L45,45 Z"
        stroke={`hsl(${hue},70%,55%)`}
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
}

export default CovenantsSection;
