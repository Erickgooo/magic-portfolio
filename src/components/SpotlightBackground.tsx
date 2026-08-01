"use client";

import { useEffect, useRef } from "react";
import styles from "./SpotlightBackground.module.scss";

interface SpotlightBackgroundProps {
  radius?: number;
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

// Manual de Marca, Sección 5.3: "Neural Grid" — puntos conectados por líneas
// finas en **Grafito**, no en el acento Cobalto (que la Sección 3.1 reserva
// explícitamente para CTAs/métricas y prohíbe como color de fondo extenso).
// Grafito no cambia entre temas, así que un solo color sirve para ambos.
const GRAFITO: [number, number, number] = [110, 118, 129];

// "radius" is a tight, literal spotlight in pixels — the pattern should stay
// mostly hidden until the cursor is actually near a given area.
export function SpotlightBackground({
  radius = 260,
  dotsOpacity = 18,
  dotsSize = "40px",
}: SpotlightBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<Node[]>([]);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spacing = Number.parseFloat(dotsSize) || 40;
    const baseOpacity = dotsOpacity / 100;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    const handleResize = () => {
      ({ cols } = buildGrid());
    };
    window.addEventListener("resize", handleResize);

    // Start off-screen so nothing is revealed until the cursor actually moves in.
    target.current = { x: -9999, y: -9999 };
    current.current = { ...target.current };
    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const [r, g, b] = GRAFITO;
      const nodes = nodesRef.current;
      const cx = current.current.x;
      const cy = current.current.y;

      const falloff = (x: number, y: number) => {
        const d = Math.hypot(x - cx, y - cy);
        return Math.max(0, 1 - d / radius);
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
          const lineAlpha = Math.min(alphaN, alphaNb) * baseOpacity * 0.7;
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
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduceMotion) {
      // static: no cursor tracking — reveal a fixed patch near the top so the
      // pattern still reads for reduced-motion users without chasing a cursor.
      current.current = { x: window.innerWidth / 2, y: 220 };
      draw();
    } else {
      const loop = () => {
        current.current.x += (target.current.x - current.current.x) * 0.15;
        current.current.y += (target.current.y - current.current.y) * 0.15;
        draw();
        frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [radius, dotsOpacity, dotsSize]);

  return <canvas ref={canvasRef} className={styles.spotlightBackground} />;
}
