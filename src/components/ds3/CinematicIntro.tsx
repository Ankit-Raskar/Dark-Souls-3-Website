"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDS3Store } from "./useDS3Store";

const SESSION_KEY = "ds3-intro-seen";

/** Timeline (in seconds). Reduced-motion variant shortens to ~1.5s total. */
interface Timeline {
  lineStart: number;
  lineDur: number;
  flameStart: number;
  flameDur: number;
  titleStart: number;
  titleDur: number;
  subtitleStart: number;
  subtitleDur: number;
  exitStart: number;
  exitDur: number;
  total: number;
}

const FULL: Timeline = {
  lineStart: 0.3,
  lineDur: 1.2,
  flameStart: 1.5,
  flameDur: 0.8,
  titleStart: 2.3,
  titleDur: 1.5,
  subtitleStart: 2.8,
  subtitleDur: 1.2,
  exitStart: 4.8,
  exitDur: 1.0,
  total: 5.8,
};

const REDUCED: Timeline = {
  lineStart: 0.05,
  lineDur: 0.25,
  flameStart: 0.3,
  flameDur: 0.2,
  titleStart: 0.4,
  titleDur: 0.5,
  subtitleStart: 0.55,
  subtitleDur: 0.4,
  exitStart: 1.1,
  exitDur: 0.4,
  total: 1.6,
};

/**
 * FromSoftware-style cinematic intro overlay shown on first entry.
 *
 * Sequence:
 *   1. Black screen.
 *   2. Thin ember line draws horizontally across center.
 *   3. Line expands into a faint vertical "flame" reveal.
 *   4. Title fades in: "DARK SOULS III" (Cinzel, cinematic tracking, ember
 *      glow) + subtitle "PREPARE TO DIE ONCE MORE" in small-caps gold.
 *   5. An "ENTER" button fades in. The user MUST click it to proceed — this
 *      click is the user gesture that unlocks browser audio autoplay, so the
 *      background music starts immediately on entry.
 *   6. On click: overlay fades, intro marked seen, and `bumpMusicStart` fires.
 *
 * Embers rise throughout. A "Skip" link does the same as ENTER. Once
 * dismissed, `introSeen` is set in the zustand store and a `ds3-intro-seen`
 * flag is written to sessionStorage so the intro does not replay on
 * client-side navigation.
 */
export function CinematicIntro() {
  const setIntroSeen = useDS3Store((s) => s.setIntroSeen);
  const bumpMusicStart = useDS3Store((s) => s.bumpMusicStart);
  const [show, setShow] = useState(false);
  const [timeline, setTimeline] = useState<Timeline>(FULL);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't replay within the same browser session.
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setIntroSeen(true);
        return;
      }
    } catch {
      /* sessionStorage unavailable — fall through and play */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeline(reduced ? REDUCED : FULL);
    setShow(true);
  }, [setIntroSeen]);

  const dismiss = useCallback(() => {
    setShow(false);
    setIntroSeen(true);
    // Signal the MusicPlayer to start — this runs inside the click handler,
    // so it counts as a user gesture and bypasses browser autoplay blocking.
    bumpMusicStart();
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [setIntroSeen, bumpMusicStart]);

  // NOTE: no auto-dismiss — the user must click ENTER to proceed, which is the
  // gesture that unlocks audio playback.

  const D = timeline;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-soot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: D.exitDur, ease: "easeInOut" }}
        >
          {/* Rising embers during the intro */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: D === REDUCED ? 6 : 18 }).map((_, i) => {
              const style = {
                left: `${10 + Math.random() * 80}%`,
                bottom: "-12px",
                "--drift": `${(Math.random() - 0.5) * 80}px`,
                animation: `ember-rise ${3 + Math.random() * 4}s linear ${Math.random() * 3}s infinite`,
              } as CSSProperties;
              return <span key={i} className="ember-dot" style={style} />;
            })}
          </div>

          {/* Ember line draws horizontally across center */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[2px]"
            style={{
              width: "60%",
              translateX: "-50%",
              translateY: "-50%",
              transformOrigin: "center",
              background:
                "linear-gradient(90deg, transparent, rgba(255,170,60,0.9), rgba(255,122,24,1), rgba(255,170,60,0.9), transparent)",
              boxShadow:
                "0 0 12px rgba(255,122,24,0.8), 0 0 24px rgba(194,65,12,0.5)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              delay: D.lineStart,
              duration: D.lineDur,
              ease: "easeOut",
            }}
          />

          {/* Line expands into a faint vertical flame reveal */}
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{
              width: "50%",
              height: "40vh",
              translateX: "-50%",
              translateY: "-50%",
              transformOrigin: "center",
              background:
                "radial-gradient(ellipse at center, rgba(255,122,24,0.18), rgba(194,65,12,0.08) 40%, transparent 70%)",
              filter: "blur(8px)",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              delay: D.flameStart,
              duration: D.flameDur,
              ease: "easeOut",
            }}
          />

          {/* Title + subtitle */}
          <motion.div
            className="relative z-10 px-6 text-center"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: D.titleStart,
              duration: D.titleDur,
              ease: "easeOut",
            }}
          >
            <h1 className="font-display tracking-cinematic text-glow-ember text-3xl sm:text-5xl md:text-7xl font-bold text-ember">
              DARK SOULS III
            </h1>
            <motion.p
              className="mt-5 smallcaps text-gold-bright text-[0.65rem] sm:text-xs"
              style={{ letterSpacing: "0.4em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: D.subtitleStart,
                duration: D.subtitleDur,
                ease: "easeOut",
              }}
            >
              Prepare to Die Once More
            </motion.p>
          </motion.div>

          {/* ENTER button — the user MUST click this to proceed. This click is
              the user gesture that unlocks browser audio autoplay, so the
              background music starts the moment they enter. */}
          <motion.button
            type="button"
            onClick={dismiss}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: D.subtitleStart + D.subtitleDur + 0.3,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="btn-ember animate-pulse-glow group absolute bottom-16 left-1/2 flex -translate-x-1/2 items-center gap-2 px-8 py-3 font-display text-sm tracking-[0.3em] uppercase"
            aria-label="Enter the kingdom and begin the music"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(255,122,24,0.9)]" />
            Enter
          </motion.button>

          {/* Small skip link for accessibility */}
          <button
            type="button"
            onClick={dismiss}
            className="absolute bottom-6 right-6 border border-gold/20 px-3 py-1.5 text-[0.6rem] smallcaps text-gold/50 transition-colors hover:border-gold/50 hover:text-gold-bright sm:bottom-8 sm:right-8"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CinematicIntro;
