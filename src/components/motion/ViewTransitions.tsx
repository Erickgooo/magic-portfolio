"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { pickShared, shouldIntercept, vtNameForPath } from "./viewTransition";

const TIMEOUT_MS = 500;

type Pending = { pathname: string; resolve: () => void };

/**
 * Global click listener (capture phase) that wraps internal navigations in
 * document.startViewTransition. Chosen over Next's experimental viewTransition
 * flag, which switches the whole app to React's experimental channel (spec 6.4).
 *
 * - Resolves when the new pathname has rendered (effect on usePathname), with a
 *   500 ms safety timeout that also skips the animation.
 * - Back/forward (popstate) is left alone on purpose: Next handles it in its own
 *   startTransition, and iOS already animates the swipe-back gesture.
 * - Only the clicked element gets a view-transition-name, cleared when done.
 */
export function ViewTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<Pending | null>(null);

  useEffect(() => {
    const p = pending.current;
    if (p && p.pathname === pathname) {
      pending.current = null;
      p.resolve();
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof document.startViewTransition !== "function") return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const decision = shouldIntercept({
        button: event.button,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        defaultPrevented: event.defaultPrevented,
        href: anchor.getAttribute("href"),
        target: anchor.getAttribute("target"),
        download: anchor.hasAttribute("download"),
        current: {
          origin: location.origin,
          pathname: location.pathname,
          search: location.search,
        },
      });
      if (!decision) return;
      event.preventDefault();

      const name = vtNameForPath(decision.pathname);
      const shared = name ? pickShared(name) : null;
      if (shared && name) shared.style.viewTransitionName = name;
      document.documentElement.classList.add("vt-active");

      let timer = 0;
      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pending.current = { pathname: decision.pathname, resolve };
            router.push(decision.href);
            timer = window.setTimeout(() => {
              if (pending.current) {
                pending.current = null;
                resolve();
                transition.skipTransition();
              }
            }, TIMEOUT_MS);
          }),
      );
      transition.finished.finally(() => {
        window.clearTimeout(timer);
        if (shared) shared.style.viewTransitionName = "";
        document.documentElement.classList.remove("vt-active");
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
