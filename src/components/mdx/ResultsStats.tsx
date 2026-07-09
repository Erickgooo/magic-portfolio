"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./ResultsStats.module.scss";

interface Stat {
  value: string | number;
  label: string;
}

interface ResultsStatsProps {
  stats: Stat[];
  title?: string;
}

// Parse a value like "110K", "338K+", "2.3M", "629.7K", "390.6K" into its parts
function parseValue(raw: string | number): {
  prefix: string;
  numeric: number;
  suffix: string;
} {
  const str = String(raw);
  // Detect leading non-numeric prefix (rare, but safe)
  const prefixMatch = str.match(/^([^0-9]*)/);
  const prefix = prefixMatch ? prefixMatch[1] : "";
  const rest = str.slice(prefix.length);

  // Detect suffix: letters and/or + at the end
  const suffixMatch = rest.match(/([KkMmBb+%][^0-9]*)$/);
  const suffix = suffixMatch ? suffixMatch[1] : "";
  const numericStr = rest.slice(0, rest.length - suffix.length);
  const numeric = parseFloat(numericStr) || 0;

  return { prefix, numeric, suffix };
}

function formatAnimatedValue(
  current: number,
  target: number,
  suffix: string
): string {
  // Once we're at target show exact display with suffix
  if (current >= target) {
    // Format with commas if no K/M suffix (pure numbers like 2,411)
    if (!suffix.match(/[KkMmBb]/)) {
      return target.toLocaleString("en-US") + suffix;
    }
    // For K/M values, show decimal if original had one
    return target.toLocaleString("en-US") + suffix;
  }
  // During animation: whole numbers for large values
  const rounded = Math.floor(current);
  if (!suffix.match(/[KkMmBb]/)) {
    return rounded.toLocaleString("en-US");
  }
  return rounded.toLocaleString("en-US");
}

function AnimatedNumber({ value }: { value: string | number }) {
  const { prefix, numeric, suffix } = parseValue(value);
  const [displayed, setDisplayed] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    setDisplayed(0);
    setDone(false);
    const duration = 1300; // ms
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numeric;
      setDisplayed(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(numeric);
        setDone(true);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [numeric]);

  // Expose start via ref for parent to call
  return (
    <AnimatedNumberInner
      prefix={prefix}
      numeric={numeric}
      suffix={suffix}
      displayed={displayed}
      done={done}
      onStart={startAnimation}
    />
  );
}

interface AnimatedNumberInnerProps {
  prefix: string;
  numeric: number;
  suffix: string;
  displayed: number;
  done: boolean;
  onStart: () => void;
}

function AnimatedNumberInner({
  prefix,
  numeric,
  suffix,
  displayed,
  done,
  onStart,
}: AnimatedNumberInnerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onStart();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onStart]);

  const displayStr = done
    ? String(numeric % 1 !== 0
        ? numeric.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
        : numeric % 1000 === 0 || suffix.match(/[KkMmBb]/)
          ? numeric.toLocaleString("en-US")
          : numeric.toLocaleString("en-US"))
    : Math.floor(displayed).toLocaleString("en-US");

  return (
    <span ref={ref}>
      {prefix}
      {displayStr}
      {done ? suffix : ""}
    </span>
  );
}

export function ResultsStats({ stats, title }: ResultsStatsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 2;
    setHasOverflow(overflow);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
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
  }, [checkScroll]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  return (
    <div className={styles.root}>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.carouselWrapper}>
        {hasOverflow && (
          <button
            className={`${styles.arrow} ${styles.arrowLeft} ${!canScrollLeft ? styles.arrowDisabled : ""}`}
            onClick={() => scrollBy("left")}
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
              <div className={styles.statInner}>
                <div className={styles.value}>
                  <AnimatedNumber value={stat.value} />
                </div>
                <div className={styles.label}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        {hasOverflow && (
          <button
            className={`${styles.arrow} ${styles.arrowRight} ${!canScrollRight ? styles.arrowDisabled : ""}`}
            onClick={() => scrollBy("right")}
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
