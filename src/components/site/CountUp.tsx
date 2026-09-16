"use client";

import { useEffect, useState } from "react";

const DURATION_MS = 1400;

export default function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const match = value.match(/^([\d,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const suffix = match ? match[2] : "";

  const [display, setDisplay] = useState(target === null ? value : "0");

  useEffect(() => {
    if (target === null) return;

    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(target.toLocaleString());
      return;
    }

    let raf: number;
    const startTimer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * target).toLocaleString());
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [target, delay]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}
