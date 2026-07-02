"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Flame, Users, Package, Eye, Snowflake, Cloud, CloudRain, CloudFog, Sun } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { EntityImage } from "../EntityImage";
import { SectionReveal } from "../SectionReveal";
import { DetailDialog } from "../DetailDialog";
import { areas, type Area, type Weather } from "@/data/ds3";
import { useSound } from "../SoundManager";

const WEATHER_ICON: Record<Weather, typeof Flame> = {
  Ash: Flame,
  Snow: Snowflake,
  Fog: CloudFog,
  Fire: Flame,
  Dark: Eye,
  Rain: CloudRain,
  Clear: Sun,
};

const WEATHER_GRADIENT: Record<Weather, string> = {
  Ash: "from-ember/20 via-soot to-black",
  Snow: "from-sky-200/10 via-soot to-black",
  Fog: "from-ash/10 via-soot to-black",
  Fire: "from-blood/30 via-soot to-black",
  Dark: "from-purple-900/20 via-soot to-black",
  Rain: "from-sky-700/15 via-soot to-black",
  Clear: "from-amber-200/10 via-soot to-black",
};

export function AreasSection() {
  const [selected, setSelected] = useState<Area | null>(null);
  const { play } = useSound();

  return (
    <PageShell
      id="areas"
      eyebrow="A Kingdom in Ruin"
      title="Areas"
      intro="From the Cemetery of Ash where you awaken, to the Kiln of the First Flame where all journeys end — explore every region of Lothric, its bonfires, its secrets, its dread."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, i) => {
          const WIcon = WEATHER_ICON[area.weather];
          return (
            <SectionReveal key={area.id} delay={(i % 3) * 0.05}>
              <ParchmentCard className="h-full p-0">
                <button
                  onClick={() => {
                    setSelected(area);
                    play("menu");
                  }}
                  onMouseEnter={() => play("hover")}
                  className="group block w-full text-left"
                >
                  {/* Weather banner with real area image */}
                  <div className="relative h-32 overflow-hidden">
                    <EntityImage
                      src={area.image}
                      alt={area.name}
                      className="absolute inset-0 h-full w-full"
                      fallback={
                        <div className={`h-full w-full bg-gradient-to-b ${WEATHER_GRADIENT[area.weather]}`} />
                      }
                    />
                    <AreaWeather weather={area.weather} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100d0b] to-transparent" />
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-sm border border-gold/20 bg-soot/60 px-2 py-1">
                      <WIcon className="h-3 w-3 text-gold" />
                      <span className="font-serif text-[0.65rem] uppercase tracking-wider text-ash/70">
                        {area.weather}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base text-gold-bright">{area.name}</h3>
                    <p className="font-serif text-xs italic text-muted-foreground">
                      {area.subtitle}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 font-serif text-[0.65rem] text-ash/60">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-ember" /> {area.bonfires.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gold" /> {area.npcs.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-blood-bright" /> {area.bosses.length}
                      </span>
                    </div>
                  </div>
                </button>
              </ParchmentCard>
            </SectionReveal>
          );
        })}
      </div>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name}>
        {selected && (
          <div>
            <div className="relative -mx-6 -mt-6 mb-6 h-40 overflow-hidden sm:-mx-10 sm:-mt-10">
              <EntityImage
                src={selected.image}
                alt={selected.name}
                className="absolute inset-0 h-full w-full"
                fallback={<div className={`h-full w-full bg-gradient-to-b ${WEATHER_GRADIENT[selected.weather]}`} />}
              />
              <AreaWeather weather={selected.weather} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100d0b] to-transparent" />
            </div>
            <span className="section-eyebrow">{selected.subtitle}</span>
            <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold">
              {selected.name}
            </h3>
            <p className="mt-4 font-serif text-base leading-relaxed text-ash/80">{selected.lore}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Detail icon={Eye} title="Bosses">
                {selected.bosses.length ? (
                  <ul className="space-y-1 font-serif text-sm text-ash/75">
                    {selected.bosses.map((b, i) => (
                      <li key={i}>◆ {b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-serif text-sm italic text-muted-foreground">No bosses.</p>
                )}
              </Detail>
              <Detail icon={Users} title="NPCs">
                {selected.npcs.length ? (
                  <ul className="space-y-1 font-serif text-sm text-ash/75">
                    {selected.npcs.map((n, i) => (
                      <li key={i}>◆ {n}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-serif text-sm italic text-muted-foreground">No NPCs.</p>
                )}
              </Detail>
              <Detail icon={Flame} title="Bonfires">
                <ul className="space-y-1 font-serif text-sm text-ash/75">
                  {selected.bonfires.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Flame className="h-3 w-3 text-ember" /> {b}
                    </li>
                  ))}
                </ul>
              </Detail>
              <Detail icon={Package} title="Notable Items">
                <div className="flex flex-wrap gap-1.5">
                  {selected.items.map((it, i) => (
                    <Tag key={i} variant="muted">
                      {it}
                    </Tag>
                  ))}
                </div>
              </Detail>
            </div>

            <Detail icon={MapPin} title="Secrets">
              <ul className="space-y-1 font-serif text-sm text-ash/75">
                {selected.secrets.map((s, i) => (
                  <li key={i}>◆ {s}</li>
                ))}
              </ul>
            </Detail>
          </div>
        )}
      </DetailDialog>
    </PageShell>
  );
}

function AreaWeather({ weather }: { weather: Weather }) {
  // subtle animated weather motif
  return (
    <div className="absolute inset-0">
      {weather === "Fire" || weather === "Ash" ? (
        <div className="absolute inset-0 animate-flicker"
          style={{
            background: "radial-gradient(50% 80% at 50% 100%, rgba(255,90,20,0.45), transparent 70%)",
          }}
        />
      ) : null}
      {weather === "Snow" ? (
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
      ) : null}
      {weather === "Fog" || weather === "Rain" ? (
        <div className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(60% 80% at 50% 50%, rgba(180,180,180,0.15), transparent 70%)" }}
        />
      ) : null}
      {weather === "Dark" ? (
        <div className="absolute inset-0 bg-black/50" />
      ) : null}
    </div>
  );
}

function Detail({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Flame;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-ember" />
        <h4 className="font-display text-sm tracking-[0.2em] text-gold-bright uppercase">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default AreasSection;
