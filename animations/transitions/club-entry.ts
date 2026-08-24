export const ENTRY = {
  pad: 48,
  finalLogoScale: 0.4,
  titleScale: 0.42,
  logoLockedSize: 96 * 0.4,
  centerScale: 2.2,
  travelEase: "expo.inOut",
  textEase: "power3.out",
} as const;

export type LockTargets = {
  dx: number;
  dy: number;
  tdx: number;
  tdy: number;
};

export function getLockTargets(
  logoRect: DOMRect,
  titleRect: DOMRect,
  lockedLogoSize: number,
): LockTargets {
  const dx = ENTRY.pad - logoRect.left;
  const dy = ENTRY.pad - logoRect.top;
  const finalTitleX = ENTRY.pad + lockedLogoSize + 24;
  const finalTitleY =
    ENTRY.pad + lockedLogoSize * 0.5 - titleRect.height * 0.5;
  return {
    dx,
    dy,
    tdx: finalTitleX - titleRect.left,
    tdy: finalTitleY - titleRect.top,
  };
}