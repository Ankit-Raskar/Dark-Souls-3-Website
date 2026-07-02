"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Skull, MapPin, Heart, Swords, Shield, Sparkles, Droplet, Crosshair } from "lucide-react";
import { PageShell, ParchmentCard, Tag, DifficultyMeter } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { EntityImage } from "../EntityImage";
import { bosses, type Boss, type BossCategory } from "@/data/ds3";
import { useSound } from "../SoundManager";

const FILTERS: { id: BossCategory | "All"; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Main", label: "Main" },
  { id: "Optional", label: "Optional" },
  { id: "Secret", label: "Secret" },
  { id: "DLC", label: "DLC" },
];

export function BossesSection() {
  const [filter, setFilter] = useState<BossCategory | "All">("All");
  const [selected, setSelected] = useState<Boss | null>(null);
  const { play } = useSound();

  const list = useMemo(
    () => (filter === "All" ? bosses : bosses.filter((b) => b.category === filter)),
    [filter]
  );

  return (
    <PageShell
      id="bosses"
      eyebrow="Lords Without Thrones"
      title="Bosses"
      intro="Twenty-seven encounters stand between you and the kiln. Each a tragedy in armour, each a soul to be claimed. Study their patterns, exploit their weaknesses, and remember — you will die."
    >
      {/* Filters */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilter(f.id);
              play("click");
            }}
            onMouseEnter={() => play("hover")}
            className={`border px-4 py-2 font-display text-xs tracking-[0.2em] uppercase transition-all ${
              filter === f.id
                ? "border-ember bg-ember/10 text-ember shadow-[0_0_16px_rgba(255,122,24,0.3)]"
                : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
            }`}
          >
            {f.label}
            <span className="ml-2 text-muted-foreground">
              {f.id === "All"
                ? bosses.length
                : bosses.filter((b) => b.category === f.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((boss, i) => (
          <SectionReveal key={boss.id} delay={(i % 4) * 0.04}>
            <BossCard boss={boss} onSelect={() => { setSelected(boss); play("roar"); }} />
          </SectionReveal>
        ))}
      </motion.div>

      {/* Detail */}
      <DetailDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        label={selected?.name}
        className="max-w-4xl"
      >
        {selected && <BossDetail boss={selected} />}
      </DetailDialog>
    </PageShell>
  );
}

function BossCard({ boss, onSelect }: { boss: Boss; onSelect: () => void }) {
  const { play } = useSound();
  return (
    <ParchmentCard className="h-full p-0">
      {/* Visual header */}
      <button
        onClick={onSelect}
        onMouseEnter={() => play("hover")}
        className="group relative block h-48 w-full overflow-hidden border-b border-gold/15"
      >
        <EntityImage
          src={boss.image}
          alt={boss.name}
          className="absolute inset-0 h-full w-full"
          fallback={<BossArt boss={boss} />}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-soot via-soot/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
          <Tag variant={boss.category === "DLC" ? "ember" : "muted"} className="mb-2">
            {boss.category}
          </Tag>
          <h3 className="font-display text-lg leading-tight text-gold-bright text-glow-gold">
            {boss.name}
          </h3>
          <p className="font-serif text-xs italic text-ash/60">{boss.title}</p>
        </div>
        {/* Hover attack hint */}
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-ember/30 bg-soot/70 opacity-0 transition-opacity group-hover:opacity-100">
          <Swords className="h-4 w-4 text-ember" />
        </div>
      </button>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-serif text-xs text-muted-foreground">Difficulty</span>
          <DifficultyMeter value={boss.difficulty} />
        </div>
        <div className="mt-3 flex items-center justify-between font-serif text-xs text-ash/70">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gold" /> {boss.location}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-blood-bright" /> {boss.hp.toLocaleString()}
          </span>
        </div>
      </div>
    </ParchmentCard>
  );
}

/** Stylised procedural boss portrait — silhouette + glow keyed by name. */
function BossArt({ boss }: { boss: Boss }) {
  // deterministic gradient from name
  const hue = Array.from(boss.name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const palette =
    boss.category === "DLC"
      ? `radial-gradient(60% 80% at 50% 40%, hsl(${hue},70%,30%), #0a0604 70%)`
      : `radial-gradient(60% 80% at 50% 40%, hsl(${hue},55%,18%), #0a0604 70%)`;
  return (
    <div className="absolute inset-0" style={{ background: palette }}>
      <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id={`g-${boss.id}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(255,160,80,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="80" r="70" fill={`url(#g-${boss.id})`} />
        {/* Cloaked figure silhouette */}
        <path
          d="M100,40 C112,40 120,52 120,66 C120,76 116,84 110,88 L120,120 L130,170 L70,170 L80,120 L90,88 C84,84 80,76 80,66 C80,52 88,40 100,40 Z"
          fill="#000"
          opacity="0.92"
        />
        {/* Eyes */}
        <circle cx="94" cy="64" r="2" fill="#ff7a18">
          <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="106" cy="64" r="2" fill="#ff7a18">
          <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

function BossDetail({ boss }: { boss: Boss }) {
  return (
    <div>
      <div className="relative -mx-6 -mt-6 mb-6 h-56 overflow-hidden sm:-mx-10 sm:-mt-10">
        <EntityImage
          src={boss.image}
          alt={boss.name}
          className="absolute inset-0 h-full w-full"
          fallback={<BossArt boss={boss} />}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100d0b] via-transparent to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 sm:left-10 sm:right-10">
          <Tag variant={boss.category === "DLC" ? "ember" : "gold"}>{boss.category}</Tag>
          <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold sm:text-4xl">
            {boss.name}
          </h3>
          <p className="font-serif italic text-ash/70">&ldquo;{boss.title}&rdquo;</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Heart} label="HP" value={boss.hp.toLocaleString()} tone="blood" />
        <Stat icon={Sparkles} label="Souls" value={boss.souls.toLocaleString()} tone="gold" />
        <Stat icon={Crosshair} label="Phases" value={String(boss.phases)} tone="ember" />
        <Stat
          icon={Skull}
          label="Difficulty"
          value={`${boss.difficulty}/10`}
          tone="ember"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <Section title="Lore">
            <p className="font-serif text-sm leading-relaxed text-ash/80">{boss.lore}</p>
          </Section>
          <Section title="Strategy">
            <p className="font-serif text-sm leading-relaxed text-ash/80">{boss.strategy}</p>
          </Section>
          <Section title="Arena">
            <p className="font-serif text-sm text-ash/75">{boss.arena}</p>
          </Section>
        </div>
        <div>
          <Section title="Weaknesses">
            <div className="flex flex-wrap gap-2">
              {boss.weaknesses.map((w) => (
                <Tag key={w} variant="ember">
                  <Droplet className="h-3 w-3" /> {w}
                </Tag>
              ))}
            </div>
          </Section>
          <Section title="Resistances">
            <div className="flex flex-wrap gap-2">
              {boss.resistances.map((r) => (
                <Tag key={r} variant="muted">
                  <Shield className="h-3 w-3" /> {r}
                </Tag>
              ))}
            </div>
          </Section>
          <Section title="Notable Moveset">
            <ul className="space-y-1 font-serif text-sm text-ash/75">
              {boss.moveset.map((m, i) => (
                <li key={i} className="flex gap-2">
                  <Swords className="mt-0.5 h-3 w-3 shrink-0 text-ember" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Section title="Drops">
          <ul className="space-y-1 font-serif text-sm text-ash/75">
            {boss.drops.map((d, i) => (
              <li key={i}>◆ {d}</li>
            ))}
          </ul>
        </Section>
        <Section title="Soul Transposition">
          {boss.transposition.length ? (
            <ul className="space-y-1 font-serif text-sm text-ash/75">
              {boss.transposition.map((t, i) => (
                <li key={i}>◆ {t}</li>
              ))}
            </ul>
          ) : (
            <p className="font-serif text-sm italic text-muted-foreground">
              No transposition rewards.
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Heart;
  label: string;
  value: string;
  tone: "blood" | "gold" | "ember";
}) {
  const tones = {
    blood: "text-blood-bright border-blood/30",
    gold: "text-gold-bright border-gold/30",
    ember: "text-ember border-ember/30",
  };
  return (
    <div className={`parchment rounded-sm border p-3 ${tones[tone]}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-serif text-[0.65rem] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-1 font-display text-lg">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="mb-2 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
        {title}
      </h4>
      {children}
    </div>
  );
}

export default BossesSection;
