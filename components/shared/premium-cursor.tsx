"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/*
 * GLOBAL CUSTOM CURSOR — rebuilt from the ground up.
 *
 * ONE fixed-position layer that follows the real pointer coordinates
 * (clientX/clientY via pointermove) with short GSAP interpolation.
 *
 * Three archetypes share this single element:
 *   DEFAULT ○   dot + hairline ring (difference blend)
 *   LABEL       dark glass pill with micro text (VIEW / EXPLORE / GO)
 *   LINK    ↗   compact circle with an external-link arrow
 *
 * State comes from the hovered element (selectors + [data-cursor] override).
 * Position comes ONLY from pointer coordinates — never from layout.
 * Scrolling while a labeled state is active instantly reverts to DEFAULT,
 * so a labeled pill can never float over scrolled content.
 *
 * Desktop (hover + fine pointer) only · disabled under reduced motion ·
 * pointer-events: none · never affects layout or interactions.
 */

const POINTER_GATE = "(hover: hover) and (pointer: fine)";

type CursorTarget = { sel: string; label: string };

/* priority-ordered — first match wins */
const TARGETS: Array<{ sel: string; label: string }> = [
  { sel: "[data-cursor]", label: "" }, // explicit override
  { sel: 'a[target="_blank"]', label: "↗" },
  { sel: ".club-card", label: "EXPLORE" },
  { sel: ".team-photo", label: "VIEW" },
  { sel: ".archive-panel", label: "" }, // photographs are primary content — stay minimal ○
  { sel: '[role="button"]', label: "VIEW" },
  { sel: "button", label: "GO" },
  { sel: "a", label: "GO" },
];

const DATA_LABELS: Record<string, string> = {
  view: "VIEW",
  link: "↗",
  go: "GO",
  explore: "EXPLORE",
};

const IDLE = {
  width: 26,
  height: 26,
  backgroundColor: "rgba(243,239,231,0)",
  borderColor: "rgba(243,239,231,0.4)",
};

export function PremiumCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  /* fine-pointer gate, re-checked live (hybrid devices) */
  useEffect(() => {
    const mq = window.matchMedia(POINTER_GATE);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* hide the native cursor only while the custom one is active */
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, [enabled]);

  useGSAP(
    () => {
      if (!enabled) return;
      const scope = ref.current;
      if (!scope) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const ring = scope.querySelector<HTMLElement>(".pc-ring");
      const labelEl = scope.querySelector<HTMLElement>(".pc-label");
      const dot = scope.querySelector<HTMLElement>(".pc-dot");
      if (!ring || !labelEl || !dot) return;

      gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

      /* position — exclusively from pointer coordinates */
      const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power3.out" });

      let shown = false;
      let lastX = 0;
      let lastY = 0;

      const onPointerMove = (e: PointerEvent) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (!shown) {
          shown = true;
          gsap.to([ring, dot], { opacity: 1, duration: 0.25 });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      /* ---------- state machine ---------- */
      let currentLabel = "";

      const applyDefault = () => {
        currentLabel = "";
        gsap.to(ring, {
          ...IDLE,
          scale: 1,
          duration: 0.25,
          ease: "power3.out",
          onComplete: () => gsap.set(ring, { mixBlendMode: "difference" }),
        });
        gsap.to(labelEl, { opacity: 0, duration: 0.15 });
        gsap.to(dot, { opacity: 1, duration: 0.2 });
      };

      const applyLabeled = (text: string) => {
        const isLinkGlyph = text === "↗";
        currentLabel = text;
        gsap.set(ring, { mixBlendMode: "normal" });
        labelEl.textContent = text;
        gsap.to(ring, {
          width: isLinkGlyph ? 44 : 72,
          height: isLinkGlyph ? 44 : 30,
          backgroundColor: "rgba(11, 14, 20, 0.85)",
          borderColor: "color-mix(in srgb, var(--accent) 50%, transparent)",
          scale: 1,
          duration: 0.25,
          ease: "power3.out",
        });
        gsap.fromTo(
          labelEl,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" },
        );
        gsap.to(dot, { opacity: 0, duration: 0.15 });
      };

      const resolveLabel = (el: Element | null): string => {
        for (const t of TARGETS) {
          const hit = el?.closest(t.sel);
          if (!hit) continue;
          if (t.sel === "[data-cursor]") {
            const v = hit.getAttribute("data-cursor") || "";
            return DATA_LABELS[v] ?? (v === "none" ? "" : v);
          }
          return t.label;
        }
        return "";
      };

      const onPointerOver = (e: PointerEvent) => {
        const label = resolveLabel(e.target as Element);
        if (label === currentLabel) return; // same zone (bubbles from children)
        if (label.length > 0) applyLabeled(label);
        else applyDefault();
      };

      /* scrolling must never leave a stale labeled pill floating mid-page.
       * Immediate contract on wheel/scroll… */
      const revertOnScroll = () => {
        if (currentLabel !== "") applyDefault();
      };
      /* …then a settled re-evaluation at the REAL pointer coordinates decides
       * the truthful state (Chrome synthesizes boundary events late during
       * smooth scrolling, which previously resurrected stale labels). */
      let settleTimer: number | undefined;
      const reevaluateAfterScroll = () => {
        if (!shown || lastX === 0) return;
        clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          const el = document.elementFromPoint(lastX, lastY);
          const label = el ? resolveLabel(el) : "";
          if (label !== currentLabel) {
            if (label.length > 0) applyLabeled(label);
            else applyDefault();
          }
        }, 260);
      };
      window.addEventListener("scroll", revertOnScroll, { passive: true });
      window.addEventListener("wheel", revertOnScroll, { passive: true });
      window.addEventListener("scroll", reevaluateAfterScroll, { passive: true });

      const onPress = () => gsap.to(ring, { scale: 0.92, duration: 0.15 });
      const onRelease = () => gsap.to(ring, { scale: 1, duration: 0.25 });
      const onLeave = () => gsap.to([ring, dot], { opacity: 0, duration: 0.25 });
      const onEnter = () => {
        if (shown) gsap.to([ring, dot], { opacity: 1, duration: 0.25 });
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerover", onPointerOver, { passive: true });
      window.addEventListener("mousedown", onPress, { passive: true });
      window.addEventListener("mouseup", onRelease, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      document.documentElement.addEventListener("mouseenter", onEnter);

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerover", onPointerOver);
        window.removeEventListener("mousedown", onPress);
        window.removeEventListener("mouseup", onRelease);
        window.removeEventListener("scroll", revertOnScroll);
        window.removeEventListener("wheel", revertOnScroll);
        window.removeEventListener("scroll", reevaluateAfterScroll);
        clearTimeout(settleTimer);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        document.documentElement.removeEventListener("mouseenter", onEnter);
      };
    },
    { scope: ref, dependencies: [enabled] },
  );

  /* SSR renders nothing — pure client-side enhancement, exactly one instance */
  if (!enabled) return null;

  return (
    <div ref={ref} aria-hidden className="pc-root pointer-events-none fixed inset-0 z-[200]">
      <div
        className="pc-ring fixed left-0 top-0 flex items-center justify-center rounded-full border opacity-0 will-change-transform"
        style={{
          width: IDLE.width,
          height: IDLE.height,
          borderColor: IDLE.borderColor,
          mixBlendMode: "difference",
        }}
      >
        <span className="pc-label select-none font-mono text-[10px] tracking-[0.18em] text-ivory opacity-0">
          {""}
        </span>
      </div>
      <div
        className="pc-dot fixed left-0 top-0 h-[5px] w-[5px] rounded-full bg-ivory opacity-0 will-change-transform"
        style={{ mixBlendMode: "difference" }}
      />
    </div>
  );
}
