import { Fragment } from "react";
import { channels, missions } from "@/data/cv";
import { ArrowRight, Float, SceneHead, cssVars } from "@/components/parts";

const TILT = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2"];

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
          Six tapes off the shelf. Click a case, or its button, to open the project.
        </p>

        <ul className="mt-14 grid gap-x-9 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {missions.map((m, i) => {
            // exactly one URL: the whole card is that link (stretched link on the title).
            // Several URLs: the card is not a link, each button is. None: plain card.
            const single = m.links?.length === 1 ? m.links[0] : null;
            const many = (m.links?.length ?? 0) > 1 ? m.links! : null;
            const title = (
              <h3 className="display mt-2 text-[clamp(1.8rem,2.3vw,2.5rem)] [overflow-wrap:break-word]">
                {/* domain names may break before their dot, never mid-word */}
                {m.title.split(/(?=\.)/).map((part, n) => (
                  <Fragment key={n}>
                    {n > 0 && <wbr />}
                    {part}
                  </Fragment>
                ))}
              </h3>
            );
            return (
            <li key={m.id} className={TILT[i % TILT.length]} data-enter="tape">
              <article className={`case h-full ${single ? "case--link" : ""}`}>
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
                      {single ? (
                        <a
                          href={single.href}
                          className="case-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {title}
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        title
                      )}
                      <p className="mt-3 font-medium">{m.blurb}</p>
                      {m.stack.length > 0 && (
                        <ul className="micro mt-4 flex flex-wrap gap-x-3 gap-y-1 font-bold" aria-label="Built with">
                          {m.stack.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto pt-5">
                        {single ? (
                          // decorative: a click on it lands on the stretched link above
                          <span className="case-go micro" aria-hidden="true">
                            {single.label}
                            <ArrowRight className="h-[0.9em] w-[1.2em]" />
                          </span>
                        ) : many ? (
                          <div className="flex flex-wrap gap-2.5">
                            {many.map((l) => (
                              <a
                                key={l.href}
                                href={l.href}
                                className="case-go micro"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {l.label}
                                <ArrowRight className="h-[0.9em] w-[1.2em]" />
                                <span className="sr-only">
                                  , {m.title} (opens in a new tab)
                                </span>
                              </a>
                            ))}
                          </div>
                        ) : m.status ? (
                          <span className="sticker sticker--amber micro">{m.status}</span>
                        ) : null}
                        <div
                          className={`barcode w-[96px] text-ink ${m.links?.length || m.status ? "mt-4" : ""}`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
