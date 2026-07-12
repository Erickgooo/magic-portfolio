"use client";

import { useEffect, useRef } from "react";

interface AutoplayVideoProps {
  src: string;
  poster?: string;
  style?: React.CSSProperties;
}

export function AutoplayVideo({ src, poster, style }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play on mobile — necessary because browsers may block autoplay
    // even when `autoPlay`, `muted` and `playsInline` are set.
    const tryPlay = () => {
      video.muted = true; // ensure muted before play attempt
      video.play().catch(() => {
        // Silently ignore: browser policy blocked autoplay
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }

    // Also attempt play on first user interaction (fallback for strict policies)
    const handleInteraction = () => {
      if (video.paused) {
        tryPlay();
      }
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("touchstart", handleInteraction, { passive: true });
    document.addEventListener("click", handleInteraction);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      style={style}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
