"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/*
 * MAGNETIC INTERACTIONS — PHASE 2.3
 * Important buttons drift subtly (5–12px) toward an approaching cursor and
 * ease back on release. Selector-driven: no edits to existing markup.
 * Desktop fine-pointer only; disabled under reduced motion.
 */

const POINTER_GATE = "(min-width: 768px) and (pointer: fine)";

type MagnetTarget = {
  el: Element;
  amp: number;
  xTo: gsap.QuickToFunc;
  yTo: gsap.QuickToFunc;
};

function scanTargets(): Array<{ el: Element; amp: number }> {
  const found: Array<{ el: Element; amp: number }> = [];
  const push = (el: Element | null | undefined, amp: number) => {
    if (el) found.push({ el, amp });
  };

  document
    .querySelectorAll('nav[aria-label="Switch club"] button')
    .forEach((el) => push(el, 6));
  document.querySelectorAll(".hero-nav a").forEach((el) => push(el, 6));

  /* finale socials — scoped to the finale section */
  const finale = [...document.querySelectorAll("section")].find((s) =>
    s.textContent.includes("FINAL TRANSMISSION"),
  );
  finale?.querySelectorAll('a[target="_blank"]').forEach((el) => push(el, 6));

  /* gateway ENTER chips only — text-anchored inside club cards */
  document.querySelectorAll(".club-card").forEach((card) => {
    const chip = [...card.querySelectorAll("span")].find((s) =>
      (s.textContent || "").trim().startsWith("ENTER"),
    );
    push(chip, 8);
  });

  return found;
}

export function MagneticInteractions() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(POINTER_GATE);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!enabled || reduce) return;

      let targets: MagnetTarget[] = [];
      const known = new Set<Element>();
      const tweens = new WeakMap<
        Element,
        { xTo: gsap.QuickToFunc; yTo: gsap.QuickToFunc }
      >();
      let dirty = true;

      const register = () => {
        targets = [];
        known.clear();
        for (const { el, amp } of scanTargets()) {
          if (known.has(el)) continue;
          known.add(el);
          let t = tweens.get(el);
          if (!t) {
            t = {
              xTo: gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" }),
              yTo: gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" }),
            };
            tweens.set(el, t);
          }
          targets.push({ el, amp, ...t });
        }
      };

      /* rescan when the DOM changes (modals, dynamic buttons) — debounced to rAF */
      let raf = 0;
      const mo = new MutationObserver(() => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          dirty = true;
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });

      const onMove = (e: MouseEvent) => {
        if (dirty) {
          dirty = false;
          register();
        }
        for (const t of targets) {
          const rect = t.el.getBoundingClientRect();
          if (!rect.width) continue;
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          const radius = Math.max(rect.width, rect.height) * 0.9 + 40;
          if (dist < radius) {
            const strength = (1 - dist / radius) ** 2;
            const pull = Math.min(strength * t.amp, dist);
            const nx = dist > 1 ? dx / dist : 0;
            const ny = dist > 1 ? dy / dist : 0;
            t.xTo(nx * pull);
            t.yTo(ny * pull);
          } else {
            t.xTo(0);
            t.yTo(0);
          }
        }
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        mo.disconnect();
        if (raf) cancelAnimationFrame(raf);
        for (const { el } of targets) {
          gsap.killTweensOf(el, "x,y");
          gsap.set(el, { x: 0, y: 0, clearProps: "transform" });
        }
        targets = [];
      };
    },
    { dependencies: [enabled, pathname] },
  );

  /* SSR renders nothing — pure client-side enhancement */
  if (!enabled) return null;
  return <div ref={ref} aria-hidden className="hidden" />;
}
