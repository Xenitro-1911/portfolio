import type { Metadata } from "next";
import { contact, loadout, missions, profile, shifts } from "@/data/cv";
import Link from "next/link";
import "./cv.css";

export const metadata: Metadata = {
  title: `CV: ${profile.name}`,
  description: `${profile.name}, ${profile.role}. One-page CV.`,
  alternates: { canonical: "/cv" },
};

const strip = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** The printable CV: same facts as the site, no effects, one A4 page. */
export default function CvPage() {
  const spoken = profile.facts.find((f) => f.label === "Languages");
  return (
    <main className="cv-page">
      <nav className="cv-bar" aria-label="CV actions">
        <Link href="/">Back to the site</Link>
        <a href="/cv.pdf" download="Vaibhav-Bisht-CV.pdf">
          Download CV (PDF)
        </a>
      </nav>

      <article className="cv-sheet">
        <header className="cv-head">
          <h1>{profile.name}</h1>
          <p className="cv-role">{profile.role}</p>
          <ul className="cv-contact">
            <li>{profile.location}</li>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            {contact.links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{strip(l.href)}</a>
              </li>
            ))}
          </ul>
          {contact.availability ? <p className="cv-avail">{contact.availability}</p> : null}
        </header>

        <section>
          <h2>Profile</h2>
          {profile.summary.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>

        <section>
          <h2>Experience and education</h2>
          {shifts.map((s) => (
            <div key={s.id} className="cv-item">
              <div className="cv-item-head">
                <h3>
                  {s.role}, {s.org}
                </h3>
                <p className="cv-meta">{[s.period, s.location].filter(Boolean).join(" · ")}</p>
              </div>
              <p>{s.summary}</p>
              {s.highlights.length > 0 && (
                <ul className="cv-list">
                  {s.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        <section>
          <h2>Projects</h2>
          <div className="cv-projects">
            {missions.map((m) => (
              <div key={m.id} className="cv-project">
                <h3>
                  {m.title} <span className="cv-kind">{m.kind}</span>
                </h3>
                <p>{m.blurb}</p>
                {m.stack.length > 0 && <p className="cv-meta">{m.stack.join(", ")}</p>}
                {m.links?.length ? (
                  <p className="cv-meta">
                    {m.links.map((l, n) => (
                      <span key={l.href}>
                        {n > 0 ? " · " : ""}
                        <a href={l.href}>{strip(l.href)}</a>
                      </span>
                    ))}
                  </p>
                ) : m.status ? (
                  <p className="cv-meta">{m.status}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="cv-skills">
            {loadout.map((g) => (
              <div key={g.id}>
                <dt>{g.slot}</dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
            {spoken ? (
              <div>
                <dt>Spoken</dt>
                <dd>{spoken.value}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      </article>
    </main>
  );
}
