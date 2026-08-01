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
// Hard backstop: whatever happens (a backgrounded tab throttling timers, a
// slow device, etc.), never let the overlay block the page longer than this.
const MAX_LIFETIME_MS = 4000;

const readAlreadySeen = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // sessionStorage unavailable (e.g. privacy mode) — treat as first visit
    return false;
  }
};

// This initializer also runs during SSR, where `document` doesn't exist.
const isTabHidden = () => typeof document !== "undefined" && document.hidden;

export const IntroLoader = () => {
  // Captured once at first render (a lazy initializer is only ever a *read*,
  // so it stays consistent even under React Strict Mode's dev double-render —
  // unlike a sessionStorage write, which must not happen here).
  // Skipping outright when the tab starts hidden also matters here: if the
  // page was opened in a background tab, there is no "catching up" on a
  // missed intro later without it feeling broken, so we just don't show it.
  const [shouldShow] = useState(() => !readAlreadySeen() && !isTabHidden());
  const [phase, setPhase] = useState<"pending" | "entering" | "leaving" | "done">(
    shouldShow ? "pending" : "done",
  );

  useEffect(() => {
    if (!shouldShow) return;

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const holdMs = reduceMotion ? 500 : HOLD_MS;
    const fadeMs = reduceMotion ? 150 : FADE_MS;

    // double rAF so the "entering" class change is picked up as a transition, not the initial state
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("entering")),
    );

    const leaveTimer = setTimeout(() => setPhase("leaving"), holdMs);
    const doneTimer = setTimeout(() => setPhase("done"), holdMs + fadeMs);

    // Background tabs throttle/pause rAF and setTimeout, so a tab switched
    // away from mid-intro can otherwise get stuck showing the overlay
    // (and, worse, blocking clicks on everything under it) for a long time.
    // The moment the tab is hidden, just skip straight to the end.
    const onVisibilityChange = () => {
      if (document.hidden) setPhase("done");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Absolute backstop independent of the above, in case of any other edge case.
    const maxTimer = setTimeout(() => setPhase("done"), MAX_LIFETIME_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      clearTimeout(maxTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
