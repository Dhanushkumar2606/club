export type TransitionDirection = "up" | "down" | "left" | "right" | "fade";

export interface PageTransition {
  duration: number;
  ease: string;
  direction: TransitionDirection;
}

export const defaultTransition: PageTransition = {
  duration: 0.8,
  ease: "expo.out",
  direction: "fade",
};