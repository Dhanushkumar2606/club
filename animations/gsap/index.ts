import { gsap } from "@/lib/gsap";

export const easing = {
  standard: "power3.out",
  cinematic: "expo.out",
} as const;

export function sectionReveal(target: gsap.TweenTarget, options: gsap.TweenVars = {}) {
  return gsap.fromTo(
    target,
    { y: 32, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: easing.standard, ...options },
  );
}