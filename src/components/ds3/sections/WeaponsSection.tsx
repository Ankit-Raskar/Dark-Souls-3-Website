"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Swords, Weight, TrendingUp, MapPin, Sparkles } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { weapons, type Weapon } from "@/data/ds3";
import { useSound } from "../SoundManager";

const CATEGORIES = [
  "All", "Straight Swords", "Greatswords", "Ultra Greatswords", "Curved Swords",
  "Katanas", "Axes", "Greataxes", "Spears", "Halberds", "Hammers", "Great Hammers",
  "Daggers", "Whips", "Bows", "Greatbows", "Crossbows", "Catalysts", "Talismans",
  "Chimes", "Pyromancy Flames",
];

export function WeaponsSection() {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<Weapon | null>(null);
  const { play } = useSound();

  const list = useMemo(
    () => (cat === "All" ? weapons : weapons.filter((w) => w.category === cat)),
    [cat]
  );

  return (
    <PageShell
      id="weapons"
      eyebrow="Arsenal of the Ashen One"
      title="Weapons"
      intro="Every blade that has tasted the blood of gods and men. Browse the complete arsenal — from the humble Longsword to the Profaned Greatsword, each with its scaling, lore, and weapon art."
    >
      {/* Category scroll */}
      <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCat(c);
              play("click");
            }}
            onMouseEnter={() => play("hover")}
            className={`shrink-0 border px-3 py-1.5 font-serif text-xs tracking-wide transition-all ${
              cat === c
                ? "border-ember bg-ember/10 text-ember"
                : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
            }`}
          >
            {c}
            <span className="ml-1.5 text-muted-foreground">
              {c === "All" ? weapons.length : weapons.filter((w) => w.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((w, i) => (
          <SectionReveal key={w.id} delay={(i % 4) * 0.04}>
            <ParchmentCard className="h-full p-5">
              {/* Weapon icon — procedural */}
              <div className="mb-3 flex h-16 items-center justify-center rounded-sm border border-gold/10 bg-gradient-to-b from-charcoal to-soot">
                <WeaponIcon category={w.category} />
              </div>
              <h3 className="font-display text-sm text-gold-bright">{w.name}</h3>
              <p className="font-serif text-[0.7rem] italic text-muted-foreground">{w.category}</p>
              <div className="mt-3 flex items-center justify-between font-serif text-xs text-ash/70">
                <span className="flex items-center gap-1">
                  <Swords className="h-3 w-3 text-ember" /> {w.damage}
                </span>
                <span className="flex items-center gap-1">
                  <Weight className="h-3 w-3 text-gold" /> {w.weight}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelected(w);
                  play("unsheathe");
                }}
                onMouseEnter={() => play("hover")}
                className="mt-3 w-full border border-gold/20 py-1.5 font-display text-[0.65rem] tracking-[0.2em] text-ash/70 uppercase transition-all hover:border-ember/50 hover:text-ember"
              >
                Inspect
              </button>
            </ParchmentCard>
          </SectionReveal>
        ))}
      </motion.div>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name}>
        {selected && (
          <div>
            <div className="mb-6 flex h-32 items-center justify-center rounded-sm border border-gold/15 bg-gradient-to-b from-charcoal to-soot">
              <WeaponIcon category={selected.category} large />
            </div>
            <Tag variant="gold">{selected.category}</Tag>
            <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold">
              {selected.name}
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniStat icon={Swords} label="Damage" value={String(selected.damage)} />
              <MiniStat icon={Weight} label="Weight" value={String(selected.weight)} />
              <MiniStat icon={TrendingUp} label="Upgrade" value={selected.upgrade} />
              <MiniStat icon={Sparkles} label="Scaling" value={selected.scaling} />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="mb-1 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  Requirements
                </h4>
                <p className="font-serif text-sm text-ash/75">{selected.requirements}</p>
              </div>
              <div>
                <h4 className="mb-1 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  Scaling
                </h4>
                <p className="font-serif text-sm text-ash/75">{selected.scaling}</p>
              </div>
              <div>
                <h4 className="mb-1 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
                  Weapon Art
                </h4>
                <p className="font-serif text-sm text-ash/75">{selected.weaponArt}</p>
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

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Swords;
  label: string;
  value: string;
}) {
  return (
    <div className="parchment rounded-sm border border-gold/15 p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-ember" />
      <div className="mt-1 font-serif text-[0.6rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-sm text-gold-bright">{value}</div>
    </div>
  );
}

/** Procedural weapon silhouette via SVG, keyed by category. */
function WeaponIcon({ category, large }: { category: string; large?: boolean }) {
  const size = large ? 80 : 40;
  const stroke = "#c5a059";
  // crude but evocative silhouettes
  const path = (() => {
    switch (category) {
      case "Straight Swords":
      case "Katanas":
      case "Curved Swords":
        return "M5,35 L35,5 M35,5 L40,10 L12,40 Z";
      case "Greatswords":
      case "Ultra Greatswords":
        return "M2,38 L38,2 L44,8 L8,44 Z";
      case "Daggers":
        return "M15,40 L25,15 L27,15 L17,40 Z";
      case "Spears":
      case "Halberds":
        return "M20,5 L20,45 M14,14 L26,14";
      case "Axes":
      case "Greataxes":
      case "Great Hammers":
      case "Hammers":
        return "M20,5 L20,45 M12,12 L28,12 L28,22 L12,22 Z";
      case "Bows":
      case "Greatbows":
        return "M10,10 Q30,25 10,40 M10,10 L10,40";
      case "Crossbows":
        return "M8,20 L32,20 M14,12 L26,12 L26,28 L14,28 Z";
      case "Whips":
        return "M5,10 Q15,30 25,15 Q35,35 40,20";
      case "Catalysts":
      case "Talismans":
      case "Chimes":
        return "M20,8 L20,42 M14,12 L26,12 M20,8 Q28,12 28,20";
      case "Pyromancy Flames":
        return "M20,10 Q12,18 20,28 Q28,18 20,10 M20,28 L20,42";
      default:
        return "M5,35 L35,5";
    }
  })();
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none">
      <path d={path} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default WeaponsSection;
