"use client";

import { type ReactNode, useEffect, useRef } from "react";
import styles from "./GlowTrack.module.scss";

/**
 * The Glow Border (Manual §5.3.3) with a highlight that follows the pointer —
 * but only INSIDE the 1px ring: a static mask confines the moving highlight to
 * the border, which is the one place the manual allows light. The highlight
 * moves with transform only. Fine pointers only; touch shows the static ring.
 */
export function GlowTrack({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const spot = spotRef.current;
    if (!root || !spot || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      spot.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    root.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={rootRef} className={`${styles.track} ${className ?? ""}`}>
      {children}
      <span aria-hidden="true" className={styles.ring}>
        <span ref={spotRef} className={styles.spot} />
      </span>
    </div>
  );
}
