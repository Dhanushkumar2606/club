import { cn } from "@/lib/utils";

export type DiagnosticRow = {
  id: string;
  label: string;
  value?: string;
  status?: "OK" | "PENDING" | "ACTIVE";
};

export function ReadoutRow({ row }: { row: DiagnosticRow }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-ivory-dim/10 py-2 last:border-0">
      <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-ivory-dim">
        SYS/{row.id} — {row.label.toUpperCase()}
      </span>
      <span className="flex items-center gap-2 font-mono text-[0.6875rem]">
        {row.value && <span className="text-ivory/70">{row.value}</span>}
        <span
          className={
            row.status === "OK" || row.status === "ACTIVE"
              ? "text-accent"
              : "text-ivory-dim/60"
          }
        >
          {row.status ?? "—"}
        </span>
      </span>
    </li>
  );
}

export function DiagnosticsPanel({
  title,
  rows,
  className,
}: {
  title: string;
  rows: DiagnosticRow[];
  className?: string;
}) {
  return (
    <aside
      className={cn("border border-accent/25 bg-defense-navy/50 p-5", className)}
    >
      <header className="mb-3 flex items-center justify-between">
        <span className="mono-label text-accent">{title}</span>
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-accent/60"
            />
          ))}
        </span>
      </header>
      <ul>
        {rows.map((row) => (
          <ReadoutRow key={row.id} row={row} />
        ))}
      </ul>
    </aside>
  );
}