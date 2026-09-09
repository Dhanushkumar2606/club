"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const WORLDS = [
  { id: "cse", label: "CSE", name: "CSE — THE ORIGIN", href: "/" },
  { id: "ss", label: "SS", name: "SCRIPT SOLDIERS", href: "/script-soldiers" },
  { id: "ck", label: "CK", name: "CYBER KNIGHTS", href: "/cyber-knights" },
];

export function ClubSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const veilRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const busyRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    [],
  );

  const go = (href: string, name: string) => {
    if (busyRef.current || pathname === href) return;
    busyRef.current = true;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const veil = veilRef.current;
    const label = labelRef.current;
    if (!veil || !label) {
      router.push(href);
      return;
    }
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        busyRef.current = false;
      },
    });
    tlRef.current = tl;
    label.textContent = name;
    gsap.set(label, { autoAlpha: 0, y: 8 });
    tl.to(veil, { autoAlpha: 1, duration: reduce ? 0.12 : 0.3 })
      .to(
        label,
        { autoAlpha: 1, y: 0, duration: reduce ? 0.1 : 0.15 },
        "-=0.1",
      )
      .add(() => router.push(href), reduce ? "+=0.05" : "+=0.1")
      .to(veil, { autoAlpha: 0, duration: reduce ? 0.12 : 0.4 }, "+=0.3")
      .to(label, { autoAlpha: 0, duration: reduce ? 0.08 : 0.15 }, "<");
  };

  return (
    <>
      <nav
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2"
        aria-label="Switch club"
      >
        <div className="corner-ticks flex items-stretch border border-ivory-dim/25 bg-[#f4f2ec]/95 text-[#141414] backdrop-blur">
          {WORLDS.map((world) => {
            const active = pathname === world.href;
            return (
              <button
                key={world.id}
                type="button"
                onClick={() => go(world.href, world.name)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "mono-label px-4 py-2.5 transition-colors duration-200 hover:bg-[#141414]/10",
                  active &&
                    "bg-[#141414] text-[#f4f2ec] hover:bg-[#141414]",
                )}
              >
                {world.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div
        ref={veilRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#f4f2ec] opacity-0"
      >
        <p
          ref={labelRef}
          className="font-sans text-4xl font-semibold tracking-tight text-[#141414] sm:text-5xl"
        >
          CYBER KNIGHTS
        </p>
        <p className="mono-label text-[#141414]/50">CSE — WORLD SWITCH</p>
      </div>
    </>
  );
}