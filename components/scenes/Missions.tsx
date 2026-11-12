import type { ReactNode } from "react";
import { channels, missions, type Mission } from "@/data/cv";
import { ArrowRight, Float, SceneHead, cssVars } from "@/components/parts";

const TILT = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2"];

/** The shell: a real link when there is a URL, a plain case when there is not. */
function Shell({ m, children }: { m: Mission; children: ReactNode }) {
  return m.href ? (
    <a href={m.href} className="case case--link h-full" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <article className="case h-full">{children}</article>
  );
}

export default function Missions() {
  return (
    <section
      id="missions"
      data-scene="missions"
      className="overflow-x-clip py-[clamp(110px,18vh,220px)]"
      style={cssVars({ "--scene-accent": "var(--amber)" })}
    >
      <Float depth={0.6} className="right-[5%] top-[6%] -rotate-6 max-md:hidden">
        <span className="sticker micro">Be kind, rewind</span>
      </Float>

      <div className="wrap relative">
        <SceneHead channel={channels[3]} shadow="var(--ink)" />
        <p className="mt-5 max-w-[60ch] text-[1.125rem] font-medium" data-enter="rise">
          Six tapes off the shelf. Cases with a live site open it.
        </p>

        <ul className="mt-14 grid gap-x-9 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {missions.map((m, i) => (
            <li key={m.id} className={TILT[i % TILT.length]} data-enter="tape">
              <Shell m={m}>
                <div className="case-body">
                  <div className="case-spine micro" aria-hidden="true">
                    <span>{m.title}</span>
                    {m.year ? <span>{m.year}</span> : null}
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
                      <p className="caption micro">{m.caption}</p>
                      <p className="micro mt-3 text-ink/80">
                        {m.kind}
                        {m.year ? ` / ${m.year}` : ""}
                      </p>
                      <h3 className="display mt-2 text-[clamp(2rem,3vw,2.6rem)] [overflow-wrap:anywhere]">
                        {m.title}
                      </h3>
                      <p className="mt-3 font-medium">{m.blurb}</p>
                      {m.stack.length > 0 && (
                        <ul className="micro mt-4 flex flex-wrap gap-x-3 gap-y-1 font-bold" aria-label="Built with">
                          {m.stack.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
                        {m.href ? (
                          <span className="case-go micro">
                            Visit site <ArrowRight className="h-[0.9em] w-[1.2em]" />
                            <span className="sr-only">(opens in a new tab)</span>
                          </span>
                        ) : m.status ? (
                          <span className="sticker sticker--amber micro">{m.status}</span>
                        ) : null}
                        <div className="barcode ml-auto w-[96px] text-ink" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </Shell>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
