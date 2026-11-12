"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type GsapCore from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type LenisType from "lenis";
import type { Channel } from "@/data/cv";

/* ---------------------------------------------------------------------------
   Rift geometry. One path of halftone dots: seven rings, dots swelling toward
   the lower left and thinning to nothing toward the upper right.
--------------------------------------------------------------------------- */
const DOTS = (() => {
  let d = "";
  for (let r = 60; r <= 98; r += 6.2) {
    const n = Math.round((2 * Math.PI * r) / 6.6);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r * 0.05;
      const radial = 1 - Math.abs(r - 78) / 24;
      const shade = 0.5 + 0.5 * Math.cos(a - 2.3);
      const s = 2.7 * Math.max(0, radial) * (0.25 + 0.75 * shade);
      if (s < 0.4) continue;
      const x = (Math.cos(a) * r).toFixed(2);
      const y = (Math.sin(a) * r).toFixed(2);
      const q = s.toFixed(2);
      d += `M${x} ${y}m-${q} 0a${q} ${q} 0 1 0 ${(s * 2).toFixed(2)} 0a${q} ${q} 0 1 0 -${(s * 2).toFixed(2)} 0`;
    }
  }
  return d;
})();

const TICKS = (() => {
  let d = "";
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r0 = i % 4 === 0 ? 100 : 104;
    const c = Math.cos(a);
    const s = Math.sin(a);
    d += `M${(c * r0).toFixed(2)} ${(s * r0).toFixed(2)}L${(c * 110).toFixed(2)} ${(s * 110).toFixed(2)}`;
  }
  return d;
})();

function RiftCore() {
  return (
    <>
      <circle r="47" fill="var(--ink-2)" />
      <path d={DOTS} fill="var(--peri)" />
      <circle r="70" fill="none" stroke="var(--icy)" strokeWidth="5" />
      <circle r="52" fill="none" stroke="var(--pink)" strokeWidth="1.6" strokeDasharray="2 5" />
      <circle r="3.4" fill="var(--pink)" />
    </>
  );
}

const SCENES = ["lobby", "profile", "shiftlog", "missions", "loadout", "exit"] as const;

// Tape-label spines that drift up the side gutters (never over the content
// column). [label, side, start (screens down), parallax rate, tone]
const TAGS: [string, "l" | "r", number, number, string][] = [
  ["Side A", "l", 0.2, 0.22, ""],
  ["SP 120", "r", 0.55, 0.5, "peri"],
  ["Tracking", "r", 1.1, 0.3, "icy"],
  ["Dub", "l", 1.35, 0.7, "peri"],
  ["No signal", "r", 0.05, 0.85, "ink"],
  ["Rew", "l", 0.8, 0.4, "ink"],
];

const ARROW = "M3 3 L3 27 L9.5 21 L14 31 L19.5 28.5 L15 19 L24 19 Z";
// pointing hand: fingertip at (14,1), drawn on a 32 grid
const HAND =
  "M11 4 Q11 1 14 1 Q17 1 17 4 V12 H19 Q20 11 22 11 Q24 11 24 13 Q25.5 12 27 12.5 Q29.5 13 29.5 16 V24 Q29.5 29 24 29 H15 Q11 29 8 25 L3.5 18.5 Q2.5 16.5 4.5 15.5 Q6.5 14.5 8 16.5 L11 20 Z";

type Props = { channels: Channel[] };

const readPause = () => document.documentElement.classList.contains("fx-paused");
const subscribePause = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};

export default function RiftStage({ channels }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const crtRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  /* ---- PAUSE FX: stops every looping effect. The html class is set before
         first paint by the layout script (stored choice, else reduced motion)
         and is the single source of truth. ---------------------------------- */
  const paused = useSyncExternalStore(subscribePause, readPause, () => false);
  const togglePause = () => {
    const next = !paused;
    document.documentElement.classList.toggle("fx-paused", next);
    try {
      localStorage.setItem("fx-paused", next ? "1" : "0");
    } catch {
      /* private mode or blocked storage: the toggle still works for this visit */
    }
  };

  /* ---- HUD chrome: channel n/6, fake timecode, scroll percent.
         Runs in every mode; it reads the page, it does not move it. ------ */
  useEffect(() => {
    const hud = hudRef.current!;
    const q = (k: string) => hud.querySelector<HTMLElement>(`[data-hud="${k}"]`)!;
    const chEl = q("ch");
    const pctEl = q("pct");
    const tcEl = q("tc");
    const ffEl = q("ff");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = SCENES.map((id) => document.querySelector<HTMLElement>(`[data-scene="${id}"]`));
    // Layout is read only when it changes, never inside the readout loop.
    let tops: number[] = [];
    let maxScroll = 1;
    const measure = () => {
      tops = scenes.map((s) => (s ? s.getBoundingClientRect().top + window.scrollY : Infinity));
      maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const pad = (n: number) => String(n).padStart(2, "0");
    const t0 = performance.now();
    const last = { ch: "", pct: "", tc: "", ff: "" };
    let raf = 0;
    let timer = 0;
    let prev = 0;

    const paint = (now: number) => {
      if (now - prev < 33) return; // 30 readouts a second is the whole point of a timecode
      prev = now;
      const pct = String(Math.round(Math.min(1, Math.max(0, scrollY / maxScroll)) * 100)).padStart(3, "0");
      let idx = 0;
      const line = scrollY + innerHeight * 0.55;
      tops.forEach((t, i) => {
        if (t < line) idx = i;
      });
      const ch = pad(idx + 1);
      const sec = Math.floor((now - t0) / 1000);
      const tc = `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec / 60) % 60)}:${pad(sec % 60)}`;
      const still = reduce || document.documentElement.classList.contains("fx-paused");
      const ff = still ? ":00" : `:${pad(Math.floor(((now - t0) % 1000) / (1000 / 30)))}`;
      if (ch !== last.ch) {
        // keep the deck's "now playing" in step even when the motion layer is off
        const i = idx;
        document
          .querySelectorAll<HTMLElement>("[data-ch-link]")
          .forEach((l, n) => l.setAttribute("aria-current", n === i ? "true" : "false"));
        document.querySelector("[data-now-num]")?.replaceChildren(ch);
        const title = document.querySelector("[data-now-name]");
        if (title) title.textContent = channels[i].title;
      }
      if (ch !== last.ch) chEl.textContent = last.ch = ch;
      if (pct !== last.pct) pctEl.textContent = last.pct = pct;
      if (tc !== last.tc) tcEl.textContent = last.tc = tc;
      if (ff !== last.ff) ffEl.textContent = last.ff = ff;
    };
    const loop = (now: number) => {
      paint(now);
      raf = requestAnimationFrame(loop);
    };
    if (reduce) {
      // reduced motion: a quiet readout, once a second and on scroll, no frame digits
      const tickOnce = () => paint(performance.now() + 40);
      tickOnce();
      timer = window.setInterval(tickOnce, 1000);
      window.addEventListener("scroll", tickOnce, { passive: true });
      return () => {
        ro.disconnect();
        clearInterval(timer);
        window.removeEventListener("scroll", tickOnce);
      };
    }
    raf = requestAnimationFrame(loop);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [channels]);

  /* ---- cursor: chunky arrow, pointing hand on links. Fine pointers only. -- */
  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    const el = cursorRef.current!;
    const root = document.documentElement;
    const LINK = 'a[href], button, summary, [role="button"], label, [data-ch-link]';
    let x = 0;
    let y = 0;
    let raf = 0;
    const draw = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(draw);
      el.classList.add("is-on");
      el.classList.toggle("is-link", !!(e.target as Element | null)?.closest?.(LINK));
    };
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");
    const out = (e: MouseEvent) => {
      if (!e.relatedTarget) el.classList.remove("is-on");
    };
    const on = () => {
      root.classList.add("has-cursor");
      document.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerdown", down);
      document.addEventListener("pointerup", up);
      document.addEventListener("mouseout", out);
    };
    const off = () => {
      root.classList.remove("has-cursor");
      el.classList.remove("is-on");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("mouseout", out);
    };
    const sync = () => (mq.matches ? on() : off());
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      off();
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion")) return; // static layout: nothing to drive

    // The motion libraries load after hydration so they stay out of the
    // first paint's critical path; the page is complete without them.
    let alive = true;
    let stop: (() => void) | undefined;
    const boot = () =>
      Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]).then(
        ([g, st, l]) => {
          if (alive) stop = run(g.default, st.ScrollTrigger, l.default);
        },
      );
    // Fetch them once the page has loaded, so they never compete with first paint.
    const later = () => window.setTimeout(boot, 0);
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => {
      alive = false;
      window.removeEventListener("load", later);
      stop?.();
    };

    function run(
      gsap: typeof GsapCore,
      ScrollTrigger: typeof ScrollTriggerType,
      Lenis: typeof LenisType,
    ) {
      gsap.registerPlugin(ScrollTrigger);
      const $ = <T extends Element>(sel: string, scope: ParentNode = document) =>
        scope.querySelector(sel) as T;
      const st = stage.current!;
      const fx = staticRef.current!;

      /* ---- smooth scroll, on GSAP's clock ------------------------------- */
      const lenis = new Lenis({ lerp: 0.12, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      /* ---- channel-change static ---------------------------------------- */
      const cv = document.createElement("canvas");
      cv.width = cv.height = 128;
      const cx = cv.getContext("2d");
      if (cx) {
        const img = cx.createImageData(128, 128);
        for (let i = 0; i < img.data.length; i += 4) {
          const v = 40 + Math.random() * 200;
          img.data[i] = v;
          img.data[i + 1] = v;
          img.data[i + 2] = v + 14;
          img.data[i + 3] = 255;
        }
        cx.putImageData(img, 0, 0);
        const url = `url(${cv.toDataURL()})`;
        fx.style.setProperty("--noise", url);
        crtRef.current?.style.setProperty("--noise", url);
      }
      const noise = $<HTMLElement>(".static-noise", fx);
      const colorBars = $<HTMLElement>(".static-bars", fx);
      const bars = fx.querySelectorAll<HTMLElement>(".static-bar");
      const osd = $<HTMLElement>(".static-osd", fx);
      const osdNum = $<HTMLElement>("[data-osd-num]", fx);
      const osdName = $<HTMLElement>("[data-osd-name]", fx);
      const links = document.querySelectorAll<HTMLElement>("[data-ch-link]");
      const nowNum = document.querySelector<HTMLElement>("[data-now-num]");
      const nowName = document.querySelector<HTMLElement>("[data-now-name]");

      // One burst, 260ms end to end, mid-grey noise at partial opacity: a channel
      // flick, not a strobe.
      const burst = gsap
        .timeline({ paused: true })
        // colour-bar flash: one hard frame (~90ms) at partial opacity
        .set(colorBars, { opacity: 0.5 }, 0)
        .set(colorBars, { opacity: 0 }, 0.09)
        .set(noise, { opacity: 0.5, x: 0, y: 0 }, 0)
        .to(noise, { x: 90, y: -70, duration: 0.2, ease: "steps(5)" }, 0)
        .set(bars[0], { opacity: 0.85, yPercent: 0, y: "12vh" }, 0)
        .to(bars[0], { y: "86vh", duration: 0.22, ease: "steps(4)" }, 0)
        .set(bars[1], { opacity: 0.9, y: "70vh" }, 0.04)
        .to(bars[1], { y: "18vh", duration: 0.18, ease: "steps(3)" }, 0.04)
        .set(osd, { opacity: 1, x: 14 }, 0)
        .to(osd, { x: 0, duration: 0.12, ease: "steps(2)" }, 0)
        .set([noise, bars[0], bars[1]], { opacity: 0 }, 0.26)
        .to(osd, { opacity: 0, duration: 0.3, ease: "power1.out" }, 0.75);

      // Rate cap: at most 2 channel changes a second, however fast the page is flung.
      const MIN_GAP = 500;
      let lastBurst = -MIN_GAP;
      let current = -1;
      const tune = (i: number) => {
        if (i === current) return;
        const first = current === -1;
        current = i;
        const c = channels[i];
        osdNum.textContent = c.ch;
        osdName.textContent = c.title;
        if (nowNum) nowNum.textContent = c.ch;
        if (nowName) nowName.textContent = c.title;
        links.forEach((a, n) => a.setAttribute("aria-current", n === i ? "true" : "false"));
        const now = performance.now();
        if (!first && now - lastBurst >= MIN_GAP) {
          lastBurst = now;
          burst.restart();
        }
      };

      /* ---- fast-scroll layers, read off Lenis' velocity every frame ------- */
      const fxSpeedEl = $<HTMLElement>(".fx-speed", st);
      const speedTo = gsap.quickTo(fxSpeedEl, "opacity", { duration: 0.28, ease: "power2.out" });
      const tagEls = gsap.utils.toArray<HTMLElement>(".stage-tags [data-speed]", st);
      const tagFx = tagEls.map((el) => ({
        y: gsap.quickSetter(el, "y", "px") as (v: number) => void,
        base: parseFloat(el.dataset.base || "0"),
        k: parseFloat(el.dataset.speed || "0.3"),
      }));
      let speedNow = 0;
      const isPaused = () => root.classList.contains("fx-paused");
      const layers = () => {
        const v = isPaused() ? 0 : Math.abs(lenis.velocity);
        // subtle: lines appear past a brisk scroll and never exceed 20% opacity
        const target = v > 24 ? Math.min(0.2, ((v - 24) / 70) * 0.2) : 0;
        const rounded = Math.round(target * 50) / 50;
        if (rounded !== speedNow) {
          if (speedNow === 0) gsap.set(fxSpeedEl, { rotation: gsap.utils.random(-12, 12) });
          speedNow = rounded;
          speedTo(rounded);
        }
        if (isPaused()) return; // tape labels hold still while FX are paused
        // tape labels: wrap around the screen at their own rates
        const H = innerHeight + 240;
        const sy = window.scrollY;
        tagFx.forEach((t) => t.y(((((t.base * innerHeight - sy * t.k + 120) % H) + H) % H) - 120));
      };
      gsap.ticker.add(layers);

      /* ---- ring glitch: one short burst roughly every 6s ------------------ */
      const gA = $<SVGGElement>(".rift-glitch--a", st);
      const gB = $<SVGGElement>(".rift-glitch--b", st);
      const glitch = gsap
        .timeline({ paused: true })
        .set(gA, { opacity: 0.9, x: -11 }, 0)
        .set(gB, { opacity: 0.9, x: 13 }, 0.03)
        .set(gA, { x: 7 }, 0.06)
        .set([gA, gB], { opacity: 0, x: 0 }, 0.12);
      let glitchTimer = 0;
      const scheduleGlitch = () => {
        glitchTimer = window.setTimeout(() => {
          // skip if paused, hidden, or a channel burst just flashed (keeps flashes well under 3/s)
          if (!isPaused() && !document.hidden && performance.now() - lastBurst > 1000) glitch.restart();
          scheduleGlitch();
        }, 5200 + Math.random() * 1600);
      };
      scheduleGlitch();

      /* ---- content entrances: fire once, never rebuilt ------------------- */
      const FROM: Record<string, gsap.TweenVars> = {
        rise: { y: 28, opacity: 0 },
        slam: { x: -28, scale: 1.18, skewX: -22, opacity: 0, transformOrigin: "0% 100%" },
        panel: { y: 70, x: 34, rotation: 6, opacity: 0 },
        sticker: { scale: 1.32, rotation: -7, y: -34, opacity: 0 },
        // a tape case tipping up off the shelf: hinged at the bottom edge
        tape: { rotationX: -78, y: 36, opacity: 0, transformPerspective: 900, transformOrigin: "50% 100%" },
        slot: { scale: 0.84, opacity: 0 },
      };
      const TO: Record<string, gsap.TweenVars> = {
        rise: { duration: 0.5, ease: "expo.out", stagger: 0.07 },
        slam: { duration: 0.34, ease: "expo.out", stagger: 0.07 },
        panel: { duration: 0.5, ease: "expo.out", stagger: 0.09 },
        sticker: { duration: 0.38, ease: "back.out(2.1)", stagger: 0.08 },
        tape: { duration: 0.45, ease: "expo.out", stagger: 0.07 },
        slot: { duration: 0.26, ease: "back.out(3)", stagger: 0.035 },
      };
      const entrances = gsap.context(() => {
        Object.keys(FROM).forEach((kind) => {
          const els = gsap.utils
            .toArray<HTMLElement>(`[data-enter="${kind}"]`)
            .filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
          if (!els.length) return;
          gsap.set(els, FROM[kind]);
          if (kind === "slam") els.forEach((e) => e.classList.add("pre-slam"));
          ScrollTrigger.batch(els, {
            start: "top 88%",
            once: true,
            onEnter: (batch) => {
              // the hard shadow (a transformed pseudo-element) slides out as it lands
              if (kind === "slam") batch.forEach((e) => e.classList.remove("pre-slam"));
              gsap.to(batch, {
                x: 0,
                y: 0,
                scale: 1,
                skewX: 0,
                rotationX: 0,
                rotation: 0,
                opacity: 1,
                overwrite: true,
                clearProps: "transform",
                ...TO[kind],
              });
            },
          });
        });
        SCENES.forEach((id, i) => {
          ScrollTrigger.create({
            trigger: `[data-scene="${id}"]`,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && tune(i),
          });
        });
      });
      if (current === -1) tune(0);

      /* ---- THE MASTER TIMELINE ------------------------------------------ */
      const rift = $<HTMLElement>(".rift", st);
      const ring = $<HTMLElement>(".rift-ring", st);
      const slash = $<HTMLElement>(".rift-slash", st);
      const ticks = $<HTMLElement>(".rift-ticks", st);
      const frame = $<HTMLElement>(".rift-frame", st);
      const orbit = $<HTMLElement>(".rift-orbit", st);
      const arrow = $<HTMLElement>(".arrow", st);
      const wipe = $<HTMLElement>(".stage-wipe", st);
      const hud = hudRef.current!;
      const tint = $<HTMLElement>(".stage-tint", st);
      const htA = $<HTMLElement>(".stage-ht--a", st);
      const htB = $<HTMLElement>(".stage-ht--b", st);
      const speed = $<HTMLElement>(".stage-speed", st);

      let master: gsap.Context | null = null;

      const build = () => {
        master?.revert();
        master = gsap.context(() => {
          const vw = innerWidth;
          const vh = innerHeight;
          const m = vw < 820; // phone + small tablet: the rift lives behind the copy
          const max = Math.max(1, ScrollTrigger.maxScroll(window));
          const secs = SCENES.map((id) => $<HTMLElement>(`[data-scene="${id}"]`));
          const tops = secs.map((s) => s.getBoundingClientRect().top + window.scrollY);
          const clamp = gsap.utils.clamp(0, max);
          // scene i is "arriving" while its top travels from 85% to 18% of the screen
          const span = (i: number) => {
            const a = clamp(tops[i] - vh * 0.85);
            const b = clamp(tops[i] - vh * 0.18);
            return { a, d: Math.max(1, b - a), b: Math.max(a + 1, b) };
          };
          const [, P, S, M, L, X] = SCENES.map((_, i) => span(i));

          // time on this timeline === scroll position in px
          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: { start: 0, end: "max", scrub: true },
          });

          // where the rift sits in each scene, as fractions of the screen
          const at = m
            ? {
                lobby: { x: 0, y: -0.04, s: 1.55, o: 1 },
                profile: { x: 0.34, y: -0.06, s: 1.35, o: 0.3 },
                shift: { x: -0.5, y: 0.02, s: 1.7, o: 0.5 },
                bug: { x: 0.3, y: -0.3, s: 0.34, o: 0.9 },
                loadout: { x: 0.36, y: 0.12, s: 1.3, o: 0.32 },
                exit: { x: 0, y: -0.12, s: 0.2, o: 0 },
              }
            : {
                lobby: { x: 0, y: 0.02, s: 1.6, o: 1 },
                profile: { x: -0.25, y: 0.03, s: 1, o: 1 },
                shift: { x: -0.5, y: 0.04, s: 2.05, o: 1 },
                bug: { x: 0.4, y: -0.27, s: 0.4, o: 1 },
                loadout: { x: 0.25, y: 0.03, s: 0.92, o: 1 },
                exit: { x: -0.25, y: 0.02, s: 0.2, o: 0 },
              };
          const pos = (k: keyof typeof at) => ({
            x: at[k].x * vw,
            y: at[k].y * vh,
            scale: at[k].s,
            opacity: at[k].o,
          });

          gsap.set(rift, pos("lobby"));
          gsap.set(arrow, {
            x: at.exit.x * vw,
            y: at.exit.y * vh,
            rotation: m ? 90 : 0,
            scale: 0.3,
            opacity: 0,
          });

          /* CH.02 PROFILE: slide aside, lock into a framed viewport */
          tl.to(rift, { ...pos("profile"), duration: P.d }, P.a)
            .to(ring, { rotation: -120, duration: P.d }, P.a)
            .fromTo(
              frame,
              { opacity: 0, scale: 1.25 },
              { opacity: 1, scale: 1, duration: P.d * 0.45, ease: "power3.out" },
              P.a + P.d * 0.55,
            )
            ;

          /* CH.03 SHIFT LOG: half off the left edge, rolling like a reel */
          tl.to(frame, { opacity: 0, scale: 0.9, duration: S.d * 0.35, ease: "power2.in" }, S.a)
            .to(rift, { ...pos("shift"), duration: S.d }, S.a)
            .to(ticks, { opacity: 1, duration: S.d * 0.5 }, S.a + S.d * 0.5);
          const roll = Math.max(1, M.a - S.b);
          tl.to(ring, { rotation: -120 - (roll / vh) * 150, duration: roll, ease: "none" }, S.b);

          /* CH.04 MISSIONS: to the centre, blow open into a full-screen wipe,
             then shrink into a channel bug in the corner */
          tl.to(rift, { x: 0, y: 0, scale: m ? 0.9 : 1.1, opacity: 1, duration: M.d * 0.35 }, M.a)
            .to(ticks, { opacity: 0, duration: M.d * 0.3 }, M.a)
            .fromTo(
              wipe,
              { clipPath: "circle(0% at 50% 50%)" },
              { clipPath: "circle(125% at 50% 50%)", duration: M.d * 0.55, ease: "power2.in" },
              M.a + M.d * 0.2,
            )
            .to(speed, { opacity: 0.16, duration: M.d * 0.4 }, M.a + M.d * 0.5)
            .to(rift, { ...pos("bug"), duration: M.d * 0.38 }, M.a + M.d * 0.62);
          const idle = Math.max(1, L.a - M.b);
          tl.to(ring, { rotation: "-=200", duration: idle, ease: "none" }, M.b);

          /* CH.05 LOADOUT: the wipe closes onto the rift, the rift splits into orbiting rings */
          const lx = 50 + at.loadout.x * 100;
          const ly = 50 + at.loadout.y * 100;
          tl.to(rift, { ...pos("loadout"), duration: L.d }, L.a)
            .to(speed, { opacity: 0, duration: L.d * 0.5 }, L.a)

            .fromTo(
              wipe,
              { clipPath: "circle(125% at 50% 50%)" },
              {
                clipPath: `circle(0% at ${lx}% ${ly}%)`,
                duration: L.d * 0.8,
                ease: "power2.out",
                immediateRender: false,
              },
              L.a,
            )
            .to([ring, slash], { scale: 0.56, duration: L.d * 0.5, ease: "power3.out" }, L.a + L.d * 0.5)
            .fromTo(
              orbit,
              { opacity: 0, scale: 0.2, rotation: -80 },
              { opacity: 1, scale: 1, rotation: 0, duration: L.d * 0.5, ease: "power3.out" },
              L.a + L.d * 0.5,
            );
          const spin = Math.max(1, X.a - L.b);
          tl.to(orbit, { rotation: (spin / vh) * 170, duration: spin, ease: "none" }, L.b).to(
            ring,
            { rotation: "-=120", duration: spin, ease: "none" },
            L.b,
          );

          /* CH.06 EXIT: rings fall back in, the rift collapses into the arrow */
          tl.to(orbit, { opacity: 0, scale: 0.1, duration: X.d * 0.45, ease: "power2.in" }, X.a)
            .to(rift, { ...pos("exit"), duration: X.d * 0.6, ease: "power2.in" }, X.a)

            .to(
              arrow,
              { opacity: 1, scale: m ? 0.62 : 1, duration: X.d * 0.42, ease: "back.out(1.7)" },
              X.a + X.d * 0.56,
            );

          // phone: the arrow sits in the gap above the panel and leaves with it
          if (m && max - X.b > 2) {
            tl.to(arrow, { y: at.exit.y * vh - (max - X.b), duration: max - X.b, ease: "none" }, X.b);
          }

          /* parallax: three depths behind everything */
          tl.to(htA, { y: -vh * 0.75, x: vw * 0.07, duration: max, ease: "none" }, 0)
            .to(htB, { y: -vh * 0.28, x: -vw * 0.05, duration: max, ease: "none" }, 0)
            .to(speed, { x: -vh * 0.5, y: -vh * 0.8, duration: max, ease: "none" }, 0);

          /* parallax: floating stickers inside the scenes, each at its own depth */
          gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
            const sec = el.closest<HTMLElement>("[data-scene]");
            if (!sec) return;
            const depth = parseFloat(el.dataset.depth || "0.3");
            const top = sec.getBoundingClientRect().top + window.scrollY;
            const a = clamp(top - vh);
            const b = clamp(top + sec.offsetHeight);
            if (b - a < 2) return;
            const p0 = (a - (top - vh)) / (sec.offsetHeight + vh); // where in its run it starts
            const p1 = (b - (top - vh)) / (sec.offsetHeight + vh);
            const travel = depth * 260;
            tl.fromTo(
              el,
              { y: travel * (0.5 - p0) },
              { y: travel * (0.5 - p1), duration: b - a, ease: "none", immediateRender: true },
              a,
            );
          });

          /* per-scene palette, kept off the paint path: the ground is a flat navy
             layer whose opacity scrubs; only the small accent chips (HUD, tape
             labels) take an interpolated colour from the locked tokens. */
          const css = getComputedStyle(root);
          const ACCENT = ["pink", "pink", "cyan", "amber", "cyan", "pink"].map((n) =>
            css.getPropertyValue(`--${n}`).trim(),
          );
          const GROUND = [0, 0.7, 1, 1, 0.3, 0];
          const pal = { t: 0 };
          let shown = "";
          const applyPal = () => {
            const v = gsap.utils.interpolate(ACCENT, pal.t / (ACCENT.length - 1)) as string;
            if (v === shown) return;
            shown = v;
            st.style.setProperty("--fx-accent", v);
            hud.style.setProperty("--fx-accent", v);
          };
          [P, S, M, L, X].forEach((sp, n) => {
            tl.fromTo(
              pal,
              { t: n },
              { t: n + 1, duration: sp.d, ease: "none", immediateRender: false, onUpdate: applyPal },
              sp.a,
            ).fromTo(
              tint,
              { opacity: GROUND[n] },
              { opacity: GROUND[n + 1], duration: sp.d, ease: "none", immediateRender: false },
              sp.a,
            );
          });
          applyPal();

          tl.set({}, {}, max); // pad so 1s === 1px for the whole page
        });
      };

      // Build once, when the fonts have settled (measuring before would mean
      // building twice); fall back to building straight away.
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      let live = true;
      fontsReady.then(() => {
        if (!live) return;
        build();
        ScrollTrigger.refresh();
      });

      // rebuild on a real resize; ignore the phone's address bar sliding away
      let w = innerWidth;
      let h = innerHeight;
      let timer = 0;
      const onResize = () => {
        if (innerWidth === w && Math.abs(innerHeight - h) < 140) return;
        w = innerWidth;
        h = innerHeight;
        clearTimeout(timer);
        timer = window.setTimeout(() => {
          ScrollTrigger.refresh();
          build();
        }, 160);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(timer);
        clearTimeout(glitchTimer);
        glitch.kill();
        burst.kill();
        live = false;
        master?.revert();
        entrances.revert();
        gsap.ticker.remove(tick);
        gsap.ticker.remove(layers);
        lenis.destroy();
      };
    }
  }, [channels]);

  return (
    <>
      <div ref={stage} className="stage" aria-hidden="true">
        <div className="stage-tint" />
        <div className="stage-tags">
          {TAGS.map(([text, side, base, speed, tone]) => (
            <div key={text} data-speed={speed} data-base={base} data-side={side}>
              <span className={`tag micro ${tone ? `tag--${tone}` : ""}`}>{text}</span>
            </div>
          ))}
        </div>
        <div className="stage-ht stage-ht--a halftone" />
        <div className="stage-ht stage-ht--b halftone" />
        <svg className="stage-speed" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <g stroke="currentColor" strokeWidth="2">
            {Array.from({ length: 16 }, (_, i) => (
              <line
                key={i}
                x1={i * 90 - 300}
                y1={1000}
                x2={i * 90 + 200}
                y2={((i * 37) % 5) * 60}
                strokeDasharray={`${180 + ((i * 53) % 220)} ${90 + ((i * 29) % 160)}`}
              />
            ))}
          </g>
        </svg>

        <div className="fx-speed" />

        <div className="stage-wipe">
          <div className="halftone" />
          <div className="slashes" />
        </div>

        <div className="rift">
          <div className="rift-power">
            <div className="rift-frame">
              <span className="micro tl">VIEWPORT 4:3</span>
              <span className="micro rec">REC</span>
              <span className="micro br">SIGNAL OK</span>
            </div>
            <div className="rift-orbit">
              <i />
              <i />
              <i />
            </div>
            <div className="rift-ring">
              <svg viewBox="-112 -112 224 224">
                <defs>
                  <g id="rift-core">
                    <RiftCore />
                  </g>
                  <clipPath id="rift-band-a">
                    <rect x="-112" y="-34" width="224" height="16" />
                    <rect x="-112" y="46" width="224" height="7" />
                  </clipPath>
                  <clipPath id="rift-band-b">
                    <rect x="-112" y="8" width="224" height="11" />
                  </clipPath>
                </defs>
                <path className="rift-ticks" d={TICKS} stroke="var(--icy)" strokeWidth="1.6" fill="none" />
                <use href="#rift-core" />
                <g className="rift-glitch rift-glitch--a" clipPath="url(#rift-band-a)">
                  <use href="#rift-core" style={{ color: "var(--cyan)" }} />
                  <circle r="70" fill="none" stroke="var(--cyan)" strokeWidth="5" />
                </g>
                <g className="rift-glitch rift-glitch--b" clipPath="url(#rift-band-b)">
                  <circle r="70" fill="none" stroke="var(--pink)" strokeWidth="5" />
                </g>
              </svg>
            </div>
            {/* the slash stays put while the ring rolls under it */}
            <div className="rift-slash">
              <svg viewBox="-112 -112 224 224">
                <g transform="rotate(-38)">
                  <rect x="-128" y="-7.5" width="256" height="15" fill="var(--red)" />
                  <rect x="-104" y="12" width="150" height="3" fill="var(--pink)" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="arrow">
          <svg viewBox="0 0 200 200">
            <path d="M18 78h92V40l76 60-76 60v-38H18z" fill="var(--pink)" transform="translate(9 9)" />
            <path
              d="M18 78h92V40l76 60-76 60v-38H18z"
              fill="var(--red)"
              stroke="var(--icy)"
              strokeWidth="5"
              strokeLinejoin="miter"
            />
          </svg>
        </div>
      </div>

      <div ref={staticRef} className="static" aria-hidden="true">
        <div className="static-bars" />
        <div className="static-noise" />
        <div className="static-bar" />
        <div className="static-bar" />
        <div className="static-osd">
          <span className="display">
            CH.<span data-osd-num>01</span>
          </span>
          <span className="micro" data-osd-name>
            Lobby
          </span>
        </div>
      </div>
      <div ref={crtRef} className="crt" aria-hidden="true">
        <div className="crt-grain" />
        <div className="crt-vignette" />
      </div>
      <div className="scanlines" aria-hidden="true" />

      <div ref={hudRef} className="hud micro">
        <div className="hud-group" aria-hidden="true">
          <span className="hud-chip">
            <i className="hud-rec" />
            REC
          </span>
          <span className="hud-chip hud-tc">
            <span data-hud="tc">00:00:00</span>
            <span data-hud="ff" className="hud-frames">
              :00
            </span>
          </span>
        </div>
        <div className="hud-group">
          <button
            type="button"
            className="hud-chip hud-btn"
            aria-pressed={paused}
            onClick={togglePause}
          >
            Pause FX
          </button>
          <span className="hud-chip hud-chip--accent" aria-hidden="true">
            <span>CH</span>
            <span>
              <b data-hud="ch">01</b>/{String(channels.length).padStart(2, "0")}
            </span>
          </span>
          <span className="hud-chip" aria-hidden="true">
            <b data-hud="pct">000</b>%
          </span>
        </div>
      </div>

      <div ref={cursorRef} className="cursor" aria-hidden="true">
        <svg className="c-arrow" viewBox="0 0 34 34">
          <path d={ARROW} transform="translate(3 3)" fill="var(--pink)" />
          <path d={ARROW} fill="var(--icy)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <svg className="c-hand" viewBox="0 0 34 34">
          <g transform="translate(-11 2)">
            <path d={HAND} transform="translate(3 3)" fill="var(--pink)" />
            <path d={HAND} fill="var(--icy)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </>
  );
}
