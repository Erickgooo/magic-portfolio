export function extractYouTubeId(src: string): string {
  if (src.includes("youtu.be/")) return src.split("youtu.be/")[1].split(/[?&#]/)[0];
  if (src.includes("shorts/")) return src.split("shorts/")[1].split(/[?&#]/)[0];
  if (src.includes("v=")) return src.split("v=")[1].split(/[&#]/)[0];
  return "";
}

/** Privacy-enhanced embed that starts playing as soon as it mounts (after a user click). */
export function youTubeEmbedUrl(videoId: string, opts: { mute?: boolean } = {}): string {
  const params = new URLSearchParams({ autoplay: "1", playsinline: "1", rel: "0" });
  if (opts.mute) params.set("mute", "1");
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params}`;
}

export function youTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}
