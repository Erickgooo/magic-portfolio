"use client";

import styles from "./YouTubeEmbed.module.scss";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  isVertical?: boolean | string;
}

export function YouTubeEmbed({ videoId, title, isVertical = true }: YouTubeEmbedProps) {
  const isVert = isVertical === true || isVertical === "true" || isVertical === undefined;

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.container} ${!isVert ? styles.widescreen : ""}`}
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
