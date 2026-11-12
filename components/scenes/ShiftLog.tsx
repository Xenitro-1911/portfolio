import { channels, shifts } from "@/data/cv";
import { Float, SceneHead, cssVars } from "@/components/parts";

const TILT = ["-rotate-1", "rotate-1", "-rotate-[0.6deg]"];

export default function ShiftLog() {
  return (
    <section id="shiftlog" data-scene="shiftlog" className="overflow-x-clip py-[clamp(110px,18vh,220px)]">
      <Float depth={0.8} className="right-[4%] top-[5%] rotate-6 max-md:hidden">
        <span className="sticker sticker--red micro">Rec</span>
      </Float>
      <Float depth={0.5} className="bottom-[4%] left-[30%] -rotate-6 max-lg:hidden">
        <span className="sticker micro">Do not erase</span>
      </Float>

      <div className="wrap relative grid gap-x-8 lg:grid-cols-12">
        <div className="lg:col-span-8 lg:col-start-5">
          <SceneHead channel={channels[2]} shadow="var(--pink)" />

          <ol className="mt-14 grid gap-12">
            {shifts.map((s, i) => (
              <li key={s.id} className={TILT[i % TILT.length]} data-enter="sticker">
                <article
                  className="panel p-6 sm:p-8"
                  style={cssVars({ "--panel-shadow": i % 2 ? "var(--pink)" : "var(--red)" })}
                >
                  <div
                    className={`tape -top-3 ${i % 2 ? "right-10 rotate-3" : "left-10 -rotate-3"}`}
                    aria-hidden="true"
                  />
                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-[150px_1fr]">
                    <div>
                      <p className="sticker sticker--ink micro">{s.period}</p>
                      <p className="micro mt-3 text-ink/75">{s.location}</p>
                    </div>
                    <div>
                      <h3 className="display text-[clamp(2rem,4.4vw,3.1rem)]">{s.role}</h3>
                      <p className="mt-2 text-[1.125rem] font-bold">{s.org}</p>
                      <p className="mt-3 font-medium">{s.summary}</p>
                      <ul className="mt-4 grid gap-2 font-medium">
                        {s.highlights.map((h) => (
                          <li key={h} className="grid grid-cols-[18px_1fr] gap-3">
                            <span
                              className="mt-[0.5em] h-[7px] w-[18px] -skew-x-[24deg] bg-red"
                              aria-hidden="true"
                            />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
