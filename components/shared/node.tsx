import { cn } from "@/lib/utils";

export function FlowNode({
  code,
  label,
  className,
}: {
  code: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "corner-ticks flex h-16 w-16 flex-col items-center justify-center border border-accent/30 bg-forge-navy/40",
        className,
      )}
    >
      <span className="font-mono text-[0.625rem] tracking-[0.2em] text-accent">
        {code}
      </span>
      <span className="mono-label mt-1 text-ivory-dim/70">{label}</span>
    </div>
  );
}

export function ConnectionLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 2"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <line
        x1="0"
        y1="1"
        x2="600"
        y2="1"
        stroke="var(--accent)"
        strokeOpacity="0.35"
        strokeDasharray="6 8"
      />
      <circle cx="0" cy="1" r="2.5" fill="var(--accent)" />
      <circle cx="300" cy="1" r="2.5" fill="var(--accent)" opacity="0.6" />
      <circle cx="600" cy="1" r="2.5" fill="var(--accent)" />
    </svg>
  );
}