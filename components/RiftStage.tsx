"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
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

type Props = { channels: Channel[] };

export default function RiftStage({ channels }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion")) return; // static layout: nothing to drive

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
      fx.style.setProperty("--noise", `url(${cv.toDataURL()})`);
    }
    const noise = $<HTMLElement>(".static-noise", fx);
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
      if (!first) burst.restart();
    };

    /* ---- content entrances: fire once, never rebuilt ------------------- */
    const FROM: Record<string, gsap.TweenVars> = {
      rise: { y: 28, opacity: 0 },
      panel: { y: 70, x: 34, rotation: 6, opacity: 0 },
      sticker: { scale: 1.32, rotation: -7, y: -34, opacity: 0 },
      tape: { x: 150, rotation: 9, opacity: 0 },
      slot: { scale: 0.72, opacity: 0 },
    };
    const TO: Record<string, gsap.TweenVars> = {
      rise: { duration: 0.6, ease: "expo.out", stagger: 0.07 },
      panel: { duration: 0.75, ease: "expo.out", stagger: 0.09 },
      sticker: { duration: 0.42, ease: "back.out(2.1)", stagger: 0.08 },
      tape: { duration: 0.75, ease: "expo.out", stagger: 0.08 },
      slot: { duration: 0.24, ease: "back.out(2.6)", stagger: 0.035 },
    };
    const entrances = gsap.context(() => {
      Object.keys(FROM).forEach((kind) => {
        const els = gsap.utils
          .toArray<HTMLElement>(`[data-enter="${kind}"]`)
          .filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
        if (!els.length) return;
        gsap.set(els, FROM[kind]);
        ScrollTrigger.batch(els, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              opacity: 1,
              overwrite: true,
              clearProps: "transform",
              ...TO[kind],
            }),
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
          .to(tint, { opacity: 0.55, duration: P.d }, P.a);

        /* CH.03 SHIFT LOG: half off the left edge, rolling like a reel */
        tl.to(frame, { opacity: 0, scale: 0.9, duration: S.d * 0.35, ease: "power2.in" }, S.a)
          .to(rift, { ...pos("shift"), duration: S.d }, S.a)
          .to(ticks, { opacity: 1, duration: S.d * 0.5 }, S.a + S.d * 0.5)
          .to(tint, { opacity: 1, duration: S.d }, S.a);
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
          .to(tint, { opacity: 0.3, duration: L.d }, L.a)
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
          .to(tint, { opacity: 0, duration: X.d }, X.a)
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
        tl.to(htA, { y: -vh * 0.75, duration: max, ease: "none" }, 0)
          .to(htB, { y: -vh * 0.28, duration: max, ease: "none" }, 0)
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

        tl.set({}, {}, max); // pad so 1s === 1px for the whole page
      });
    };

    build();
    document.fonts?.ready.then(() => {
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
      burst.kill();
      master?.revert();
      entrances.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [channels]);

  return (
    <>
      <div ref={stage} className="stage" aria-hidden="true">
        <div className="stage-tint" />
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
      <div className="scanlines" aria-hidden="true" />
    </>
  );
}
