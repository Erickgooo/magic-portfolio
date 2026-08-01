"use client";

import { useEffect, useRef } from "react";
import { EMIcon } from "@/resources/EMIcon";

interface AutoplayVideoProps {
  src: string;
  poster?: string;
  style?: React.CSSProperties;
  watermark?: boolean;
}

export function AutoplayVideo({ src, poster, style, watermark = false }: AutoplayVideoProps) {
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
    <div style={{ position: "relative", width: style?.maxWidth ?? "100%" }}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        style={{ ...style, display: "block", width: "100%" }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {watermark && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "16px",
            bottom: "16px",
            fontSize: "22px",
            color: "#F4F5F7",
            opacity: 0.7,
            filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
            lineHeight: 0,
          }}
        >
          <EMIcon />
        </span>
      )}
    </div>
  );
}
