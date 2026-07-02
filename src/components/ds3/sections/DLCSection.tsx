"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Moon, Swords, Users, Package, Shirt, Sparkles, MapPin } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { SectionReveal } from "../SectionReveal";
import { dlcs } from "@/data/ds3";
import { useSound } from "../SoundManager";

export function DLCSection() {
  const [active, setActive] = useState(0);
  const { play } = useSound();
  const dlc = dlcs[active];

  return (
    <PageShell
      id="dlc"
      eyebrow="Beyond the Fading Kingdom"
      title="The DLCs"
      intro="Two expansions extend the tragedy — a frozen painted world of Ariandel, and the Ringed City at the world's end, where the Dark Soul slumbers."
    >
      {/* Tabs */}
      <div className="mb-10 flex items-center justify-center gap-3">
        {dlcs.map((d, i) => {
          const Icon = d.id === "ashes-of-ariandel" ? Snowflake : Moon;
          return (
            <button
              key={d.id}
              onClick={() => {
                setActive(i);
                play("click");
              }}
              onMouseEnter={() => play("hover")}
              className={`flex items-center gap-2 border px-5 py-3 font-display text-xs tracking-[0.2em] uppercase transition-all ${
                active === i
                  ? "border-ember bg-ember/10 text-ember shadow-[0_0_20px_rgba(255,122,24,0.3)]"
                  : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-ash"
              }`}
            >
              <Icon className="h-4 w-4" /> {d.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={dlc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <ParchmentCard interactive={false} className="overflow-hidden p-0">
            {/* Banner */}
            <div
              className="relative h-56 overflow-hidden"
              style={{
                background:
                  dlc.id === "ashes-of-ariandel"
                    ? "radial-gradient(80% 120% at 50% 100%, rgba(120,170,200,0.3), #06080c 70%), linear-gradient(180deg,#0a0f14,#06080c)"
                    : "radial-gradient(80% 120% at 50% 100%, rgba(120,40,120,0.25), #06040a 70%), linear-gradient(180deg,#0a0810,#06040a)",
              }}
            >
              {dlc.id === "ashes-of-ariandel" ? <SnowField /> : <RingedCityMotes />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#100d0b] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 sm:left-10 sm:right-10">
                <Tag variant={dlc.id === "ashes-of-ariandel" ? "muted" : "ember"}>{dlc.release}</Tag>
                <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold sm:text-4xl">
                  {dlc.name}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <p className="font-serif text-base leading-relaxed text-ash/80">{dlc.lore}</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <DLCBlock icon={Sparkles} title="Highlights">
                  <ul className="space-y-1 font-serif text-sm text-ash/75">
                    {dlc.highlights.map((h, i) => (
                      <li key={i}>◆ {h}</li>
                    ))}
                  </ul>
                </DLCBlock>
                <DLCBlock icon={Swords} title="Bosses">
                  <ul className="space-y-1 font-serif text-sm text-ash/75">
                    {dlc.bosses.map((b, i) => (
                      <li key={i}>◆ {b}</li>
                    ))}
                  </ul>
                </DLCBlock>
                <DLCBlock icon={Users} title="NPCs">
                  <ul className="space-y-1 font-serif text-sm text-ash/75">
                    {dlc.npcs.map((n, i) => (
                      <li key={i}>◆ {n}</li>
                    ))}
                  </ul>
                </DLCBlock>
                <DLCBlock icon={MapPin} title="Areas">
                  <ul className="space-y-1 font-serif text-sm text-ash/75">
                    {dlc.areas.map((a, i) => (
                      <li key={i}>◆ {a}</li>
                    ))}
                  </ul>
                </DLCBlock>
                <DLCBlock icon={Package} title="Weapons">
                  <div className="flex flex-wrap gap-1.5">
                    {dlc.weapons.map((w, i) => (
                      <Tag key={i} variant="ember">
                        {w}
                      </Tag>
                    ))}
                  </div>
                </DLCBlock>
                <DLCBlock icon={Shirt} title="Armor">
                  <div className="flex flex-wrap gap-1.5">
                    {dlc.armor.map((a, i) => (
                      <Tag key={i} variant="gold">
                        {a}
                      </Tag>
                    ))}
                  </div>
                </DLCBlock>
              </div>
            </div>
          </ParchmentCard>
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}

function DLCBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Swords;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="parchment rounded-sm border border-gold/15 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-ember" />
        <h4 className="font-display text-sm tracking-[0.2em] text-gold-bright uppercase">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function SnowField() {
  return (
    <div className="absolute inset-0 opacity-60">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/70"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
          animate={{ y: [0, 30, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function RingedCityMotes() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-ember/60"
          style={{ left: `${(i * 61) % 100}%`, bottom: `${(i * 29) % 100}%` }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

export default DLCSection;
