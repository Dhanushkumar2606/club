import { ScrollTrigger } from "@/lib/gsap";

export const scrollDefaults = {
  start: "top 80%",
  toggleActions: "play none none reverse",
} as const;

export function createScrollTrigger(
  trigger: Element | string,
  animation: gsap.core.Tween | gsap.core.Timeline,
  options: Partial<ScrollTrigger.Vars> = {},
) {
  return ScrollTrigger.create({
    trigger,
    start: scrollDefaults.start,
    toggleActions: scrollDefaults.toggleActions,
    animation,
    ...options,
  });
}