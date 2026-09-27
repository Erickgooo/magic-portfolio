/** iPhone/iPod/iPad, including iPadOS which reports itself as a touch-capable Mac. */
export function isIOS(ua: string, platform: string, maxTouchPoints: number): boolean {
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return platform === "MacIntel" && maxTouchPoints > 1;
}
