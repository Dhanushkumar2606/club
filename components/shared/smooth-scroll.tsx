"use client";

import { useEffect } from "react";
import { createLenis } from "@/lib/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsMobile } from "@/lib/use-is-mobile";

export function SmoothScroll() {
  const mobile = useIsMobile();

  useEffect(() => {
    const lenis = createLenis();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [mobile]);

  return null;
}