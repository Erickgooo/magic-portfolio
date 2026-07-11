"use client";

import styles from "./YouTubeEmbed.module.scss";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  isVertical?: boolean;
}

export function YouTubeEmbed({ videoId, title, isVertical = true }: YouTubeEmbedProps) {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        style={!isVertical ? { maxWidth: "100%", aspectRatio: "16 / 9" } : {}}
      >
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
