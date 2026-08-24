"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-is-mobile";

const PARTICLE_COUNT = 26;
const PARTICLE_COUNT_MOBILE = 12;

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
  const count = mobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
  if (!mounted) return null;
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => {
        const style = {
          left: `${seeded(i, 1) * 100}%`,
          bottom: `${seeded(i, 2) * 100}%`,
          width: `${1 + seeded(i, 3) * 2}px`,
          height: `${1 + seeded(i, 3) * 2}px`,
          animationDelay: `${seeded(i, 4) * 8}s`,
          animationDuration: `${6 + seeded(i, 5) * 8}s`,
          "--particle-drift-x": `${(seeded(i, 6) - 0.5) * 60}px`,
          "--particle-drift-y": `${(seeded(i, 7) - 0.5) * 90}px`,
          "--particle-opacity": `${0.15 + seeded(i, 8) * 0.4}`,
        } as CSSProperties;
        return (
          <span
            key={i}
            className="particle absolute rounded-full bg-argent/70"
            style={style}
          />
        );
      })}
    </div>
  );
}