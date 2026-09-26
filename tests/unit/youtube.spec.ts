import { expect, test } from "@playwright/test";
import { isIOS } from "@/utils/platform";
import { extractYouTubeId, youTubeEmbedUrl, youTubeThumbnail } from "@/utils/youtube";

test("extractYouTubeId handles shorts, watch and youtu.be URLs", () => {
  expect(extractYouTubeId("https://youtube.com/shorts/BzDuYfJs3Oo")).toBe("BzDuYfJs3Oo");
  expect(extractYouTubeId("https://youtube.com/shorts/BzDuYfJs3Oo?feature=share")).toBe("BzDuYfJs3Oo");
  expect(extractYouTubeId("https://www.youtube.com/watch?v=abc123&t=4")).toBe("abc123");
  expect(extractYouTubeId("https://youtu.be/xyz789")).toBe("xyz789");
  expect(extractYouTubeId("https://example.com")).toBe("");
});

test("embed URL uses youtube-nocookie with autoplay and playsinline", () => {
  const url = new URL(youTubeEmbedUrl("BzDuYfJs3Oo"));
  expect(url.origin).toBe("https://www.youtube-nocookie.com");
  expect(url.pathname).toBe("/embed/BzDuYfJs3Oo");
  expect(url.searchParams.get("autoplay")).toBe("1");
  expect(url.searchParams.get("playsinline")).toBe("1");
  expect(url.searchParams.has("mute")).toBe(false);
  expect(new URL(youTubeEmbedUrl("x", { mute: true })).searchParams.get("mute")).toBe("1");
});

test("thumbnail comes from i.ytimg.com (allowed by the CSP)", () => {
  expect(youTubeThumbnail("abc")).toBe("https://i.ytimg.com/vi/abc/hqdefault.jpg");
});

test("isIOS detects iPhone and iPadOS-as-Mac, not desktop Mac", () => {
  expect(isIOS("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", "iPhone", 5)).toBe(true);
  expect(isIOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "MacIntel", 5)).toBe(true);
  expect(isIOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "MacIntel", 0)).toBe(false);
  expect(isIOS("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Win32", 0)).toBe(false);
});
