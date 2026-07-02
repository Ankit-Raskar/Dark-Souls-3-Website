"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AshFieldProps {
  /** Multiplier on the base particle count (default 1). */
  density?: number;
  /** Particle style. "mixed" = ash + embers (default). */
  variant?: "ash" | "ember" | "mixed";
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: "ash" | "ember";
  life: number;
  maxLife: number;
  phase: number;
}

const BASE_COUNT = 110;

function rand(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

/**
 * Canvas-based ambient particle field — floating ash drifting down and embers
 * rising up with flicker. Used as a fixed background layer behind content.
 *
 * - Embers rise upward with slight horizontal drift + flicker, drawn with
 *   additive blending (`globalCompositeOperation = "lighter"`).
 * - Ash falls slowly downward with a sine sway.
 * - Gentle parallax: particles drift in response to mouse position.
 * - Pauses when the tab is hidden or `prefers-reduced-motion` is set.
 * - devicePixelRatio aware; resizes via window resize listener.
 */
export function AshField({ density = 1, variant = "mixed", className }: AshFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (typeof window === "undefined" || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const count = Math.max(40, Math.round(BASE_COUNT * density));

    const spawn = (type: "ash" | "ember", atTop = false): Particle => {
      const isEmber = type === "ember";
      return {
        x: rand(0, width),
        y: isEmber
          ? atTop
            ? height
            : rand(0, height)
          : atTop
            ? -rand(0, 80)
            : rand(-100, height),
        vx: rand(-0.15, 0.15),
        vy: isEmber ? rand(-0.8, -0.3) : rand(0.15, 0.5),
        size: isEmber ? rand(1.2, 2.8) : rand(0.8, 2.2),
        type: isEmber ? "ember" : "ash",
        life: 0,
        maxLife: isEmber ? rand(3000, 7000) : rand(8000, 16000),
        phase: rand(0, Math.PI * 2),
      };
    };

    const initParticles = () => {
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        let type: "ash" | "ember";
        if (variant === "mixed") type = Math.random() > 0.55 ? "ember" : "ash";
        else type = variant;
        arr.push(spawn(type));
      }
      particlesRef.current = arr;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const onMove = (e: PointerEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onVisibility = () => {
      const wasRunning = runningRef.current;
      runningRef.current = !document.hidden;
      if (runningRef.current && !wasRunning) {
        last = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    let last = performance.now();
    const tick = (now: number) => {
      if (!runningRef.current) return;
      const dt = Math.min(50, now - last);
      last = now;

      // Smooth the parallax target.
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Pass 1: ash (normal blend).
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.type !== "ash") continue;
        p.life += dt;
        const lifeRatio = p.life / p.maxLife;
        const sway = Math.sin(p.life * 0.001 + p.phase) * 0.3;
        p.x += p.vx + sway * 0.1 + mx * 0.3;
        p.y += p.vy + my * 0.15;

        if (p.y > height + 60 || p.life > p.maxLife) {
          Object.assign(p, spawn("ash", true));
          continue;
        }

        const alpha = Math.sin(Math.min(1, lifeRatio) * Math.PI) * 0.4;
        ctx.fillStyle = `rgba(201, 194, 182, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pass 2: embers (additive blend for glow stacking).
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.type !== "ember") continue;
        p.life += dt;
        const lifeRatio = p.life / p.maxLife;
        const sway = Math.sin(p.life * 0.0015 + p.phase) * 0.4;
        p.x += p.vx + sway * 0.1 + mx * 0.6;
        p.y += p.vy + my * 0.1;

        if (p.y < -60 || p.life > p.maxLife) {
          Object.assign(p, spawn("ember"));
          p.y = height + rand(0, 60);
          continue;
        }

        const flicker =
          0.6 + Math.sin(p.life * 0.02 + p.phase) * 0.3 + Math.random() * 0.1;
        const alpha = Math.sin(Math.min(1, lifeRatio) * Math.PI) * flicker;
        const r = p.size * 3;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(255, 200, 120, ${alpha})`);
        grad.addColorStop(0.4, `rgba(255, 122, 24, ${alpha * 0.6})`);
        grad.addColorStop(1, "rgba(194, 65, 12, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "fixed inset-0 w-full h-full pointer-events-none z-0",
        className
      )}
    />
  );
}

export default AshField;
