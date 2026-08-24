import { cn } from "@/lib/utils";

export type CodeToken = {
  text: string;
  tone?: "accent" | "dim" | "plain";
};

export function CodeFragment({
  title,
  lines,
  className,
}: {
  title: string;
  lines: CodeToken[][];
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "border border-accent/25 bg-forge-navy/40 font-mono text-xs",
        className,
      )}
    >
      <figcaption className="flex items-center justify-between border-b border-accent/20 px-4 py-2">
        <span className="mono-label text-accent">{title}</span>
        <span className="text-ivory-dim/50">{"// FRAGMENT"}</span>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 text-ivory/75">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="select-none text-ivory-dim/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              {line.map((token, j) => (
                <span
                  key={j}
                  className={
                    token.tone === "accent"
                      ? "text-accent"
                      : token.tone === "dim"
                        ? "text-ivory-dim"
                        : undefined
                  }
                >
                  {token.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </pre>
    </figure>
  );
}