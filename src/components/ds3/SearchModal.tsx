"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Skull, Users, Swords, Shield, Gem, Sparkles, MapPin, ScrollText } from "lucide-react";
import { useDS3Store, type DS3Page } from "./useDS3Store";
import { useSound } from "./SoundManager";
import {
  bosses,
  characters,
  weapons,
  armorSets,
  rings,
  spells,
  npcs,
  covenants,
  enemies,
  areas,
  loreArticles,
} from "@/data/ds3";

type SearchEntry = {
  id: string;
  name: string;
  kind: string;
  sub: string;
  icon: typeof Skull;
  target: string;
};

const ICONS = {
  Boss: Skull,
  Character: Users,
  Weapon: Swords,
  Armor: Shield,
  Ring: Gem,
  Spell: Sparkles,
  NPC: Users,
  Covenant: Users,
  Enemy: Skull,
  Area: MapPin,
  Lore: ScrollText,
};

const ENTRIES: SearchEntry[] = [
  ...bosses.map((b) => ({ id: b.id, name: b.name, kind: "Boss", sub: b.title, icon: ICONS.Boss, target: "bosses" })),
  ...characters.map((c) => ({ id: c.id, name: c.name, kind: "Character", sub: c.role, icon: ICONS.Character, target: "characters" })),
  ...weapons.map((w) => ({ id: w.id, name: w.name, kind: "Weapon", sub: w.category, icon: ICONS.Weapon, target: "weapons" })),
  ...armorSets.map((a) => ({ id: a.id, name: a.name, kind: "Armor", sub: "Armor Set", icon: ICONS.Armor, target: "armor" })),
  ...rings.map((r) => ({ id: r.id, name: r.name, kind: "Ring", sub: r.category, icon: ICONS.Ring, target: "rings" })),
  ...spells.map((s) => ({ id: s.id, name: s.name, kind: "Spell", sub: s.type, icon: ICONS.Spell, target: "magic" })),
  ...npcs.map((n) => ({ id: n.id, name: n.name, kind: "NPC", sub: n.title, icon: ICONS.NPC, target: "npcs" })),
  ...covenants.map((c) => ({ id: c.id, name: c.name, kind: "Covenant", sub: "Covenant", icon: ICONS.Covenant, target: "covenants" })),
  ...enemies.map((e) => ({ id: e.id, name: e.name, kind: "Enemy", sub: e.location, icon: ICONS.Enemy, target: "enemies" })),
  ...areas.map((a) => ({ id: a.id, name: a.name, kind: "Area", sub: a.subtitle, icon: ICONS.Area, target: "areas" })),
  ...loreArticles.map((l) => ({ id: l.id, name: l.title, kind: "Lore", sub: l.category, icon: ICONS.Lore, target: "lore" })),
];

const KIND_TONE: Record<string, string> = {
  Boss: "border-blood/40 text-blood-bright",
  Character: "border-gold/40 text-gold-bright",
  Weapon: "border-ember/40 text-ember",
  Armor: "border-gold/40 text-gold-bright",
  Ring: "border-ember/40 text-ember",
  Spell: "border-ember/40 text-ember",
  NPC: "border-gold/40 text-gold-bright",
  Covenant: "border-ember/40 text-ember",
  Enemy: "border-blood/40 text-blood-bright",
  Area: "border-gold/40 text-gold-bright",
  Lore: "border-gold/40 text-gold-bright",
};

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useDS3Store();
  const { play } = useSound();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setSearchOpen(false);
    setQ("");
  };

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  // ESC to close, Cmd/Ctrl+K to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) close();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        useDS3Store.getState().setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ENTRIES.slice(0, 8);
    return ENTRIES.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.sub.toLowerCase().includes(term) ||
        e.kind.toLowerCase().includes(term)
    ).slice(0, 24);
  }, [q]);

  const go = (target: string) => {
    close();
    play("click");
    useDS3Store.getState().setPage(target as DS3Page);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-start justify-center bg-black/85 p-4 backdrop-blur-md sm:pt-24"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="parchment ember-border w-full max-w-2xl rounded-sm"
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-gold/15 p-4">
              <Search className="h-5 w-5 text-ember" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the compendium — bosses, weapons, lore…"
                className="flex-1 bg-transparent font-serif text-base text-ash placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="rounded-sm border border-gold/20 px-2 py-0.5 font-serif text-[0.65rem] text-ash/60">
                ESC
              </kbd>
              <button
                onClick={close}
                aria-label="Close search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-gold/20 text-ash hover:border-ember hover:text-ember"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="p-8 text-center font-serif text-sm italic text-muted-foreground">
                  No souls found by that name…
                </p>
              ) : (
                <ul>
                  {results.map((r) => {
                    const Icon = r.icon;
                    return (
                      <li key={`${r.kind}-${r.id}`}>
                        <button
                          onClick={() => go(r.target)}
                          onMouseEnter={() => play("hover")}
                          className="group flex w-full items-center gap-3 rounded-sm p-3 text-left transition-colors hover:bg-ember/5"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-gold/15 bg-soot">
                            <Icon className="h-4 w-4 text-gold" />
                          </span>
                          <span className="flex-1">
                            <span className="block font-display text-sm text-gold-bright group-hover:text-ember">
                              {r.name}
                            </span>
                            <span className="block font-serif text-xs text-ash/60">{r.sub}</span>
                          </span>
                          <span
                            className={`rounded-sm border px-2 py-0.5 font-serif text-[0.65rem] ${KIND_TONE[r.kind]}`}
                          >
                            {r.kind}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t border-gold/10 p-3 text-center font-serif text-[0.65rem] text-muted-foreground">
              Press <kbd className="rounded-sm border border-gold/20 px-1.5 py-0.5">⌘K</kbd> anytime to
              search · {ENTRIES.length} entries indexed
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;
