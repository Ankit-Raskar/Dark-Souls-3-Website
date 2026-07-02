"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wand2, Sparkles, Flame, Sun, Droplet } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { spells, type Spell, type MagicType } from "@/data/ds3";
import { useSound } from "../SoundManager";

const TABS: { id: MagicType; label: string; icon: typeof Flame }[] = [
  { id: "Sorcery", label: "Sorceries", icon: Wand2 },
  { id: "Miracle", label: "Miracles", icon: Sun },
  { id: "Pyromancy", label: "Pyromancies", icon: Flame },
];

export function MagicSection() {
  const [tab, setTab] = useState<MagicType>("Sorcery");
  const [selected, setSelected] = useState<Spell | null>(null);
  const { play } = useSound();

  const list = useMemo(() => spells.filter((s) => s.type === tab), [tab]);

  return (
    <PageShell
      id="magic"
      eyebrow="The Three Schools"
      title="Magic"
      intro="Sorcery, the legacy of Seath and the scholars of Vinheim. Miracles, the tales of the gods made manifest. Pyromancy, the flame of Izalith that burns without faith. Master all three."
    >
      {/* Tabs */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                play("click");
              }}
              onMouseEnter={() => play("hover")}
              className={`flex items-center gap-2 border px-5 py-2.5 font-display text-xs tracking-[0.2em] uppercase transition-all ${
                tab === t.id
                  ? "border-ember bg-ember/10 text-ember shadow-[0_0_16px_rgba(255,122,24,0.3)]"
                  : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <SectionReveal key={s.id} delay={(i % 3) * 0.05}>
            <ParchmentCard className="h-full p-5">
              <div className="mb-3 flex items-center justify-between">
                <SpellGlyph type={s.type} name={s.name} />
                <Tag variant={s.type === "Sorcery" ? "muted" : s.type === "Miracle" ? "gold" : "ember"}>
                  {s.type}
                </Tag>
              </div>
              <h3 className="font-display text-base text-gold-bright">{s.name}</h3>
              <p className="mt-2 line-clamp-2 font-serif text-xs text-ash/70">{s.effect}</p>
              <div className="mt-3 flex items-center justify-between font-serif text-xs text-ash/60">
                <span>FP {s.fpCost}</span>
                <span>Slots {s.slots}</span>
                <span>{s.requirements}</span>
              </div>
              <button
                onClick={() => {
                  setSelected(s);
                  play("click");
                }}
                onMouseEnter={() => play("hover")}
                className="mt-3 w-full border border-gold/20 py-1.5 font-display text-[0.65rem] tracking-[0.2em] text-ash/70 uppercase transition-all hover:border-ember/50 hover:text-ember"
              >
                Read Inscription
              </button>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </motion.div>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name}>
        {selected && (
          <div>
            <div className="mb-6 flex h-32 items-center justify-center rounded-sm border border-gold/15 bg-gradient-to-b from-charcoal to-soot">
              <SpellGlyph type={selected.type} name={selected.name} large />
            </div>
            <Tag variant={selected.type === "Sorcery" ? "muted" : selected.type === "Miracle" ? "gold" : "ember"}>
              {selected.type}
            </Tag>
            <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold">
              {selected.name}
            </h3>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="FP Cost" value={String(selected.fpCost)} />
              <Stat label="Attunement Slots" value={String(selected.slots)} />
              <Stat label="Requirements" value={selected.requirements} />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="mb-1 flex items-center gap-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  <Sparkles className="h-4 w-4 text-ember" /> Effect
                </h4>
                <p className="font-serif text-sm leading-relaxed text-ash/80">{selected.effect}</p>
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
      <div className="mt-1 font-display text-sm text-gold-bright">{value}</div>
    </div>
  );
}

function SpellGlyph({ type, name, large }: { type: MagicType; name: string; large?: boolean }) {
  const size = large ? 80 : 44;
  const color = type === "Sorcery" ? "#6b7fb5" : type === "Miracle" ? "#e8c878" : "#ff7a18";
  const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`sp-${name}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="34" fill={`url(#sp-${name})`} />
      {type === "Sorcery" && (
        <>
          <circle cx="50" cy="50" r="18" stroke={color} strokeWidth="2" />
          <path d="M50,28 L50,72 M28,50 L72,50" stroke={color} strokeWidth="1.5" opacity="0.7" />
        </>
      )}
      {type === "Miracle" && (
        <>
          <path d="M50,20 L56,46 L82,50 L56,54 L50,80 L44,54 L18,50 L44,46 Z" fill={color} opacity="0.8" />
        </>
      )}
      {type === "Pyromancy" && (
        <>
          <path
            d="M50,30 Q40,45 50,58 Q60,45 50,30 Z M50,58 L50,72"
            stroke={color}
            strokeWidth="2"
            fill={color}
            fillOpacity="0.4"
          />
        </>
      )}
    </svg>
  );
}

export default MagicSection;
