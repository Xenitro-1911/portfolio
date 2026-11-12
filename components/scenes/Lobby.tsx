import { channels, profile } from "@/data/cv";
import { Float, cssVars } from "@/components/parts";

export default function Lobby() {
  const ch = channels[0];
  return (
    <section
      id="lobby"
      data-scene="lobby"
      className="flex min-h-[100svh] flex-col overflow-x-clip pt-[var(--nav-h)]"
    >
      <Float depth={0.5} className="right-[6%] top-[16%] rotate-6">
        <span className="sticker sticker--red micro">On air</span>
      </Float>
      <Float depth={0.9} className="left-[5%] top-[22%] -rotate-6 max-md:hidden">
        <span className="sticker sticker--ink micro">Insert tape</span>
      </Float>

      <div className="wrap relative flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="display lobby-name">
          {profile.nameLines.map((line, i) => (
            <span key={line} className="block">
              <span className="slam inline-block" style={cssVars({ "--i": i })}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="rise mt-6 text-[clamp(1.15rem,2.4vw,1.6rem)] font-bold uppercase tracking-[0.02em]">
          <span className="bg-icy px-2 py-0.5 text-ink">{profile.role}</span>
        </p>
        {profile.tagline && profile.tagline !== profile.role ? (
          <p className="rise mt-3 max-w-[34ch] text-icy" style={cssVars({ "--i": 1 })}>
            {profile.tagline}
          </p>
        ) : null}
      </div>

      <div className="wrap rise relative flex items-end justify-between gap-6 pb-6" style={cssVars({ "--i": 2 })}>
        <div className="text-silver">
          <div className="barcode w-[132px] text-icy" aria-hidden="true" />
          <p className="micro mt-2">
            CH.{ch.ch} {ch.title}{" "}
            <span className="jp" lang="ja" aria-hidden="true">
              {ch.jp}
            </span>
          </p>
        </div>
        <a href="#profile" className="cue micro flex items-center gap-3 text-icy no-underline">
          Scroll to change channel
          <svg width="16" height="22" viewBox="0 0 16 22" aria-hidden="true">
            <path d="M5 0h6v11h5L8 22 0 11h5z" fill="var(--pink)" />
          </svg>
        </a>
      </div>
    </section>
  );
}
