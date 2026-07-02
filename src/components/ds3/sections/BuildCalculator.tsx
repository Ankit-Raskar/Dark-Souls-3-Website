"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, RotateCcw, Swords, Weight, TrendingUp, Star } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { buildClasses, weapons, armorSets, type BuildStats } from "@/data/ds3";
import { useSound } from "../SoundManager";

const STAT_KEYS: { key: keyof BuildStats; label: string }[] = [
  { key: "vigor", label: "Vigor" },
  { key: "attunement", label: "Attunement" },
  { key: "endurance", label: "Endurance" },
  { key: "vitality", label: "Vitality" },
  { key: "strength", label: "Strength" },
  { key: "dexterity", label: "Dexterity" },
  { key: "intelligence", label: "Intelligence" },
  { key: "faith", label: "Faith" },
  { key: "luck", label: "Luck" },
];

const STAT_MAX = 99;

export function BuildCalculator() {
  const { play } = useSound();
  const [classId, setClassId] = useState(buildClasses[0].id);
  const [stats, setStats] = useState<BuildStats>(buildClasses[0].stats);
  const [weaponId, setWeaponId] = useState(weapons[0].id);
  const [armorId, setArmorId] = useState(armorSets[0].id);

  const cls = buildClasses.find((c) => c.id === classId)!;
  const weapon = weapons.find((w) => w.id === weaponId)!;
  const armor = armorSets.find((a) => a.id === armorId)!;

  const level = useMemo(
    () => Object.values(stats).reduce((a, b) => a + b, 0) - 80,
    [stats]
  );

  const adjust = (key: keyof BuildStats, delta: number) => {
    setStats((prev) => {
      const next = Math.max(0, Math.min(STAT_MAX, prev[key] + delta));
      return { ...prev, [key]: next };
    });
    play("click");
  };

  const pickClass = (id: string) => {
    const c = buildClasses.find((x) => x.id === id);
    if (!c) return;
    setClassId(id);
    setStats(c.stats);
    play("menu");
  };

  const reset = () => {
    setStats(cls.stats);
    play("bonfire");
  };

  // Derived metrics
  const meetsRequirements = useMemo(() => {
    // crude: parse "STR 10 / DEX 10" etc.
    const req = weapon.requirements.toLowerCase();
    const checks: { stat: keyof BuildStats; pat: RegExp }[] = [
      { stat: "strength", pat: /str\s*(\d+)/ },
      { stat: "dexterity", pat: /dex\s*(\d+)/ },
      { stat: "intelligence", pat: /int\s*(\d+)/ },
      { stat: "faith", pat: /fth\s*(\d+)|faith\s*(\d+)/ },
    ];
    return checks.every((c) => {
      const m = req.match(c.pat);
      if (!m) return true;
      const need = Number(m[1] || m[2]);
      return stats[c.stat] >= need;
    });
  }, [weapon, stats]);

  const totalWeight = weapon.weight + armor.weight;
  const equipLoad = 40 + stats.vitality * 1.5;
  const equipPct = Math.round((totalWeight / equipLoad) * 100);
  const roll = equipPct < 30 ? "Fast Roll" : equipPct < 70 ? "Mid Roll" : "Fat Roll";
  const rollColor = equipPct < 30 ? "text-ember" : equipPct < 70 ? "text-gold-bright" : "text-blood-bright";

  return (
    <PageShell
      id="build"
      eyebrow="Forge Your Ashen One"
      title="Build Calculator"
      intro="Choose your class, allocate your souls, and arm yourself. See your level, equip load, and whether you meet the requirements of your chosen blade."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Left: class + stats */}
        <ParchmentCard interactive={false} className="p-6 sm:p-8">
          <h3 className="mb-4 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
            Class
          </h3>
          <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
            {buildClasses.map((c) => (
              <button
                key={c.id}
                onClick={() => pickClass(c.id)}
                onMouseEnter={() => play("hover")}
                className={`shrink-0 border px-3 py-1.5 font-serif text-xs transition-all ${
                  classId === c.id
                    ? "border-ember bg-ember/10 text-ember"
                    : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <p className="mb-6 font-serif text-sm italic text-ash/70">{cls.description}</p>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
              Attributes
            </h3>
            <button
              onClick={reset}
              className="flex items-center gap-1 font-display text-[0.65rem] tracking-[0.2em] text-ash/60 uppercase hover:text-ember"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          <div className="space-y-3">
            {STAT_KEYS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-28 shrink-0 font-serif text-xs uppercase tracking-wider text-ash/70">
                  {label}
                </span>
                <div className="stat-bar flex-1">
                  <motion.span
                    animate={{ width: `${(stats[key] / STAT_MAX) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <button
                  onClick={() => adjust(key, -1)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-gold/20 text-ash hover:border-ember hover:text-ember"
                  aria-label={`Decrease ${label}`}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center font-display text-sm text-gold-bright">
                  {stats[key]}
                </span>
                <button
                  onClick={() => adjust(key, 1)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-gold/20 text-ash hover:border-ember hover:text-ember"
                  aria-label={`Increase ${label}`}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </ParchmentCard>

        {/* Right: gear + derived */}
        <div className="flex flex-col gap-6">
          <ParchmentCard interactive={false} className="p-6 sm:p-8">
            <h3 className="mb-4 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
              Equipment
            </h3>

            <label className="mb-1 block font-serif text-xs text-ash/60">Weapon</label>
            <select
              value={weaponId}
              onChange={(e) => {
                setWeaponId(e.target.value);
                play("click");
              }}
              className="mb-4 w-full border border-gold/20 bg-soot px-3 py-2 font-serif text-sm text-ash focus:border-ember focus:outline-none"
            >
              {weapons.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.category}
                </option>
              ))}
            </select>

            <label className="mb-1 block font-serif text-xs text-ash/60">Armor Set</label>
            <select
              value={armorId}
              onChange={(e) => {
                setArmorId(e.target.value);
                play("click");
              }}
              className="w-full border border-gold/20 bg-soot px-3 py-2 font-serif text-sm text-ash focus:border-ember focus:outline-none"
            >
              {armorSets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tag variant="gold">{weapon.category}</Tag>
              <Tag variant="muted">Upgrade: {weapon.upgrade}</Tag>
              {meetsRequirements ? (
                <Tag variant="ember">Requirements met</Tag>
              ) : (
                <Tag variant="blood">Requirements NOT met</Tag>
              )}
            </div>
          </ParchmentCard>

          <ParchmentCard interactive={false} className="p-6 sm:p-8">
            <h3 className="mb-4 font-display text-sm tracking-[0.2em] text-gold-bright uppercase">
              Derived Stats
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Derived icon={Star} label="Soul Level" value={String(level)} tone="gold" />
              <Derived icon={Swords} label="Weapon AR" value={String(weapon.damage)} tone="ember" />
              <Derived icon={Weight} label="Total Weight" value={totalWeight.toFixed(1)} tone="muted" />
              <Derived
                icon={TrendingUp}
                label="Roll Type"
                value={roll}
                tone={rollColor as "ember" | "gold" | "blood" | "muted"}
              />
            </div>

            {/* Equip load bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between font-serif text-xs text-ash/60">
                <span>Equip Load</span>
                <span className={rollColor}>
                  {totalWeight.toFixed(1)} / {equipLoad.toFixed(0)} ({equipPct}%)
                </span>
              </div>
              <div className="stat-bar mt-1">
                <motion.span
                  animate={{ width: `${Math.min(100, equipPct)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="mt-1 flex justify-between font-serif text-[0.6rem] text-muted-foreground">
                <span>Fast &lt;30%</span>
                <span>Mid &lt;70%</span>
                <span>Fat ≥70%</span>
              </div>
            </div>
          </ParchmentCard>
        </div>
      </div>
    </PageShell>
  );
}

function Derived({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  tone: "gold" | "ember" | "blood" | "muted";
}) {
  const tones = {
    gold: "text-gold-bright",
    ember: "text-ember",
    blood: "text-blood-bright",
    muted: "text-ash",
  };
  return (
    <div className="parchment rounded-sm border border-gold/15 p-3 text-center">
      <Icon className={`mx-auto h-4 w-4 ${tones[tone]}`} />
      <div className="mt-1 font-serif text-[0.6rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-0.5 font-display text-base ${tones[tone]}`}>{value}</div>
    </div>
  );
}

export default BuildCalculator;
