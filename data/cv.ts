/**
 * CV content. This is the only file that holds copy; sections read everything from here.
 * Anything marked TODO is a fact that has not been supplied yet. Do not guess it.
 */

export type SceneId = "lobby" | "profile" | "shiftlog" | "missions" | "loadout" | "exit";

export type Channel = {
  id: SceneId;
  /** Two-digit channel number shown on the OSD. */
  ch: string;
  title: string;
  /** Katakana accent. Decorative, hidden from assistive tech. */
  jp: string;
};

export type Profile = {
  name: string;
  /** The name split into the lines the hero stacks. Two lines at most. */
  nameLines: [string] | [string, string];
  role: string;
  tagline: string;
  location: string;
  summary: string[];
  facts: { label: string; value: string }[];
  callout: string;
};

export type Shift = {
  id: string;
  role: string;
  org: string;
  period: string;
  location: string;
  /** Street-TV style one-liner. Not rendered by any component yet. */
  caption: string;
  summary: string;
  highlights: string[];
};

export type Mission = {
  id: string;
  title: string;
  kind: string;
  year: string;
  /** Street-TV style one-liner. Not rendered by any component yet. */
  caption: string;
  blurb: string;
  stack: string[];
  href: string;
  /** Which cover the tape case gets. Kept to the two loud accents on purpose. */
  cover: "pink" | "red";
};

export type GearLevel = 1 | 2 | 3 | 4 | 5;

export type GearGroup = {
  id: string;
  slot: string;
  note: string;
  items: { name: string; level: GearLevel }[];
};

export type Contact = {
  email: string;
  availability: string;
  pitch: string;
  links: { label: string; handle: string; href: string }[];
};

export const channels: Channel[] = [
  { id: "lobby", ch: "01", title: "Lobby", jp: "ロビー" },
  { id: "profile", ch: "02", title: "Profile", jp: "プロフィール" },
  { id: "shiftlog", ch: "03", title: "Shift Log", jp: "シフトログ" },
  { id: "missions", ch: "04", title: "Missions", jp: "ミッション" },
  { id: "loadout", ch: "05", title: "Loadout", jp: "ロードアウト" },
  { id: "exit", ch: "06", title: "Exit", jp: "イグジット" },
];

export const profile: Profile = {
  name: "Vaibhav Bisht",
  nameLines: ["Vaibhav", "Bisht"],
  role: "Software developer and restaurant operator",
  tagline: "I build software for restaurants, and I run two of them.",
  location: "Tallinn, Estonia",
  summary: [
    "I am a second-year Software Development and Entrepreneurship student at Mainor University in Tallinn. I graduate in June 2028.",
    "Alongside my studies I help run Buddha's Restaurant and Bella's Café & Grill, two family restaurants in Paide and Kose. I write the software they need: websites, menus and a point-of-sale system.",
  ],
  facts: [
    { label: "Based in", value: "Tallinn, Estonia" },
    { label: "Studying", value: "Software Development and Entrepreneurship, Mainor University" },
    { label: "Graduating", value: "June 2028" },
    { label: "Languages", value: "English, Estonian (learning), Hindi" },
  ],
  callout: "I know what a restaurant needs because I work in one.",
};

export const shifts: Shift[] = [
  {
    id: "shift-1",
    // TODO: confirm your formal job title.
    role: "Operations and software",
    org: "VaishnaviInvest OÜ (Buddha's Restaurant, Bella's Café & Grill)",
    // TODO: start year (e.g. "20XX to now").
    period: "TODO: start year to now",
    location: "Paide and Kose, Estonia",
    caption: "NOW SHOWING: two kitchens, one team",
    summary:
      "I help run my family's two restaurants, covering operations, suppliers, staff scheduling and the tech behind them.",
    highlights: [
      "Opened the new Kose location: supplier sourcing, fit-out and food-safety inspection prep.",
      "Built a trilingual (English, Estonian, Russian) menu with 74+ items, allergen pages and QR codes.",
      "Designed weekly lunch menus for social media and A4 print.",
      "Built staff rosters that comply with Estonian labour law (TLS).",
      "Evaluated POS systems, compared supplier prices and took over invoice handling.",
    ],
  },
  {
    id: "shift-2",
    role: "Student, Software Development and Entrepreneurship",
    org: "Mainor University",
    period: "TODO: start year to June 2028",
    location: "Tallinn, Estonia",
    caption: "ON AIR: lectures by day, deploys by night",
    summary: "Second-year degree combining software development with running a business.",
    highlights: [
      "Submitted the Intermodal Trip Planner to the Bolt Graduate Programme.",
      "Built the University Learning Platform System in Java with Maven and JUnit 5.",
      // TODO: add grades, honours or coursework highlights if you want them listed.
    ],
  },
];

export const missions: Mission[] = [
  {
    id: "mission-1",
    title: "Buddha's Restaurant website",
    kind: "Website",
    // TODO: year
    year: "TODO",
    caption: "LIVE: two locations, one menu",
    blurb:
      "Rebuilt the restaurant's site for its Paide and Kose locations, with a gift-card promotion.",
    // TODO: confirm stack.
    stack: ["TODO: stack"],
    // TODO: live URL.
    href: "#missions",
    cover: "pink",
  },
  {
    id: "mission-2",
    title: "bellascafeandgrill.ee",
    kind: "Website",
    // TODO: year
    year: "TODO",
    caption: "REBROADCAST: same café, new build",
    blurb: "Rebuilt the café's website from scratch.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    href: "https://bellascafeandgrill.ee",
    cover: "red",
  },
  {
    id: "mission-3",
    title: "billing_pos",
    kind: "Full-stack POS",
    // TODO: year
    year: "TODO",
    caption: "TONIGHT'S FEATURE: the till that speaks Estonian tax",
    blurb:
      "Restaurant point-of-sale system with Estonian VAT and region support. Includes \"Kasa\", an Electron desktop prototype.",
    stack: ["FastAPI", "Next.js", "PostgreSQL", "Electron"],
    // TODO: repository URL.
    href: "#missions",
    cover: "pink",
  },
  {
    id: "mission-4",
    title: "Intermodal Trip Planner",
    kind: "Web app",
    // TODO: year
    year: "TODO",
    caption: "PREMIERE: door to door, any mode",
    blurb: "Trip planner built for the Bolt Graduate Programme. Live on Vercel.",
    // TODO: confirm stack.
    stack: ["TODO: stack"],
    href: "https://intermodal-trip-planner.vercel.app",
    cover: "red",
  },
  {
    id: "mission-5",
    title: "University Learning Platform System",
    kind: "Java system",
    // TODO: year
    year: "TODO",
    caption: "RERUN: class is in session",
    blurb: "Learning platform system written in Java and covered by JUnit 5 tests.",
    stack: ["Java", "Maven", "JUnit 5"],
    // TODO: repository URL.
    href: "#missions",
    cover: "pink",
  },
  {
    id: "mission-6",
    title: "Java LeetCode practice",
    kind: "Practice repos",
    // TODO: year
    year: "TODO",
    caption: "DAILY SEGMENT: one problem at a time",
    blurb: "Structured Java repositories of LeetCode solutions.",
    stack: ["Java"],
    // TODO: repository URL.
    href: "#missions",
    cover: "red",
  },
];

// TODO: the pip levels below are placeholders (all 3). Set each to your real level, 1 to 5.
export const loadout: GearGroup[] = [
  {
    id: "primary",
    slot: "Languages",
    note: "What I write code in.",
    items: [
      { name: "Python", level: 3 },
      { name: "TypeScript", level: 3 },
      { name: "Java", level: 3 },
    ],
  },
  {
    id: "secondary",
    slot: "Frameworks",
    note: "What I build products with.",
    items: [
      { name: "Next.js", level: 3 },
      { name: "React", level: 3 },
      { name: "FastAPI", level: 3 },
      { name: "Tailwind", level: 3 },
      { name: "Electron", level: 3 },
    ],
  },
  {
    id: "support",
    slot: "Data and tools",
    note: "Storage and workflow.",
    items: [
      { name: "PostgreSQL", level: 3 },
      { name: "Git / GitHub", level: 3 },
    ],
  },
];

export const contact: Contact = {
  email: "vaibhavbisht.1911@gmail.com",
  // TODO: availability (e.g. internship from Month 20XX).
  availability: "TODO: availability",
  pitch: "Hiring for software, or want a restaurant's tech built properly? Write to me.",
  links: [
    { label: "GitHub", handle: "@Xenitro-1911", href: "https://github.com/Xenitro-1911" },
    // TODO: LinkedIn handle and URL.
    { label: "LinkedIn", handle: "TODO", href: "#exit" },
    // TODO: add cv.pdf to /public and link it.
    { label: "CV as PDF", handle: "cv.pdf", href: "#exit" },
  ],
};
