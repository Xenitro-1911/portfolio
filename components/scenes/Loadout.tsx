import { channels, loadout } from "@/data/cv";
import { Float, SceneHead, cssVars } from "@/components/parts";

export default function Loadout() {
  return (
    <section id="loadout" data-scene="loadout" className="overflow-x-clip py-[clamp(110px,18vh,220px)]">
      <Float depth={0.7} className="bottom-[10%] right-[8%] rotate-6 max-lg:hidden">
        <span className="sticker micro" style={cssVars({ "--sticker-bg": "var(--cyan)" })}>
          Equipped
        </span>
      </Float>

      <div className="wrap relative grid gap-x-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SceneHead channel={channels[4]} />

          <div className="mt-14 grid gap-10">
            {loadout.map((g) => (
              <section key={g.id} aria-labelledby={`gear-${g.id}`}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1" data-enter="rise">
                  <h3 id={`gear-${g.id}`} className="display text-[clamp(1.7rem,3vw,2.2rem)]">
                    {g.slot}
                  </h3>
                  <p className="font-medium text-peri">{g.note}</p>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {g.items.map((it) => (
                    <li key={it.name} data-enter="slot">
                      <div className={`slot ${it.level === 5 ? "slot--max" : ""}`}>
                        <p className="font-bold leading-tight">{it.name}</p>
                        <div className="pips" role="img" aria-label={`Level ${it.level} of 5`}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <i key={n} className={n <= it.level ? "on" : undefined} />
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
