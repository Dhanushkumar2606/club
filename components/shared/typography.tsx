import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Display({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h1 className={cn("type-display", className)}>{children}</h1>;
}

export function Heading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={cn("type-heading", className)}>{children}</h2>;
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-sans text-3xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("mono-label text-graphite", className)}>{children}</p>;
}