"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/i18n/LocaleProvider";
import { site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __portfolioLenis?: Lenis;
  }
}

type SceneHandle = {
  target: number;
  velocity: number;
  dispose: () => void;
};

type Variant = "home" | "about" | "contact";

function readAccent() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  return value || "#d4af37";
}

function readGold(): [string, string] {
  const style = getComputedStyle(document.documentElement);
  return [
    style.getPropertyValue("--gold-light").trim() || "#f8e39b",
    style.getPropertyValue("--gold-deep").trim() || "#9a7410",
  ];
}

function paintGradient(
  THREE: typeof import("three"),
  geometry: import("three").BufferGeometry,
  light: string,
  deep: string,
) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const position = geometry.attributes.position;
  if (!box || !position) return;
  const height = box.max.y - box.min.y || 1;
  const top = new THREE.Color(light);
  const bottom = new THREE.Color(deep);
  const tmp = new THREE.Color();
  const colors = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i++) {
    const t = (position.getY(i) - box.min.y) / height;
    tmp.copy(bottom).lerp(top, t);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

async function buildScene(
  canvas: HTMLCanvasElement,
  variant: Variant,
  isRtl: boolean,
): Promise<SceneHandle | null> {
  const THREE = await import("three");

  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl2", { alpha: true });
  } catch {
    gl = null;
  }
  if (!gl) {
    console.warn("WebGL2 is unavailable; the background 3D scene is disabled.");
    return null;
  }

  let renderer: InstanceType<typeof THREE.WebGLRenderer>;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 7;

  const root = new THREE.Group();
  scene.add(root);

  const accent = readAccent();
  const accentColor = new THREE.Color(accent);

  const geometry =
    variant === "about"
      ? new THREE.IcosahedronGeometry(1.75, 1)
      : variant === "contact"
        ? new THREE.TorusGeometry(1.45, 0.42, 36, 140)
        : new THREE.TorusKnotGeometry(1.15, 0.36, 240, 32);

  const [goldLight, goldDeep] = readGold();
  paintGradient(THREE, geometry, goldLight, goldDeep);

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    emissive: accentColor.clone().multiplyScalar(0.45),
    roughness: 0.3,
    metalness: 0.6,
    transparent: true,
    opacity: 0,
    flatShading: variant === "about",
  });
  const mesh = new THREE.Mesh(geometry, material);

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(goldLight),
    wireframe: true,
    transparent: true,
    opacity: 0,
  });
  const wire = new THREE.Mesh(geometry, wireMaterial);
  wire.scale.setScalar(1.025);

  const object = new THREE.Group();
  object.add(mesh, wire);
  object.rotation.set(0.35, -0.4, 0.1);
  root.add(object);

  const count = 720;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.6 + Math.random() * 5.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 2;
  }
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  const pointsMaterial = new THREE.PointsMaterial({
    color: accentColor,
    size: 0.035,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  root.add(points);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(accentColor, 3, 24);
  rim.position.set(-4, -2, 3);
  scene.add(rim);

  const state = {
    target: window.scrollY,
    current: window.scrollY,
    velocity: 0,
    pointerX: 0,
    pointerY: 0,
    px: 0,
    py: 0,
    fade: 0,
  };

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const offset = w >= 1280 ? 3.1 : w >= 1024 ? 2.4 : w >= 768 ? 1.6 : 0;
    object.position.x = isRtl ? -offset : offset;
  };
  resize();
  window.addEventListener("resize", resize);

  const onPointer = (event: PointerEvent) => {
    state.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    state.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const applyTheme = () => {
    const next = new THREE.Color(readAccent());
    const [light, deep] = readGold();
    paintGradient(THREE, geometry, light, deep);
    material.emissive.copy(next.clone().multiplyScalar(0.45));
    wireMaterial.color.set(light);
    pointsMaterial.color.copy(next);
    rim.color.copy(next);
  };
  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  let raf = 0;
  let last = performance.now();
  const loop = (now: number) => {
    raf = window.requestAnimationFrame(loop);
    if (document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    state.current += (state.target - state.current) * 0.08;
    state.px += (state.pointerX - state.px) * 0.05;
    state.py += (state.pointerY - state.py) * 0.05;
    state.fade = Math.min(1, state.fade + dt * 0.7);

    material.opacity = 0.92 * state.fade;
    wireMaterial.opacity = 0.2 * state.fade;
    pointsMaterial.opacity = 0.75 * state.fade;

    const s = state.current * 0.0011;
    object.rotation.y = -0.4 + s + now * 0.00012 + state.px * 0.25;
    object.rotation.x = 0.35 + s * 0.35 + state.py * 0.2;
    object.position.y = Math.sin(s * 0.9) * 0.55;

    const v = Math.min(Math.abs(state.velocity), 60) / 60;
    object.scale.setScalar(1 + v * 0.06);

    points.rotation.y = now * 0.00004 + s * 0.2;
    points.rotation.x = s * 0.1;

    renderer.render(scene, camera);
  };
  raf = window.requestAnimationFrame(loop);

  const handle: SceneHandle = {
    get target() {
      return state.target;
    },
    set target(value: number) {
      state.target = value;
    },
    get velocity() {
      return state.velocity;
    },
    set velocity(value: number) {
      state.velocity = value;
    },
    dispose: () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
    },
  };
  return handle;
}

export default function SmoothScrollScene({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { t, dir } = useLocale();
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let handle: SceneHandle | null = null;
    const timers: number[] = [];
    let idle: number | undefined;

    const step = (value: number) => {
      if (!cancelled) setProgress((p) => Math.max(p, value));
    };

    const frame = window.requestAnimationFrame(() => {
      setProgress(8);
      setLoading(true);
    });
    timers.push(window.setTimeout(() => step(34), 120));
    timers.push(window.setTimeout(() => step(68), 260));
    timers.push(
      window.setTimeout(() => {
        step(100);
        setLoading(false);
      }, 520),
    );

    const variant: Variant = pathname.includes("/about")
      ? "about"
      : pathname.includes("/contact")
        ? "contact"
        : "home";

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const startScene = async () => {
      if (cancelled || reducedMotion || isMobile || !canvasRef.current) return;
      const built = await buildScene(canvasRef.current, variant, dir === "rtl");
      if (cancelled) {
        built?.dispose();
        return;
      }
      handle = built;
      if (handle) handle.target = window.scrollY;
    };

    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(() => void startScene(), {
        timeout: 2500,
      });
    } else {
      timers.push(window.setTimeout(() => void startScene(), 1200));
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -100 },
    });
    window.__portfolioLenis = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    const onScroll = ({
      scroll,
      velocity,
      direction,
    }: {
      scroll: number;
      velocity: number;
      direction: number;
    }) => {
      const el = sceneRef.current;
      if (el) {
        el.style.setProperty("--scroll-y", `${scroll}px`);
        el.style.setProperty("--scroll-velocity", `${velocity}`);
        el.style.setProperty("--scroll-direction", `${direction}`);
      }
      if (handle) {
        handle.target = scroll;
        handle.velocity = velocity;
      }
      ScrollTrigger.update();
    };

    lenis.on("scroll", onScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      cancelled = true;
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (window.__portfolioLenis === lenis) delete window.__portfolioLenis;
      window.cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      if (idle !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle);
      }
      handle?.dispose();
      handle = null;
    };
  }, [pathname, dir]);

  return (
    <div className="smooth-scroll-root">
      <div
        className={`scene-loader${loading ? "" : " scene-loader--hidden"}`}
        aria-live="polite"
      >
        <div className="scene-loader__content">
          <div className="scene-loader__ring">
            <span className="scene-loader__halo" aria-hidden="true" />
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <linearGradient id="loader-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f8e39b" />
                  <stop offset="55%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#9a7410" />
                </linearGradient>
              </defs>
              <circle className="scene-loader__ring-track" cx="60" cy="60" r="54" />
              <circle
                className="scene-loader__ring-bar"
                cx="60"
                cy="60"
                r="54"
                pathLength={100}
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
              />
            </svg>
            <span className="scene-loader__orbit" aria-hidden="true">
              {["{ }", "</>", "01", ";"].map((glyph) => (
                <span key={glyph}>{glyph}</span>
              ))}
            </span>
            <span className="scene-loader__monogram">
              <span className="scene-loader__bracket">&lt;/</span>
              AB
              <span className="scene-loader__bracket">&gt;</span>
            </span>
          </div>
          <p className="scene-loader__name" aria-label={site.name}>
            {site.name.split("").map((char, index) => (
              <span
                key={index}
                aria-hidden="true"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                {char === " " ? " " : char}
              </span>
            ))}
          </p>
          <p className="scene-loader__text">
            <span className="scene-loader__prompt" aria-hidden="true">&gt;</span>
            {t.loader.text}
            <span className="scene-loader__caret" aria-hidden="true" />
          </p>
          <span className="scene-loader__percent">
            {String(Math.round(progress)).padStart(3, "0")}
          </span>
        </div>
      </div>
      <div ref={sceneRef} className="scroll-scene" aria-hidden="true">
        <canvas ref={canvasRef} className="scroll-scene__canvas" />
      </div>
      <div className="smooth-scroll-content">{children}</div>
    </div>
  );
}
