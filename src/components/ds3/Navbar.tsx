"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, Music2, Music, Volume2, VolumeX, Flame, ChevronDown, Home as HomeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDS3Store, type DS3Page } from "./useDS3Store";
import { useSound } from "./SoundManager";

type NavItem = { id: DS3Page; label: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "The Tale",
    items: [
      { id: "story", label: "Story" },
      { id: "lore", label: "Lore" },
      { id: "timeline", label: "Timeline" },
    ],
  },
  {
    label: "Bestiary",
    items: [
      { id: "bosses", label: "Bosses" },
      { id: "enemies", label: "Enemies" },
      { id: "areas", label: "Areas" },
      { id: "map", label: "World Map" },
    ],
  },
  {
    label: "Arsenal",
    items: [
      { id: "weapons", label: "Weapons" },
      { id: "armor", label: "Armor" },
      { id: "rings", label: "Rings" },
      { id: "magic", label: "Magic" },
    ],
  },
  {
    label: "Inhabitants",
    items: [
      { id: "characters", label: "Characters" },
      { id: "npcs", label: "NPCs" },
      { id: "covenants", label: "Covenants" },
    ],
  },
  {
    label: "Expansions",
    items: [{ id: "dlc", label: "DLC" }],
  },
  {
    label: "Media",
    items: [
      { id: "gallery", label: "Gallery" },
      { id: "videos", label: "Videos" },
    ],
  },
  {
    label: "Tools",
    items: [{ id: "build", label: "Build Calc" }],
  },
  {
    label: "Community",
    items: [
      { id: "news", label: "Dispatches" },
      { id: "community", label: "Community" },
    ],
  },
];

const ALL_ITEMS: NavItem[] = [{ id: "home", label: "Home" }, ...NAV_GROUPS.flatMap((g) => g.items)];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled, setSearchOpen, page, setPage } =
    useDS3Store();
  const { play } = useSound();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (p: DS3Page) => {
    setPage(p);
    setMobileOpen(false);
    setOpenGroup(null);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-500",
          scrolled
            ? "border-b border-gold/15 bg-soot/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            : "border-b-0 bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 sm:px-6">
          {/* Brand */}
          <button
            onClick={() => go("home")}
            onMouseEnter={() => play("hover")}
            className="group flex shrink-0 items-center gap-2 py-4"
            aria-label="Dark Souls III home"
          >
            <Flame className="h-5 w-5 text-ember animate-flicker transition-transform group-hover:scale-110" />
            <span className="font-display text-sm font-semibold tracking-[0.25em] text-gold-bright sm:text-base">
              DARK&nbsp;SOULS&nbsp;III
            </span>
          </button>

          {/* Desktop mega-nav */}
          <nav className="hidden flex-1 items-center gap-0 lg:flex">
            <NavButton active={page === "home"} onClick={() => go("home")} onHover={() => play("hover")} sound={play}>
              <HomeIcon className="h-3.5 w-3.5" /> Home
            </NavButton>
            {NAV_GROUPS.map((g) => (
              <div
                key={g.label}
                className="relative"
                onMouseEnter={() => { setOpenGroup(g.label); play("hover"); }}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-4 font-serif text-[0.82rem] tracking-wide transition-colors",
                    g.items.some((i) => i.id === page) ? "text-gold-bright" : "text-ash/70 hover:text-ash"
                  )}
                >
                  {g.label}
                  <ChevronDown className={cn("h-3 w-3 transition-transform", openGroup === g.label && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openGroup === g.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full min-w-[12rem] pt-1"
                    >
                      <div className="parchment overflow-hidden rounded-sm border border-gold/20 shadow-2xl">
                        {g.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => { go(item.id); play("click"); }}
                            onMouseEnter={() => play("hover")}
                            className={cn(
                              "flex w-full items-center justify-between px-4 py-2.5 text-left font-serif text-sm transition-colors",
                              page === item.id
                                ? "bg-ember/10 text-ember"
                                : "text-ash/80 hover:bg-ember/5 hover:text-gold-bright"
                            )}
                          >
                            {item.label}
                            {page === item.id && <Flame className="h-3 w-3 text-ember" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Controls */}
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <ControlButton
              label="Search the compendium (Cmd+K)"
              onClick={() => { play("menu"); setSearchOpen(true); }}
            >
              <Search className="h-4 w-4" />
            </ControlButton>
            <ControlButton
              label={musicEnabled ? "Mute ambient music" : "Play ambient music"}
              active={musicEnabled}
              onClick={() => { setMusicEnabled(!musicEnabled); play("click"); }}
            >
              {musicEnabled ? <Music2 className="h-4 w-4" /> : <Music className="h-4 w-4" />}
            </ControlButton>
            <ControlButton
              label={sfxEnabled ? "Mute sound effects" : "Enable sound effects"}
              active={sfxEnabled}
              onClick={() => { setSfxEnabled(!sfxEnabled); if (!sfxEnabled) play("bonfire"); }}
            >
              {sfxEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </ControlButton>
            <button
              onClick={() => { play("menu"); setMobileOpen(true); }}
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-gold/20 text-gold-bright lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[95] bg-soot/97 backdrop-blur-md lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
              <span className="font-display text-sm tracking-[0.25em] text-gold-bright">DARK&nbsp;SOULS&nbsp;III</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-gold/20 text-gold-bright"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="no-scrollbar h-[calc(100%-72px)] overflow-y-auto px-6 py-8">
              <button
                onClick={() => go("home")}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-gold/10 py-4 text-left font-display text-lg tracking-wider",
                  page === "home" ? "text-ember" : "text-ash/80"
                )}
              >
                <HomeIcon className="h-4 w-4" /> Home
              </button>
              {NAV_GROUPS.map((g, gi) => (
                <div key={g.label} className="border-b border-gold/10 py-4">
                  <p className="mb-2 section-eyebrow">{g.label}</p>
                  <div className="flex flex-col">
                    {g.items.map((item, ii) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * (gi * 3 + ii), duration: 0.3 }}
                        onClick={() => go(item.id)}
                        className={cn(
                          "flex w-full items-center justify-between py-2.5 pl-2 text-left font-serif text-base",
                          page === item.id ? "text-ember" : "text-ash/75"
                        )}
                      >
                        {item.label}
                        {page === item.id && <Flame className="h-3 w-3 text-ember" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
              <p className="mt-10 font-serif text-xs italic text-muted-foreground">
                &ldquo;Only, in truth… the Lords will wage war once more.&rdquo;
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavButton({
  children,
  onClick,
  onHover,
  active,
  sound,
}: {
  children: React.ReactNode;
  onClick: () => void;
  onHover: () => void;
  active?: boolean;
  sound: (n: "hover" | "click") => void;
}) {
  return (
    <button
      onClick={() => { onClick(); sound("click"); }}
      onMouseEnter={onHover}
      className={cn(
        "relative flex items-center gap-1.5 px-3 py-4 font-serif text-[0.82rem] tracking-wide transition-colors",
        active ? "text-gold-bright" : "text-ash/70 hover:text-ash"
      )}
    >
      {children}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-2 bottom-2 h-px bg-gradient-to-r from-transparent via-ember to-transparent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}

function ControlButton({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-sm border transition-all",
        active
          ? "border-ember/50 text-ember shadow-[0_0_12px_rgba(255,122,24,0.3)]"
          : "border-gold/15 text-ash/60 hover:border-gold/40 hover:text-gold-bright"
      )}
    >
      {children}
    </button>
  );
}

export default Navbar;
