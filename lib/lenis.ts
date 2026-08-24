import Lenis from "lenis";

export const lenisDefaults = {
  lerp: 0.09,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
  smoothWheel: true,
  autoRaf: false,
} as const;

export function createLenis(options: Partial<ConstructorParameters<typeof Lenis>[0]> = {}) {
  return new Lenis({ ...lenisDefaults, ...options });
}

export type SmoothScroller = InstanceType<typeof Lenis>;