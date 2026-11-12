"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  size: number;
};

export default function NameCanvas({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const rtl = getComputedStyle(wrap).direction === "rtl";

    let particles: Particle[] = [];
    let w = 1;
    let h = 1;
    let dpr = 1;
    let raf = 0;
    let intro = reduced ? 1 : 0;
    let fill: string | CanvasGradient = "#d4af37";
    let running = true;
    const pointer = { x: -9999, y: -9999, down: false };

    const makeFill = () => {
      const style = getComputedStyle(document.documentElement);
      const light = style.getPropertyValue("--gold-light").trim() || "#f8e39b";
      const mid = style.getPropertyValue("--gold-mid").trim() || "#d4af37";
      const deep = style.getPropertyValue("--gold-deep").trim() || "#9a7410";
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, light);
      gradient.addColorStop(0.5, mid);
      gradient.addColorStop(1, deep);
      return gradient;
    };

    const sample = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      fill = makeFill();

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      if (!octx) return;

      const family = getComputedStyle(wrap).fontFamily;
      let size = h * 0.92;
      const font = (s: number) => `900 ${s}px ${family}`;
      octx.font = font(size);
      const width = octx.measureText(text).width;
      if (width > w) {
        size = size * (w / width) * 0.98;
        octx.font = font(size);
      }
      octx.fillStyle = "#000";
      octx.textBaseline = "middle";
      octx.textAlign = rtl ? "right" : "left";
      octx.fillText(text, rtl ? w : 0, h / 2);

      const data = octx.getImageData(0, 0, w, h).data;
      const step = Math.max(3, Math.round(size / 26));
      const next: Particle[] = [];
      let i = 0;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] < 128) continue;
          const old = particles[i];
          next.push({
            hx: x,
            hy: y,
            x: old ? old.x : reduced ? x : x + (Math.random() - 0.5) * w * 0.6,
            y: old ? old.y : reduced ? y : y + (Math.random() - 0.5) * h * 2,
            vx: 0,
            vy: 0,
            size: step * 0.74,
          });
          i++;
        }
      }
      particles = next;
    };

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = fill;
      intro = Math.min(1, intro + 0.012);
      const radius = 72;
      for (const p of particles) {
        p.vx += (p.hx - p.x) * 0.08;
        p.vy += (p.hy - p.y) * 0.08;
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < radius * radius) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / radius) * (pointer.down ? 16 : 6);
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.78;
        p.vy *= 0.78;
        p.x += p.vx;
        p.y += p.vy;
        const s = p.size * (0.6 + 0.4 * intro);
        ctx.globalAlpha = 0.35 + 0.65 * intro;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (!running) return;
      raf = window.requestAnimationFrame(loop);
      if (document.hidden) return;
      render();
    };

    const toLocal = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onMove = (event: PointerEvent) => toLocal(event);
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.down = false;
    };
    const onDown = (event: PointerEvent) => {
      toLocal(event);
      pointer.down = true;
      for (const p of particles) {
        const a = Math.random() * Math.PI * 2;
        const k = 6 + Math.random() * 14;
        p.vx += Math.cos(a) * k;
        p.vy += Math.sin(a) * k;
      }
    };
    const onUp = () => {
      pointer.down = false;
    };

    sample();
    if (reduced) {
      render();
    } else {
      loop();
      wrap.addEventListener("pointermove", onMove, { passive: true });
      wrap.addEventListener("pointerenter", onMove, { passive: true });
      wrap.addEventListener("pointerleave", onLeave);
      wrap.addEventListener("pointerdown", onDown);
      wrap.addEventListener("pointerup", onUp);
      wrap.addEventListener("pointercancel", onUp);
    }

    let resizeRaf = 0;
    const resizer = new ResizeObserver(() => {
      window.cancelAnimationFrame(resizeRaf);
      resizeRaf = window.requestAnimationFrame(() => {
        sample();
        if (reduced) render();
      });
    });
    resizer.observe(wrap);

    const themeObserver = new MutationObserver(() => {
      fill = makeFill();
      if (reduced) render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    document.fonts?.ready
      .then(() => {
        sample();
        if (reduced) render();
      })
      .catch(() => {});

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(resizeRaf);
      resizer.disconnect();
      themeObserver.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerenter", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
    };
  }, [text]);

  return (
    <div
      ref={wrapRef}
      className={`name-canvas ${className}`.trim()}
      role="img"
      aria-label={text}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
