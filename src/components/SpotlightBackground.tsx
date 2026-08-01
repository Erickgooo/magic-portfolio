"use client";

import { useEffect, useRef } from "react";
import styles from "./SpotlightBackground.module.scss";

interface SpotlightBackgroundProps {
  radius?: number;
  dotsColor?: string;
  dotsOpacity?: number;
  dotsSize?: string;
}

interface Node {
  x: number;
  y: number;
}

// A small seeded PRNG so node jitter is stable across re-renders/resizes
// without needing to store random offsets separately.
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

type RGB = [number, number, number];

// Custom properties are untyped strings — the browser returns whatever was
// authored (hex here, per src/resources/custom.css) rather than normalizing
// to rgb(), so this needs to parse hex explicitly instead of scanning for digits.
function parseColorToRgb(value: string): RGB | null {
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3
      ? hex.split("").map((c) => c + c).join("")
      : hex;
    const num = Number.parseInt(full, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const rgbMatch = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }
  return null;
}

function resolveColor(varName: string): RGB {
  if (typeof window === "undefined") return [45, 91, 255];
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`).trim();
  return parseColorToRgb(value) ?? [45, 91, 255];
}

// The same alpha reads as much bolder on a light background than on a dark
// one (less contrast headroom), so light theme gets a lower multiplier to
// land at a similar felt weight instead of looking like a heavy overlay.
function themeOpacityMultiplier(): number {
  if (typeof document === "undefined") return 1;
  return document.documentElement.getAttribute("data-theme") === "light" ? 0.45 : 1;
}

// "Neural Grid" — Manual de Marca, Sección 5.3: puntos conectados por líneas
// finas, evocando una red neuronal simplificada. Renderizado en canvas para
// poder dibujar las conexiones entre nodos cercanos, no solo los puntos.
export function SpotlightBackground({
  radius = 100,
  dotsColor = "brand-background-strong",
  dotsOpacity = 55,
  dotsSize = "40px",
}: SpotlightBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<Node[]>([]);
  const colorRef = useRef<RGB>([45, 91, 255]);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spacing = Number.parseFloat(dotsSize) || 40;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const opacityRef = { current: (dotsOpacity / 100) * themeOpacityMultiplier() };

    const buildGrid = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const jitter = spacing * 0.22;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const nodes: Node[] = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const seed = row * 9973 + col * 131;
          const jx = (seededRandom(seed) - 0.5) * 2 * jitter;
          const jy = (seededRandom(seed + 1) - 0.5) * 2 * jitter;
          nodes.push({ x: col * spacing + jx, y: row * spacing + jy });
        }
      }
      nodesRef.current = nodes;
      return { cols };
    };

    let { cols } = buildGrid();
    colorRef.current = resolveColor(dotsColor);

    const handleResize = () => {
      ({ cols } = buildGrid());
    };
    window.addEventListener("resize", handleResize);

    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    current.current = { ...target.current };
    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const maskRadius = (radius / 100) * window.innerHeight;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const [r, g, b] = colorRef.current;
      const baseOpacity = opacityRef.current;
      const nodes = nodesRef.current;
      const cx = current.current.x;
      const cy = current.current.y;

      const falloff = (x: number, y: number) => {
        const d = Math.hypot(x - cx, y - cy);
        return Math.max(0, 1 - d / maskRadius);
      };

      // connections to the right and below neighbor only — every pair is visited once
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const alphaN = falloff(n.x, n.y);
        if (alphaN <= 0.02) continue;

        const right = nodes[i + 1];
        const below = nodes[i + cols];
        for (const neighbor of [right, below]) {
          if (!neighbor) continue;
          const alphaNb = falloff(neighbor.x, neighbor.y);
          const lineAlpha = Math.min(alphaN, alphaNb) * baseOpacity * 0.65;
          if (lineAlpha <= 0.015) continue;
          ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(neighbor.x, neighbor.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        const alpha = falloff(n.x, n.y) * baseOpacity;
        if (alpha <= 0.02) continue;
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const themeObserver = new MutationObserver(() => {
      colorRef.current = resolveColor(dotsColor);
      opacityRef.current = (dotsOpacity / 100) * themeOpacityMultiplier();
      if (reduceMotion) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    if (reduceMotion) {
      // static: no cursor tracking, centered falloff so the pattern still reads
      current.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      draw();
    } else {
      const loop = () => {
        current.current.x += (target.current.x - current.current.x) * 0.08;
        current.current.y += (target.current.y - current.current.y) * 0.08;
        draw();
        frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      themeObserver.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [radius, dotsColor, dotsOpacity, dotsSize]);

  return <canvas ref={canvasRef} className={styles.spotlightBackground} />;
}
