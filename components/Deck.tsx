import { channels, profile } from "@/data/cv";

/** The fixed bar: a tape deck's front panel. Wordmark, six channels, one readout. */
export default function Deck() {
  return (
    <header className="deck">
      <div className="wrap flex h-full items-center justify-between gap-4">
        <a href="#lobby" className="display text-[1.5rem] leading-none text-icy">
          {profile.name}
        </a>
        <nav aria-label="Channels" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {channels.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="deck-link micro"
                  data-ch-link
                  aria-current={i === 0 ? "true" : "false"}
                >
                  <b>{c.ch}</b>
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="micro flex items-center gap-2 text-silver lg:hidden">
          <span className="bg-pink px-1.5 py-0.5 font-bold text-ink">
            CH.<span data-now-num>01</span>
          </span>
          <span data-now-name>Lobby</span>
        </p>
      </div>
    </header>
  );
}
