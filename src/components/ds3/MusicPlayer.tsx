"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Music,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useDS3Store } from "./useDS3Store";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ds3-music";

interface StoredMusic {
  volume: number; // 0-100
  muted: boolean;
}

function loadStored(): StoredMusic {
  if (typeof window === "undefined") return { volume: 60, muted: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<StoredMusic>;
      return {
        volume:
          typeof p.volume === "number" && p.volume >= 0 && p.volume <= 100
            ? p.volume
            : 60,
        muted: !!p.muted,
      };
    }
  } catch {
    /* ignore */
  }
  return { volume: 60, muted: false };
}

/**
 * Floating ambient-music controller.
 *
 * NOTE TO PROJECT OWNER: the `<audio>` element references
 * `/audio/ds3-ambient.mp3`. Supply a properly licensed DS3 ambient track at
 * `public/audio/ds3-ambient.mp3`. Until then the controls still render and
 * respond, but playback will simply not produce sound.
 *
 * Features:
 *  - Play/Pause toggle with smooth fade in (0 → target over ~1.5s) and fade
 *    out (target → 0 over ~0.8s then pause).
 *  - Mute toggle + volume slider (0-100).
 *  - Autoplay is attempted on mount; when blocked by browser policy a subtle
 *    "Click to awaken the flame" prompt is shown, and playback starts on the
 *    first user `pointerdown`/`keydown`.
 *  - Volume + mute persisted to `localStorage` (`ds3-music`).
 *  - `musicEnabled` flag from the zustand store can globally hide/disable the
 *    player (e.g. toggled from the navbar).
 *  - Collapsible to a small icon button.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number>(0);
  const targetVolumeRef = useRef(0.6);
  const mutedRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [playing, setPlaying] = useState(false);
  // Lazy-initialize from localStorage (loadStored is SSR-safe: returns defaults
  // when `window` is undefined). The UI panel is gated on `mounted` so the
  // server/client value difference never produces a hydration mismatch.
  const [volume, setVolume] = useState<number>(() => loadStored().volume);
  const [muted, setMuted] = useState<boolean>(() => loadStored().muted);
  const [showPrompt, setShowPrompt] = useState(false);

  const musicEnabled = useDS3Store((s) => s.musicEnabled);
  const musicStartSignal = useDS3Store((s) => s.musicStartSignal);

  // Keep refs in sync for use inside stable callbacks / effect closures.
  useEffect(() => {
    mutedRef.current = muted;
    targetVolumeRef.current = muted ? 0 : volume / 100;
  }, [muted, volume]);

  // Mark as mounted on the client so the persisted `musicEnabled` flag can be
  // read without a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Persist volume + mute.
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, muted }));
    } catch {
      /* ignore */
    }
  }, [volume, muted, mounted]);

  // Smooth volume ramp helper (rAF-driven, no React re-renders).
  const fadeTo = useCallback(
    (target: number, durationMs: number, onDone?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;
      cancelAnimationFrame(rafRef.current);
      const start = audio.volume;
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        audio.volume = Math.max(0, start + (target - start) * t);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          onDone?.();
        }
      };
      rafRef.current = requestAnimationFrame(step);
    },
    []
  );

  const startPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    const p = audio.play();
    if (!p) return;
    p.then(() => {
      setPlaying(true);
      setShowPrompt(false);
      fadeTo(mutedRef.current ? 0 : targetVolumeRef.current, 1500);
    }).catch(() => {
      setShowPrompt(true);
    });
  }, [fadeTo]);

  const pausePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(rafRef.current);
    fadeTo(0, 800, () => {
      audio.pause();
      setPlaying(false);
    });
  }, [fadeTo]);

  // Autoplay attempt + first-interaction start (only when music enabled).
  useEffect(() => {
    if (!mounted || !musicEnabled) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    const p = audio.play();
    if (p) {
      p.then(() => {
        setPlaying(true);
        setShowPrompt(false);
        fadeTo(mutedRef.current ? 0 : targetVolumeRef.current, 1500);
      }).catch(() => {
        // Autoplay blocked — wait for first user gesture.
        setShowPrompt(true);
      });
    }

    const onFirstInteract = () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      if (audio.paused) {
        startPlay();
      }
    };
    window.addEventListener("pointerdown", onFirstInteract, { passive: true });
    window.addEventListener("keydown", onFirstInteract, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
  }, [mounted, musicEnabled, fadeTo, startPlay]);

  // React to explicit music-start signals (e.g. the cinematic intro's ENTER
  // button). That click is a genuine user gesture, so audio.play() succeeds
  // and bypasses browser autoplay blocking. Skips the very first render (0).
  const prevSignal = useRef(0);
  useEffect(() => {
    if (!mounted) return;
    if (musicStartSignal === prevSignal.current) return;
    prevSignal.current = musicStartSignal;
    if (musicStartSignal <= 0) return;
    if (!musicEnabled) return;
    // Start (or resume) playback.
    startPlay();
  }, [musicStartSignal, mounted, musicEnabled, startPlay]);

  // Global disable: pause when musicEnabled flips off.
  useEffect(() => {
    if (!musicEnabled && playing) {
      pausePlay();
    }
  }, [musicEnabled, playing, pausePlay]);

  // Live volume / mute changes during playback.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing) return;
    cancelAnimationFrame(rafRef.current);
    fadeTo(muted ? 0 : volume / 100, 400);
  }, [volume, muted, playing, fadeTo]);

  // Cleanup rAF on unmount.
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const togglePlay = () => {
    if (playing) pausePlay();
    else startPlay();
  };

  const toggleMute = () => setMuted((m) => !m);

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (v > 0 && muted) setMuted(false);
  };

  return (
    <>
      {/*
        NOTE TO PROJECT OWNER: supply a licensed DS3 ambient track here.
        Until then this placeholder src will simply not produce audio.
      */}
      <audio ref={audioRef} src="/audio/ds3-ambient.mp3" loop preload="auto" />

      {mounted && (
        <AnimatePresence>
          {musicEnabled && (
            <motion.div
              className="fixed bottom-4 left-4 z-[90] sm:bottom-6 sm:left-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {collapsed ? (
                <div className="parchment rounded-sm">
                  <button
                    type="button"
                    onClick={() => setCollapsed(false)}
                    className="relative flex items-center gap-1 p-2 text-gold transition-colors hover:text-gold-bright"
                    aria-label="Expand music player"
                  >
                    <Music className="h-5 w-5" />
                    <ChevronUp className="h-3 w-3" />
                    {playing && (
                      <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_6px_rgba(255,122,24,0.9)]" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="parchment w-[260px] rounded-sm p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Music className="h-4 w-4 shrink-0 text-ember" />
                      <div className="min-w-0">
                        <div className="truncate text-[10px] smallcaps text-gold/70">
                          Now Playing
                        </div>
                        <div className="truncate font-display text-xs text-foreground/90">
                          Ashen Ambient
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollapsed(true)}
                      className="p-1 text-gold/60 transition-colors hover:text-gold-bright"
                      aria-label="Collapse music player"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mb-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="btn-ember flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 text-gold/70 transition-colors hover:text-gold-bright"
                      aria-label={muted ? "Unmute" : "Mute"}
                    >
                      {muted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={muted ? 0 : volume}
                      onChange={onVolumeChange}
                      className="h-1 flex-1 cursor-pointer accent-ember"
                      aria-label="Volume"
                    />
                  </div>

                  <div
                    className={cn(
                      "text-center text-[10px] smallcaps italic text-gold/60 transition-opacity",
                      showPrompt ? "opacity-100" : "opacity-0"
                    )}
                  >
                    Click to awaken the flame
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default MusicPlayer;
