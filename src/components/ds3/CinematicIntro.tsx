"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDS3Store } from "./useDS3Store";

const SESSION_KEY = "ds3-intro-seen";

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
      /* sessionStorage unavailable */
    }
    const reduced = window.matchMedia("(pref
