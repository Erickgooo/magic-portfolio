"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ResultsStats.module.scss";

interface Stat {
  value: string | number;
  label: string;
}

interface ResultsStatsProps {
  stats: Stat[];
  title?: string;
}

// Parse a value like "110K", "338K+", "2.3M", "629.7K", "2,411"
function parseValue(raw: string | number): {
  numericPart: number;
  suffix: string;
  displayRaw: string;
} {
  const str = String(raw).trim();

  // Try to match: optional digits/decimals, then optional K/M/B/+ suffix
  // Handles: "110K", "2.3M", "338K+", "390.6K", "2,411", "98", "1.5K"
  const match = str.match(/^([\d,\.]+)([KkMmBb+%]*)(.*)$/);
  if (!match) {
    return { numericPart: 0, suffix: "", displayRaw: str };
  }

  const rawNum = match[1].replace(/,/g, ""); // remove commas: "2,411" -> "2411"
  const numericPart = parseFloat(rawNum) || 0;
  const suffix = (match[2] + match[3]).trim(); // e.g. "K", "K+", "+", ""

  return { numericPart, suffix, displayRaw: str };
}

// Format a number with commas, no locale dependency — pure JS
function formatNumber(n: number): string {
  const floored = Math.floor(n);
  return floored.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format the final value with decimal support (e.g. 2.3 -> "2.3")
function formatFinal(numericPart: number): string {
  if (numericPart % 1 !== 0) {
    // has decimal — show one decimal place
    return numericPart.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return formatNumber(numericPart);
}

function AnimatedStat({ stat }: { stat: Stat }) {
  const { numericPart, suffix } = parseValue(stat.value);
  const [displayed, setDisplayed] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();
          runAnimation();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function runAnimation() {
    const duration = 1300;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numericPart;

      setDisplayed(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(numericPart);
        setDone(true);
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  const displayStr = done ? formatFinal(numericPart) : formatNumber(displayed);

  return (
    <div className={styles.statInner}>
      <div className={styles.value}>
        <span ref={spanRef} suppressHydrationWarning>
          {displayStr}
          {done ? suffix : ""}
        </span>
      </div>
      <div className={styles.label}>{stat.label}</div>
    </div>
  );
}

export function ResultsStats({ stats, title }: ResultsStatsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    function checkScroll() {
      const el = scrollRef.current;
      if (!el) return;
      const overflow = el.scrollWidth > el.clientWidth + 2;
      setHasOverflow(overflow);
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    }

    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, []);

  function scrollByDir(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  }

  return (
    <div className={styles.root}>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.carouselWrapper}>
        {hasOverflow && (
          <button
            className={`${styles.arrow} ${styles.arrowLeft} ${
              !canScrollLeft ? styles.arrowDisabled : ""
            }`}
            onClick={() => scrollByDir("left")}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            ‹
          </button>
        )}
        <div className={styles.track} ref={scrollRef}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.stat}>
              {i > 0 && <div className={styles.divider} />}
              <AnimatedStat stat={stat} />
            </div>
          ))}
        </div>
        {hasOverflow && (
          <button
            className={`${styles.arrow} ${styles.arrowRight} ${
              !canScrollRight ? styles.arrowDisabled : ""
            }`}
            onClick={() => scrollByDir("right")}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
