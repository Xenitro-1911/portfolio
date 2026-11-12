/**
 * CV content. This is the only file that holds copy; sections read everything from here.
 * Only supplied facts live here. An empty string or missing field is simply not rendered:
 * never fill a gap with a guess.
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
  /** Street-TV style one-liner, shown as the card's channel caption. */
  caption: string;
  summary: string;
  highlights: string[];
};

export type Mission = {
  id: string;
  title: string;
  kind: string;
  /** Optional: omitted when not supplied. */
  year?: string;
  /** Street-TV style one-liner, shown as the card's channel caption. */
  caption: string;
  blurb: string;
  /** Only stacks that were supplied; an empty list hides the row. */
  stack: string[];
  /** Live URL. Omitted when there is none: the card then shows no link. */
  href?: string;
  /** A status chip shown in place of a link, e.g. "In development". */
  status?: string;
  /** Which cover the tape case gets. Kept to the two loud accents on purpose. */
  cover: "pink" | "red";
};

export type GearGroup = {
  id: string;
  slot: string;
  note: string;
  items: string[];
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
  role: "Software development student + family-business operator",
  tagline: "Software development student + family-business operator",
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
    role: "Operations and software",
    org: "VaishnaviInvest OÜ (Buddha's Restaurant, Bella's Café & Grill)",
    period: "",
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
    period: "2nd year, graduating June 2028",
    location: "Tallinn, Estonia",
    caption: "ON AIR: lectures by day, deploys by night",
    summary: "Second-year degree combining software development with running a business.",
    highlights: [
      "Submitted the Intermodal Trip Planner to the Bolt Graduate Programme.",
      "Built the University Learning Platform System in Java with Maven and JUnit 5.",
    ],
  },
];

export const missions: Mission[] = [
  {
    id: "mission-1",
    title: "Buddha's Restaurant website",
    kind: "Website",
    caption: "LIVE: two locations, one menu",
    blurb:
      "Rebuilt the restaurant's site for its Paide and Kose locations, with a gift-card promotion.",
    stack: [],
    status: "In development",
    cover: "pink",
  },
  {
    id: "mission-2",
    title: "bellascafeandgrill.ee",
    kind: "Website",
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
    caption: "TONIGHT'S FEATURE: the till that speaks Estonian tax",
    blurb:
      "Restaurant point-of-sale system with Estonian VAT and region support. Includes \"Kasa\", an Electron desktop prototype.",
    stack: ["FastAPI", "Next.js", "PostgreSQL", "Electron"],
    cover: "pink",
  },
  {
    id: "mission-4",
    title: "Intermodal Trip Planner",
    kind: "Web app",
    caption: "PREMIERE: door to door, any mode",
    blurb: "Trip planner built for the Bolt Graduate Programme. Live on Vercel.",
    stack: [],
    href: "https://intermodal-trip-planner.vercel.app",
    cover: "red",
  },
  {
    id: "mission-5",
    title: "University Learning Platform System",
    kind: "Java system",
    caption: "RERUN: class is in session",
    blurb: "Learning platform system written in Java and covered by JUnit 5 tests.",
    stack: ["Java", "Maven", "JUnit 5"],
    cover: "pink",
  },
  {
    id: "mission-6",
    title: "Java LeetCode practice",
    kind: "Practice repos",
    caption: "DAILY SEGMENT: one problem at a time",
    blurb: "Structured Java repositories of LeetCode solutions.",
    stack: [],
    cover: "red",
  },
];

/** Skills grouped by what they are for. No self-ratings. */
export const loadout: GearGroup[] = [
  {
    id: "languages",
    slot: "Languages",
    note: "What I write code in.",
    items: ["Python", "TypeScript", "Java"],
  },
  {
    id: "web",
    slot: "Web",
    note: "Front ends and desktop shells.",
    items: ["Next.js", "React", "Tailwind", "Electron"],
  },
  {
    id: "backend",
    slot: "Backend and Data",
    note: "APIs and storage.",
    items: ["FastAPI", "PostgreSQL"],
  },
  {
    id: "tools",
    slot: "Tools",
    note: "Build, test and ship.",
    items: ["Git / GitHub", "Maven", "JUnit 5"],
  },
];

export const contact: Contact = {
  email: "vaibhavbisht.1911@gmail.com",
  availability: "Open to entry-level roles in Tallinn.",
  pitch: "Open to entry-level roles. Email is the fastest way to reach me.",
  links: [
    { label: "GitHub", handle: "@Xenitro-1911", href: "https://github.com/Xenitro-1911" },
    {
      label: "This portfolio",
      handle: "vercel.app",
      href: "https://portfolio-rose-beta-4jmpryazcn.vercel.app",
    },
  ],
};

/** Public site URL, for metadata and the printed CV. */
export const siteUrl = "https://portfolio-rose-beta-4jmpryazcn.vercel.app";
