"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { createScrollTrigger } from "@/animations/scroll";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = ref.current;
      if (!el) return;
      const tween = gsap.fromTo(
        el,
        { y, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", delay },
      );
      createScrollTrigger(el, tween);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}