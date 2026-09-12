"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.86) translateY(26px)",
        transition: `opacity .55s cubic-bezier(.34,1.56,.64,1) ${delay}ms, transform .55s cubic-bezier(.34,1.56,.64,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
