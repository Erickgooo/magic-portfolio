const VIDEO = /\.(mp4|webm|mov|m4v)$/i;

/** "01 / 05" with a total, "03" without. Numbering always comes from data. */
export function formatIndex(n: number, total?: number): string {
  const pad = (x: number) => String(x).padStart(2, "0");
  return total ? `${pad(n)} / ${pad(total)}` : pad(n);
}

export function sortProjects<T extends { metadata: { publishedAt: string } }>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );
}

/** First still image of a project (case-study carousels may start with a video). */
export function coverImage(images: string[]): string | null {
  return images.find((src) => !VIDEO.test(src)) ?? null;
}

/** "value|label" → parts; null unless both are present. */
export function parseMetric(metric?: string): { value: string; label: string } | null {
  if (!metric) return null;
  const [value, label] = metric.split("|").map((s) => s.trim());
  return value && label ? { value, label } : null;
}
