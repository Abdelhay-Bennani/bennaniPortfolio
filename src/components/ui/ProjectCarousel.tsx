"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselItem = {
  slug: string;
  name: string;
  url: string;
  image: string;
  category: string;
  description: string;
  tags: string[];
};

type Labels = { view: string; prev: string; next: string };

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function ProjectCarousel({
  items,
  labels,
}: {
  items: CarouselItem[];
  labels: Labels;
}) {
  const count = items.length;
  const step = 360 / count;
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const state = useRef({
    target: 0,
    current: 0,
    dragging: false,
    moved: 0,
    startX: 0,
    startTarget: 0,
    hover: false,
    radius: 460,
  });
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      const s = state.current;
      const delta = mod(index * step - s.target + 180, 360) - 180;
      s.target += delta;
    },
    [step],
  );

  const shift = useCallback(
    (dir: number) => {
      const s = state.current;
      s.target = Math.round(s.target / step) * step + dir * step;
    },
    [step],
  );

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const s = state.current;
    let raf = 0;
    let lastAuto = performance.now();

    const measure = () => {
      const width = window.innerWidth < 640 ? 200 : 250;
      s.radius = Math.round(
        (width / 2 + 14) / Math.tan(Math.PI / count),
      );
    };
    measure();
    window.addEventListener("resize", measure);

    const loop = (now: number) => {
      raf = window.requestAnimationFrame(loop);
      if (document.hidden) return;
      if (!reduced && !s.dragging && !s.hover && now - lastAuto > 4200) {
        lastAuto = now;
        s.target = Math.round(s.target / step) * step + step;
      }
      if (s.dragging || s.hover) lastAuto = now;

      s.current += (s.target - s.current) * 0.1;
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translateZ(${-s.radius}px) rotateY(${-s.current}deg)`;
      }
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        card.style.transform = `rotateY(${i * step}deg) translateZ(${s.radius}px)`;
        const diff = ((i * step - s.current) * Math.PI) / 180;
        const front = Math.max(0, Math.cos(diff));
        card.style.filter = `brightness(${(0.35 + 0.65 * front).toFixed(3)})`;
      });
      const idx = mod(Math.round(s.current / step), count);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [count, step]);

  const onPointerDown = (event: React.PointerEvent) => {
    const s = state.current;
    s.dragging = true;
    s.moved = 0;
    s.startX = event.clientX;
    s.startTarget = s.target;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    const dx = event.clientX - s.startX;
    s.moved = Math.max(s.moved, Math.abs(dx));
    s.target = s.startTarget - dx * 0.35;
  };
  const endDrag = () => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.target = Math.round(s.target / step) * step;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") shift(1);
    if (event.key === "ArrowLeft") shift(-1);
  };

  const current = items[active];

  return (
    <div
      className="select-none"
      onMouseEnter={() => (state.current.hover = true)}
      onMouseLeave={() => (state.current.hover = false)}
    >
      <div
        role="group"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative mx-auto h-[270px] w-full cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing sm:h-[320px]"
        style={{ perspective: "1500px" }}
      >
        <div
          ref={ringRef}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item, i) => (
            <div
              key={item.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => {
                const s = state.current;
                if (s.moved > 6) return;
                if (i === activeRef.current) {
                  window.open(item.url, "_blank", "noopener,noreferrer");
                } else {
                  goTo(i);
                }
              }}
              className="absolute start-1/2 top-1/2 -ms-[100px] -mt-[75px] h-[150px] w-[200px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 sm:-ms-[125px] sm:-mt-[95px] sm:h-[190px] sm:w-[250px]"
              style={{ backfaceVisibility: "visible" }}
              aria-label={item.name}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="250px"
                draggable={false}
                unoptimized={item.image.endsWith(".svg")}
                className={
                  item.image.endsWith(".svg") ||
                  item.image.includes("axilum")
                    ? "pointer-events-none object-contain p-6"
                    : "pointer-events-none object-cover object-top"
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label={labels.prev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-primary hover:text-primary rtl:rotate-180"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-[200px]">
            <h3 className="text-xl font-bold">{current.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {current.category}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground" dir="ltr">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label={labels.next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-primary hover:text-primary rtl:rotate-180"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {current.description}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {current.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
        <a
          href={current.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          {labels.view} <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}
