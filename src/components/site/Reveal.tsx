"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "left" | "right";

const HIDDEN_TRANSFORM: Record<Direction, string> = {
  up: "scale(0.86) translate(0, 26px)",
  left: "scale(0.92) translate(-64px, 0)",
  right: "scale(0.92) translate(64px, 0)",
};

export default function Reveal({
  children,
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  delay?: number;
  from?: Direction;
}) {
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
        transform: visible ? "scale(1) translate(0, 0)" : HIDDEN_TRANSFORM[from],
        transition: `opacity .6s cubic-bezier(.34,1.56,.64,1) ${delay}ms, transform .6s cubic-bezier(.34,1.56,.64,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
