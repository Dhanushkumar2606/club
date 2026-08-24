export function ShieldMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" fill="none" aria-hidden className={className}>
      <path
        d="M24 2 44 10v18c0 13-8.5 21.5-20 26C12.5 49.5 4 41 4 28V10L24 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent"
      />
      <path
        d="M24 10v36"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
        className="text-accent"
      />
      <path
        d="M10 16l28 10M10 22l28 10"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        className="text-accent"
      />
    </svg>
  );
}