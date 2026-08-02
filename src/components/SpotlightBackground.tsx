"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SpotlightBackground.module.scss";

interface SpotlightBackgroundProps {
  radius?: number;
  dotsColor?: string;
  dotsOpacity?: number;
  dotsSize?: string;
  glowRadius?: number;
  glowColor?: string;
}

// Plain CSS dot grid revealed through a cursor-following mask — deliberately
// simple (no canvas, no devicePixelRatio handling, no per-frame geometry) so
// it behaves the same on every device. A canvas rewrite of this (to draw
// connecting lines for a fuller "Neural Grid" look) caused repeated bugs,
// including a blank page on mobile, so this reverts to the proven approach
// and only changes color (Grafito, not the Cobalto accent — Manual de
// Marca Seccion 3.1 forbids using the accent as an extensive background)
// and radius (a real, tight spotlight instead of one covering the page).
// A separate glow layer (Cobalto, at the manual's own 15% alpha token)
// gives the cursor a soft light ring independent of the dot grid, since
// widening the dot spacing removed the incidental glow the denser grid
// used to produce.
export function SpotlightBackground({
  radius = 220,
  dotsColor = "scheme-neutral-500",
  dotsOpacity = 55,
  dotsSize = "24px",
  glowRadius = 260,
  glowColor = "scheme-brand-600-15",
}: SpotlightBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | undefined>(undefined);
  // Starts true so the first client render matches the server render (no
  // hydration mismatch); corrected right after mount. On a touch device
  // there's no cursor to follow, so --x/--y would just freeze wherever it
  // was initialized and sit there while the page scrolls underneath it,
  // reading as a stuck, overlapping artifact rather than a subtle texture.
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const isInteractive = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setInteractive(isInteractive);
    if (!isInteractive) return;

    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    current.current = { ...target.current };

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      if (containerRef.current) {
        containerRef.current.style.setProperty("--x", `${current.current.x}px`);
        containerRef.current.style.setProperty("--y", `${current.current.y}px`);
      }
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.spotlightWrapper}
      data-interactive={interactive}
      style={
        {
          "--dots-color": `var(--${dotsColor})`,
          "--dots-opacity": dotsOpacity / 100,
          "--dots-size": dotsSize,
          "--mask-radius": `${radius}px`,
          "--glow-radius": `${glowRadius}px`,
          "--glow-color": `var(--${glowColor})`,
        } as React.CSSProperties
      }
    >
      <div className={styles.dots} />
      <div className={styles.glow} />
    </div>
  );
}
