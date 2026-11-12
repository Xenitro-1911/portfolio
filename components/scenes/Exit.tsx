import { channels, contact, profile } from "@/data/cv";
import { ArrowRight, Float, cssVars } from "@/components/parts";

export default function Exit() {
  const ch = channels[5];
  return (
    <section
      id="exit"
      data-scene="exit"
      className="flex min-h-[100svh] flex-col overflow-x-clip pt-[calc(var(--nav-h)+40px)] max-[819px]:pt-[40svh]"
    >
      <Float depth={0.5} className="left-[7%] top-[14%] -rotate-6 max-lg:hidden">
        <span className="sticker sticker--amber micro">This way out</span>
      </Float>

      <div className="wrap relative grid flex-1 items-center gap-x-8 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-7">
          <div
            className="panel -rotate-1 p-6 sm:p-9"
            data-enter="panel"
            style={cssVars({ "--panel-shadow": "var(--red)" })}
          >
            <div className="tape -top-3 right-10 rotate-3" aria-hidden="true" />
            <header className="flex flex-wrap items-end gap-x-4 gap-y-1">
              <h2 className="display text-[clamp(4rem,11vw,8.5rem)]">
                {ch.title}
                <span className="sticker sticker--pink micro head-ch">CH.{ch.ch}</span>
              </h2>
              <span className="jp pb-2 text-[clamp(1rem,2vw,1.4rem)] text-royal" lang="ja" aria-hidden="true">
                {ch.jp}
              </span>
            </header>
            <p className="mt-5 max-w-[40ch] text-[1.125rem] font-medium">{contact.pitch}</p>
            {contact.availability ? <p className="micro mt-2 text-ink/80">{contact.availability}</p> : null}

            <a href={`mailto:${contact.email}`} className="exit-btn mt-7">
              Email me
              <ArrowRight />
            </a>
            <p className="mt-3 break-all font-bold">{contact.email}</p>

            <ul className="mt-7 border-b-2 border-ink">
              {contact.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-link" target="_blank" rel="noopener noreferrer">
                    <span className="text-[1.125rem] font-bold">{l.label}</span>
                    <span className="micro">{l.handle}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href="/cv.pdf" className="text-link" download="Vaibhav-Bisht-CV.pdf">
                  <span className="text-[1.125rem] font-bold">Download CV (PDF)</span>
                  <span className="micro">1 page, A4</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="wrap relative mt-14 flex flex-wrap items-end justify-between gap-4 pb-6 text-silver">
        <p className="display text-[clamp(1.6rem,3vw,2.2rem)] text-icy">{profile.name}</p>
        <p className="micro">End of tape. Thanks for watching.</p>
        <div className="barcode w-[132px] text-icy" aria-hidden="true" />
      </footer>
    </section>
  );
}
