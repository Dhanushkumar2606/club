import { cn } from "@/lib/utils";

export function GridPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 bg-arch-grid", className)}
    />
  );
}

export function Scanlines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 bg-scanlines", className)}
    />
  );
}

export function NoiseField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 bg-noise", className)}
    />
  );
}

export function GlowField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background:
          "radial-gradient(60% 45% at 72% 18%, color-mix(in srgb, var(--energy) 22%, transparent), transparent 70%)",
      }}
    />
  );
}