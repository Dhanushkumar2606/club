"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-is-mobile";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const PARTICLE_COUNT = 32;
const PARTICLE_COUNT_MOBILE = 16;

function seeded(i: number, salt: number) {
  const v = Math.abs(Math.sin(i * 127.1 + salt * 311.7) * 43758.5453);
  return v - Math.floor(v);
}

const emptySubscribe = () => () => {};

export function ParticleField({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const mobile = useIsMobile();
  const reduce = usePrefersReducedMotion();
  const count = mobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
  if (!mounted) return null;
  if (reduce) return null;
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [contain:strict]",
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => {
        const s = seeded(i, 3);
        // size tiers: 70% tiny 1-2.2px, 20% medium 2.5-3.8px, 10% micro 0.7-1px
        const tier = seeded(i, 9);
        const size =
          tier < 0.7
            ? 1 + s * 1.2
            : tier < 0.9
              ? 2.5 + (s - 0.5) * 1.3
              : 0.7 + s * 0.35;
        const isAccent = seeded(i, 10) > 0.68; // ~32% theme-aware
        const isBlur = seeded(i, 11) > 0.9; // ~10% bokeh blur
        const isTwinkle = seeded(i, 12) > 0.85; // ~15% twinkle
        const style = {
          left: `${seeded(i, 1) * 100}%`,
          bottom: `${seeded(i, 2) * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${seeded(i, 4) * 8}s`,
          animationDuration: `${6 + seeded(i, 5) * 8}s`,
          "--particle-drift-x": `${(seeded(i, 6) - 0.5) * 60}px`,
          "--particle-drift-y": `${(seeded(i, 7) - 0.5) * 90}px`,
          "--particle-opacity": `${0.15 + seeded(i, 8) * 0.4}`,
        } as CSSProperties;
        return (
          <span
            key={i}
            className={cn(
              "particle absolute rounded-full",
              isAccent ? "bg-accent/60 shadow-[0_0_8px_color-mix(in_srgb,var(--accent)_55%,transparent)]" : "bg-argent/70",
              isBlur && "particle--blur",
              isTwinkle && "particle--twinkle",
            )}
            style={style}
          />
        );
      })}
    </div>
  );
}