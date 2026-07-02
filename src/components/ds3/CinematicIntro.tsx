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

export function CinematicIntro() {
  const setIntroSeen = useDS3Store((s) => s.setIntroSeen);
  const bumpMusicStart = useDS3Store((s) => s.bumpMusicStart);
  const [show, setShow] = useState(false);
  const [timeline, setTimeline] = useState<Timeline>(FULL);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    bumpMusicStart();
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [setIntroSeen, bumpMusicStart]);

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
                "--drift": `${(Math.random
