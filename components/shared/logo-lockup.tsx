import Image from "next/image";
import type { Club } from "@/data/types";
import { cn } from "@/lib/utils";

export function LogoLockup({
  club,
  size = 64,
  muted = false,
  className,
}: {
  club: Club;
  size?: number;
  muted?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-4", className)}>
      {club.logo && (
        <Image
          src={club.logo}
          alt={`${club.name} logo`}
          width={size * 2}
          height={size * 2}
          className={cn(
            "h-auto w-auto object-contain",
            muted &&
              "opacity-80 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0",
          )}
          style={{ width: size, height: size }}
          sizes={`${size}px`}
        />
      )}
      <span className="flex flex-col gap-1">
        <span className="font-mono text-xs tracking-[0.2em] text-ivory">
          {club.name.toUpperCase()}
        </span>
        <span className="font-mono text-[0.625rem] tracking-[0.2em] text-ivory-dim">
          SYS/{club.code}
        </span>
      </span>
    </span>
  );
}