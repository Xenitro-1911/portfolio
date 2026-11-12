import { channels, profile } from "@/data/cv";
import { Float, SceneHead } from "@/components/parts";

export default function Profile() {
  return (
    <section id="profile" data-scene="profile" className="overflow-x-clip py-[clamp(110px,18vh,220px)]">
      <Float depth={0.7} className="bottom-[9%] left-[4%] -rotate-3 max-lg:hidden">
        <span className="sticker micro">Subject on screen</span>
      </Float>
      <Float depth={0.4} className="right-[3%] top-[7%] rotate-12 max-md:hidden">
        <span className="sticker sticker--ink micro">Tracking</span>
      </Float>

      <div className="wrap relative grid gap-x-8 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-7">
          <SceneHead channel={channels[1]} />

          <div className="mt-12 grid">
            <div className="panel -rotate-1 p-6 sm:p-8" data-enter="panel">
              <div className="tape -top-3 left-8 -rotate-6" aria-hidden="true" />
              <div className="grid gap-4 text-[1.125rem] font-medium">
                {profile.summary.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            <div
              className="panel panel--ink relative z-[1] -mt-4 ml-auto w-[min(100%,440px)] rotate-2 p-6"
              data-enter="panel"
            >
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5">
                {profile.facts.map((f) => (
                  <div key={f.label} className="contents">
                    <dt className="micro pt-1 text-peri">{f.label}</dt>
                    <dd className="font-bold">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className="panel panel--pink relative z-[2] -mt-5 w-[min(88%,400px)] -rotate-3 px-6 py-5"
              data-enter="panel"
            >
              <p className="callout">{profile.callout}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
