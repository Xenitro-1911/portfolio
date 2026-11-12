import { channels, missions } from "@/data/cv";
import { Float, SceneHead, cssVars } from "@/components/parts";

const TILT = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2"];

export default function Missions() {
  return (
    <section id="missions" data-scene="missions" className="overflow-x-clip py-[clamp(110px,18vh,220px)]">
      <Float depth={0.6} className="right-[5%] top-[6%] -rotate-6 max-md:hidden">
        <span className="sticker micro">Be kind, rewind</span>
      </Float>

      <div className="wrap relative">
        <SceneHead channel={channels[3]} shadow="var(--ink)" />
        <p className="mt-5 max-w-[60ch] text-[1.125rem] font-medium" data-enter="rise">
          Four tapes off the shelf. Each case opens the project it holds.
        </p>

        <ul className="mt-14 grid gap-x-9 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {missions.map((m, i) => (
            <li key={m.id} className={TILT[i % TILT.length]} data-enter="tape">
              <a href={m.href} className="case h-full" aria-label={`${m.title}: ${m.kind}, ${m.year}`}>
                <div className="case-body">
                  <div className="case-spine micro">
                    <span>{m.title}</span>
                    <span>{m.year}</span>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <div
                      className="case-cover"
                      style={cssVars({ "--cover": m.cover === "pink" ? "var(--pink)" : "var(--red)" })}
                      aria-hidden="true"
                    >
                      <div className="halftone" />
                      <div className="slash" />
                      <div className="ringlet" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="micro text-ink/75">
                        {m.kind} / {m.year}
                      </p>
                      <h3 className="display mt-2 text-[clamp(2rem,3vw,2.6rem)]">{m.title}</h3>
                      <p className="mt-3 font-medium">{m.blurb}</p>
                      <p className="micro mt-4 flex flex-wrap gap-x-3 gap-y-1 font-bold">
                        {m.stack.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </p>
                      <div className="mt-auto pt-5">
                        <div className="barcode text-ink" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
