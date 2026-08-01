"use client";

import { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";

import { EMIcon } from "@/resources/EMIcon";
import styles from "./IntroLoader.module.scss";

const wordmarkFont = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

const SESSION_KEY = "em-intro-seen";
const HOLD_MS = 1600;
const FADE_MS = 500;

const readAlreadySeen = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // sessionStorage unavailable (e.g. privacy mode) — treat as first visit
    return false;
  }
};

export const IntroLoader = () => {
  // Captured once at first render (a lazy initializer is only ever a *read*,
  // so it stays consistent even under React Strict Mode's dev double-render —
  // unlike a sessionStorage write, which must not happen here).
  const [shouldShow] = useState(() => !readAlreadySeen());
  const [phase, setPhase] = useState<"pending" | "entering" | "leaving" | "done">(
    shouldShow ? "pending" : "done",
  );

  useEffect(() => {
    if (!shouldShow) return;

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // double rAF so the "entering" class change is picked up as a transition, not the initial state
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("entering")),
    );

    const holdMs = reduceMotion ? 500 : HOLD_MS;
    const fadeMs = reduceMotion ? 150 : FADE_MS;

    const leaveTimer = setTimeout(() => setPhase("leaving"), holdMs);
    const doneTimer = setTimeout(() => setPhase("done"), holdMs + fadeMs);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [shouldShow]);

  useEffect(() => {
    if (phase === "entering" || phase === "pending") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`${styles.overlay} ${phase === "leaving" ? styles.leaving : ""} ${
        phase === "entering" ? styles.entering : ""
      }`}
      aria-hidden="true"
    >
      <div className={styles.mark}>
        <span className={styles.icon}>
          <EMIcon />
        </span>
        <span className={`${styles.wordmark} ${wordmarkFont.className}`}>Erick Mahecha</span>
      </div>
    </div>
  );
};
