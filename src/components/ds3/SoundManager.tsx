"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useDS3Store } from "./useDS3Store";

export type SoundName =
  | "hover"
  | "click"
  | "unsheathe"
  | "bonfire"
  | "crackle"
  | "menu"
  | "roar";

interface SoundContextValue {
  /** Play a synthesized UI sound. No-op when SFX disabled or before audio unlocked. */
  play: (name: SoundName) => void;
  /** Whether SFX are currently enabled (mirrors the zustand `sfxEnabled` flag). */
  enabled: boolean;
  /** Toggle SFX on/off. Enabling primes the AudioContext on the gesture. */
  toggle: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

const SFX_KEY = "ds3-sfx";

/* ------------------------------------------------------------------ */
/*  WebAudio synthesizers — no asset files, everything procedural.     */
/* ------------------------------------------------------------------ */

function createNoiseBuffer(ctx: AudioContext, duration = 0.3): AudioBuffer {
  const len = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** hover — short soft sine blip (~0.08s, ~660Hz, low gain). */
function playHover(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(660, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

/** click — two quick square blips (~0.05s each, 220 → 110Hz). */
function playClick(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const steps = [
    { freq: 220, start: 0, dur: 0.05 },
    { freq: 110, start: 0.06, dur: 0.05 },
  ];
  for (const { freq, start, dur } of steps) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now + start);
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(0.07, now + start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + dur + 0.02);
  }
}

/** unsheathe — filtered noise sweep (highpass, ~0.25s, decaying). */
function playUnsheathe(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.3);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(3000, now + 0.25);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.3);
}

/** bonfire — warm low drone + crackle (sine ~110Hz + noise bursts, ~0.6s). */
function playBonfire(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(110, now);
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.1, now + 0.1);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  osc.connect(oscGain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.65);

  for (let i = 0; i < 6; i++) {
    const t = now + 0.05 + Math.random() * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 0.05);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1500 + Math.random() * 2000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.04 + Math.random() * 0.04, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    noise.connect(filter).connect(g).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.06);
  }
}

/** crackle — tiny noise bursts (random). */
function playCrackle(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const count = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const t = now + Math.random() * 0.15;
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 0.03);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 2000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    noise.connect(filter).connect(g).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.04);
  }
}

/** menu — low thud (sine ~80Hz, 0.12s). */
function playMenu(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(80, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.14);
}

/** roar — distorted low sawtooth sweep down (~0.5s). For boss hover. */
function playRoar(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.55);
}

const PLAYERS: Record<SoundName, (ctx: AudioContext) => void> = {
  hover: playHover,
  click: playClick,
  unsheathe: playUnsheathe,
  bonfire: playBonfire,
  crackle: playCrackle,
  menu: playMenu,
  roar: playRoar,
};

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

interface WindowWithWebkitAudio {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const sfxEnabled = useDS3Store((s) => s.sfxEnabled);
  const setSfxEnabled = useDS3Store((s) => s.setSfxEnabled);

  // Mirror the SFX flag to localStorage `ds3-sfx` (per spec) for direct reads.
  useEffect(() => {
    try {
      localStorage.setItem(SFX_KEY, sfxEnabled ? "1" : "0");
    } catch {
      /* storage unavailable — ignore */
    }
  }, [sfxEnabled]);

  const ensureCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    let ctx = ctxRef.current;
    if (!ctx) {
      const w = window as unknown as WindowWithWebkitAudio;
      const AC = w.AudioContext ?? w.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
      } catch {
        return null;
      }
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") {
      void ctx.resume().catch(() => {});
    }
    return ctx;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!sfxEnabled) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const fn = PLAYERS[name];
      if (!fn) return;
      try {
        fn(ctx);
      } catch {
        /* transient audio error — ignore */
      }
    },
    [sfxEnabled, ensureCtx]
  );

  const toggle = useCallback(() => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    if (next) {
      // Enabling on a user gesture — prime the context immediately so the
      // confirm "menu" thud plays even though state hasn't flushed yet.
      const ctx = ensureCtx();
      if (ctx) {
        try {
          playMenu(ctx);
        } catch {
          /* ignore */
        }
      }
    }
  }, [sfxEnabled, setSfxEnabled, ensureCtx]);

  useEffect(() => {
    return () => {
      // Close the shared AudioContext on unmount.
      const ctx = ctxRef.current;
      if (ctx) {
        void ctx.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  const value = useMemo<SoundContextValue>(
    () => ({ play, enabled: sfxEnabled, toggle }),
    [play, sfxEnabled, toggle]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

/**
 * Hook into the shared SoundProvider. Returns safe no-op defaults if used
 * outside a provider so consumers never crash.
 */
export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    return {
      play: () => {},
      enabled: false,
      toggle: () => {},
    };
  }
  return ctx;
}

export default SoundProvider;
