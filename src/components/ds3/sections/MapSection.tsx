"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, Flame, Users, Skull, Eye, MapPin } from "lucide-react";
import { PageShell, ParchmentCard, Tag } from "../primitives";
import { DetailDialog } from "../DetailDialog";
import { areas, type Area } from "@/data/ds3";
import { useSound } from "../SoundManager";

type MarkerType = "bonfire" | "boss" | "npc" | "secret";

// Hand-placed coordinates on the 1000x700 canvas — a stylised Lothric overworld.
const AREA_POSITIONS: Record<string, { x: number; y: number }> = {
  "cemetery-of-ash": { x: 130, y: 560 },
  "firelink-shrine": { x: 230, y: 540 },
  "high-wall-of-lothric": { x: 360, y: 470 },
  "undead-settlement": { x: 470, y: 540 },
  "road-of-sacrifices": { x: 460, y: 430 },
  "farron-keep": { x: 380, y: 340 },
  "cathedral-of-the-deep": { x: 560, y: 360 },
  "catacombs-of-carthus": { x: 540, y: 470 },
  "smoldering-lake": { x: 620, y: 500 },
  "irithyll-of-the-boreal-valley": { x: 700, y: 410 },
  "irithyll-dungeon": { x: 760, y: 460 },
  "profaned-capital": { x: 820, y: 490 },
  "anor-londo": { x: 720, y: 330 },
  "lothric-castle": { x: 520, y: 250 },
  "consumed-kings-garden": { x: 440, y: 300 },
  "grand-archives": { x: 580, y: 200 },
  "untended-graves": { x: 180, y: 620 },
  "archdragon-peak": { x: 300, y: 180 },
  "kiln-of-the-first-flame": { x: 880, y: 280 },
  "painted-world-of-ariandel": { x: 120, y: 280 },
  "the-ringed-city": { x: 880, y: 620 },
  "dreg-heap": { x: 920, y: 560 },
};

const MARKER_FILTERS: { id: MarkerType; label: string; icon: typeof Flame }[] = [
  { id: "bonfire", label: "Bonfires", icon: Flame },
  { id: "boss", label: "Bosses", icon: Skull },
  { id: "npc", label: "NPCs", icon: Users },
  { id: "secret", label: "Secrets", icon: Eye },
];

export function MapSection() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [filters, setFilters] = useState<Set<MarkerType>>(
    new Set(["bonfire", "boss", "npc", "secret"])
  );
  const [selected, setSelected] = useState<Area | null>(null);
  const [hoverArea, setHoverArea] = useState<string | null>(null);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const { play } = useSound();

  const toggleFilter = (m: MarkerType) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
    play("click");
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    setIsDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setPan({
      x: dragRef.current.px + (e.clientX - dragRef.current.x),
      y: dragRef.current.py + (e.clientY - dragRef.current.y),
    });
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  return (
    <PageShell
      id="map"
      eyebrow="Cartography of the Damned"
      title="Interactive World Map"
      intro="Trace the journey from the Cemetery of Ash to the Kiln of the First Flame. Pan, zoom, and reveal the bonfires, bosses, NPCs, and secrets of every region."
    >
      {/* Filter toggles */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {MARKER_FILTERS.map((f) => {
          const Icon = f.icon;
          const on = filters.has(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={`flex items-center gap-1.5 border px-3 py-1.5 font-serif text-xs transition-all ${
                on
                  ? "border-ember bg-ember/10 text-ember"
                  : "border-gold/15 text-ash/40 hover:text-ash"
              }`}
            >
              <Icon className="h-3 w-3" /> {f.label}
            </button>
          );
        })}
        <div className="ml-2 flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.2))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-gold/20 text-ash hover:border-ember hover:text-ember"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(2.4, z + 0.2))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-gold/20 text-ash hover:border-ember hover:text-ember"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="border border-gold/20 px-3 py-1.5 font-serif text-xs text-ash hover:border-ember hover:text-ember"
          >
            Reset
          </button>
        </div>
      </div>

      <ParchmentCard interactive={false} className="overflow-hidden p-0">
        <div
          className="relative h-[60vh] cursor-grab touch-none overflow-hidden active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            className="absolute inset-0 origin-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
          >
            <WorldMap
              areas={areas}
              positions={AREA_POSITIONS}
              filters={filters}
              hoverArea={hoverArea}
              setHoverArea={setHoverArea}
              onSelect={(a) => {
                setSelected(a);
                play("menu");
              }}
              onHoverPlay={() => play("hover")}
            />
          </div>

          {/* Hover label */}
          <AnimatePresence>
            {hoverArea && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute left-4 top-4 parchment rounded-sm px-3 py-2"
              >
                <span className="font-display text-sm text-gold-bright">{hoverArea}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="pointer-events-none absolute bottom-3 right-3 parchment rounded-sm px-3 py-2">
            <div className="flex items-center gap-3 font-serif text-[0.65rem] text-ash/70">
              <span className="flex items-center gap-1">
                <Flame className="h-2.5 w-2.5 text-ember" /> Bonfire
              </span>
              <span className="flex items-center gap-1">
                <Skull className="h-2.5 w-2.5 text-blood-bright" /> Boss
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-2.5 w-2.5 text-gold" /> NPC
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-2.5 w-2.5 text-purple-400" /> Secret
              </span>
            </div>
          </div>
        </div>
      </ParchmentCard>

      <DetailDialog open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name}>
        {selected && (
          <div>
            <span className="section-eyebrow">{selected.subtitle}</span>
            <h3 className="mt-2 font-display text-3xl text-gold-bright text-glow-gold">
              {selected.name}
            </h3>
            <p className="mt-4 font-serif text-base leading-relaxed text-ash/80">{selected.lore}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag variant="ember">
                <MapPin className="h-3 w-3" /> {selected.bonfires.length} bonfires
              </Tag>
              <Tag variant="blood">
                <Skull className="h-3 w-3" /> {selected.bosses.length} bosses
              </Tag>
              <Tag variant="gold">
                <Users className="h-3 w-3" /> {selected.npcs.length} NPCs
              </Tag>
            </div>
          </div>
        )}
      </DetailDialog>
    </PageShell>
  );
}

function WorldMap({
  areas,
  positions,
  filters,
  hoverArea,
  setHoverArea,
  onSelect,
  onHoverPlay,
}: {
  areas: Area[];
  positions: Record<string, { x: number; y: number }>;
  filters: Set<MarkerType>;
  hoverArea: string | null;
  setHoverArea: (s: string | null) => void;
  onSelect: (a: Area) => void;
  onHoverPlay: () => void;
}) {
  return (
    <svg viewBox="0 0 1000 700" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="map-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1a1208" />
          <stop offset="100%" stopColor="#060403" />
        </radialGradient>
        <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(197,160,89,0.05)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="1000" height="700" fill="url(#map-bg)" />
      <rect width="1000" height="700" fill="url(#map-grid)" />

      {/* Terrain shapes */}
      <g opacity="0.5">
        <path d="M0,580 Q200,520 380,600 T760,580 L1000,620 L1000,700 L0,700 Z" fill="#0c0a06" />
        <path d="M280,200 Q400,140 560,180 T820,220 L880,260 L820,300 Q600,260 380,300 Z" fill="#0f0b07" opacity="0.6" />
        <path d="M600,80 Q720,60 820,120 L860,180 Q760,160 660,200 Z" fill="#100c08" opacity="0.5" />
      </g>

      {/* Connections (path lines between sequential areas) */}
      <g stroke="rgba(197,160,89,0.18)" strokeWidth="1.5" strokeDasharray="4 6" fill="none">
        {areas.slice(0, -1).map((a, i) => {
          const p1 = positions[a.id];
          const next = areas[i + 1];
          const p2 = positions[next.id];
          if (!p1 || !p2) return null;
          return <path key={a.id} d={`M${p1.x},${p1.y} L${p2.x},${p2.y}`} />;
        })}
      </g>

      {/* Markers */}
      {areas.map((area) => {
        const pos = positions[area.id];
        if (!pos) return null;
        const isHover = hoverArea === area.name;
        return (
          <g
            key={area.id}
            transform={`translate(${pos.x},${pos.y})`}
            className="cursor-pointer"
            onMouseEnter={() => {
              setHoverArea(area.name);
              onHoverPlay();
            }}
            onMouseLeave={() => setHoverArea(null)}
            onClick={() => onSelect(area)}
          >
            {/* Area node */}
            <circle
              r={isHover ? 16 : 12}
              fill="rgba(10,6,4,0.9)"
              stroke={isHover ? "#ff7a18" : "#c5a059"}
              strokeWidth={isHover ? 2.5 : 1.5}
            />
            <circle r="3" fill={isHover ? "#ff7a18" : "#c5a059"} />
            {isHover && (
              <circle r="22" fill="none" stroke="#ff7a18" strokeWidth="1" opacity="0.4">
                <animate attributeName="r" values="16;26;16" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Sub-markers around the area */}
            {filters.has("bonfire") &&
              area.bonfires.slice(0, 3).map((_, i) => (
                <g key={`b${i}`} transform={`rotate(${i * 120}) translate(0,-26)`}>
                  <circle r="2.5" fill="#ff7a18" opacity="0.9" />
                </g>
              ))}
            {filters.has("boss") &&
              area.bosses.slice(0, 2).map((_, i) => (
                <g key={`s${i}`} transform={`rotate(${i * 180 + 60}) translate(0,-34)`}>
                  <rect x="-2" y="-2" width="4" height="4" fill="#b91c1c" transform="rotate(45)" />
                </g>
              ))}
            {filters.has("npc") &&
              area.npcs.slice(0, 2).map((_, i) => (
                <g key={`n${i}`} transform={`rotate(${i * 180 + 90}) translate(0,-40)`}>
                  <circle r="2" fill="#e8c878" />
                </g>
              ))}
            {filters.has("secret") &&
              area.secrets.slice(0, 1).map((_, i) => (
                <g key={`s${i}`} transform={`rotate(150) translate(0,-30)`}>
                  <circle r="2" fill="#a878d8" opacity="0.8" />
                </g>
              ))}

            {/* Label */}
            <text
              y={isHover ? 34 : 30}
              textAnchor="middle"
              className="font-display"
              fill={isHover ? "#e8c878" : "#8a8174"}
              fontSize={isHover ? 12 : 10}
              style={{ pointerEvents: "none" }}
            >
              {area.name.length > 22 ? area.name.slice(0, 20) + "…" : area.name}
            </text>
          </g>
        );
      })}

      {/* Compass */}
      <g transform="translate(940,80)" opacity="0.5">
        <circle r="28" fill="none" stroke="#c5a059" strokeWidth="1" />
        <path d="M0,-24 L4,0 L0,4 L-4,0 Z" fill="#c5a059" />
        <text y="-32" textAnchor="middle" fill="#c5a059" fontSize="10" className="font-display">
          N
        </text>
      </g>
    </svg>
  );
}

export default MapSection;
