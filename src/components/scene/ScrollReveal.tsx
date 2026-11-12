"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLocale } from "@/i18n/LocaleProvider";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  mode?: "scrub" | "enter";
  splitBy?: "words" | "chars";
  effect?: "fade" | "rise";
  baseOpacity?: number;
  baseOffset?: number;
  enableBlur?: boolean;
  blurStrength?: number;
  stagger?: number;
  smoothing?: number;
  highlightColor?: string;
  start?: string;
  end?: string;
  containerClassName?: string;
  textClassName?: string;
};

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function ScrollReveal({
  children,
  as = "h2",
  mode = "scrub",
  splitBy = "words",
  effect = "fade",
  baseOpacity = 0.1,
  baseOffset = 0,
  enableBlur = true,
  blurStrength = 4,
  stagger = 0.05,
  smoothing = 0.45,
  highlightColor = "",
  start = "top 55%",
  end = "bottom bottom",
  containerClassName = "",
  textClassName = "",
}: Props) {
  const containerRef = useRef<HTMLElement | null>(null);

  const { dir } = useLocale();

  const pieces = useMemo<ReactNode[]>(() => {
    const tokens = children.split(/(\s+)/);
    const latin = /[A-Za-z]/;
    const out: ReactNode[] = [];
    let i = 0;
    while (i < tokens.length) {
      const part = tokens[i];
      if (part.trim() === "") {
        out.push(part);
        i++;
        continue;
      }
      let text = part;
      let isLatin = false;
      if (dir === "rtl" && latin.test(part)) {
        isLatin = true;
        let j = i + 1;
        while (
          j + 1 < tokens.length &&
          tokens[j].trim() === "" &&
          latin.test(tokens[j + 1])
        ) {
          text += tokens[j] + tokens[j + 1];
          j += 2;
        }
        i = j;
      } else {
        i++;
      }
      out.push(
        <span
          className="scroll-reveal-word"
          key={out.length}
          dir={isLatin ? "ltr" : undefined}
        >
          {splitBy === "chars" && !isLatin
            ? Array.from(text).map((ch, k) => (
                <span className="scroll-reveal-piece" key={k}>
                  {ch}
                </span>
              ))
            : (
                <span className="scroll-reveal-piece">{text}</span>
              )}
        </span>,
      );
    }
    return out;
  }, [children, splitBy, dir]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const targets = Array.from(
      container.querySelectorAll<HTMLElement>(".scroll-reveal-piece"),
    );
    if (!targets.length) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const duration = 0.5;
      const step = Math.max(0, stagger);
      const total = duration + Math.max(0, targets.length - 1) * step;
      const state = { p: 0 };
      const last = targets.map(() => -1);
      const blur = enableBlur ? blurStrength : 0;

      const apply = () => {
        const elapsed = state.p * total;
        targets.forEach((el, i) => {
          const t = clamp((elapsed - i * step) / duration);
          if (t === last[i]) return;
          last[i] = t;
          const eased = effect === "rise" ? 1 - Math.pow(1 - t, 3) : t;
          el.style.opacity = String(baseOpacity + (1 - baseOpacity) * eased);
          el.style.transform =
            effect === "rise" && eased < 1
              ? `translateY(${((1 - eased) * baseOffset).toFixed(2)}px)`
              : "";
          el.style.filter =
            blur && eased < 1
              ? `blur(${(blur * (1 - eased)).toFixed(2)}px)`
              : "";
          if (highlightColor) {
            const h =
              t <= 0 || t >= 1
                ? 0
                : t < 0.35
                  ? smooth(t / 0.35)
                  : 1 - smooth((t - 0.35) / 0.65);
            el.style.color =
              h > 0.002
                ? `color-mix(in srgb, ${highlightColor} ${(100 * h).toFixed(1)}%, currentColor)`
                : "";
          }
        });
      };

      targets.forEach((el) => {
        el.style.willChange =
          targets.length > 80 ? "" : effect === "rise" ? "opacity, transform" : "opacity";
      });
      apply();

      const tween =
        mode === "enter"
          ? gsap.to(state, {
              p: 1,
              duration: total,
              ease: "none",
              onUpdate: apply,
              scrollTrigger: { trigger: container, start: "top 85%", once: true },
            })
          : gsap.to(state, {
              p: 1,
              ease: "none",
              onUpdate: apply,
              scrollTrigger: {
                trigger: container,
                start,
                end,
                scrub: smoothing > 0 ? smoothing : true,
                invalidateOnRefresh: true,
              },
            });

      const refresh = () => ScrollTrigger.refresh();
      const raf = window.requestAnimationFrame(refresh);
      document.fonts?.ready.then(refresh).catch(() => {});

      return () => {
        window.cancelAnimationFrame(raf);
        tween.scrollTrigger?.kill();
        tween.kill();
        targets.forEach((el) => {
          el.style.opacity = "";
          el.style.transform = "";
          el.style.filter = "";
          el.style.color = "";
          el.style.willChange = "";
        });
      };
    });

    return () => mm.revert();
  }, [
    children,
    mode,
    effect,
    baseOpacity,
    baseOffset,
    enableBlur,
    blurStrength,
    stagger,
    smoothing,
    highlightColor,
    start,
    end,
  ]);

  const Tag = as as "div";
  return (
    <Tag
      ref={containerRef as RefObject<HTMLDivElement>}
      className={`scroll-reveal ${containerClassName}`.trim()}
    >
      <span className={`scroll-reveal-text ${textClassName}`.trim()}>
        {pieces}
      </span>
    </Tag>
  );
}
