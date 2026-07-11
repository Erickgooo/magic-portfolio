"use client";

import { useEffect, useRef } from "react";
import styles from "./SpotlightBackground.module.scss";

interface SpotlightBackgroundProps {
  radius?: number;
  dotsColor?: string;
  dotsOpacity?: number;
  dotsSize?: string;
}

export function SpotlightBackground({
  radius = 100,
  dotsColor = "brand-background-strong",
  dotsOpacity = 40,
  dotsSize = "2px",
}: SpotlightBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
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
      className={styles.spotlightBackground}
      style={
        {
          "--dots-color": `var(--${dotsColor})`,
          "--dots-opacity": dotsOpacity / 100,
          "--dots-size": dotsSize,
          "--mask-radius": `${radius}vh`,
        } as React.CSSProperties
      }
    />
  );
}
