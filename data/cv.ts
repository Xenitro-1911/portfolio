/**
 * CV content. Everything in here is a typed PLACEHOLDER: swap the values, keep the shapes.
 * No section reads copy from anywhere else, so this file is the only one to edit for real content.
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
  summary: string;
  highlights: string[];
};

export type Mission = {
  id: string;
  title: string;
  kind: string;
  year: string;
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
  name: "Your Name",
  nameLines: ["Your", "Name"],
  role: "Role / Title goes here",
  tagline: "One line on what you build and who it is for.",
  location: "City, Country",
  summary: [
    "Placeholder paragraph one. Two or three sentences on what you do, the kind of problems you like, and the thing people come to you for.",
    "Placeholder paragraph two. Where you have worked, what you are doing now, and what you want next.",
  ],
  facts: [
    { label: "Based in", value: "City, Country" },
    { label: "Focus", value: "Your main discipline" },
    { label: "Experience", value: "0+ years" },
    { label: "Status", value: "Open to offers" },
  ],
  callout: "A short line in your own voice goes here.",
};

export const shifts: Shift[] = [
  {
    id: "shift-1",
    role: "Most recent role",
    org: "Company name",
    period: "20XX to now",
    location: "City / Remote",
    summary: "Placeholder: one sentence on the team, the product and what you owned.",
    highlights: [
      "Placeholder result with a number in it.",
      "Placeholder thing you shipped and who used it.",
      "Placeholder thing you fixed that stayed fixed.",
    ],
  },
  {
    id: "shift-2",
    role: "Previous role",
    org: "Company name",
    period: "20XX to 20XX",
    location: "City",
    summary: "Placeholder: one sentence on the team, the product and what you owned.",
    highlights: [
      "Placeholder result with a number in it.",
      "Placeholder thing you shipped and who used it.",
    ],
  },
  {
    id: "shift-3",
    role: "First role or degree",
    org: "Company or school",
    period: "20XX to 20XX",
    location: "City",
    summary: "Placeholder: one sentence on where you started and what it taught you.",
    highlights: [
      "Placeholder result with a number in it.",
      "Placeholder thing you learned the hard way.",
    ],
  },
];

export const missions: Mission[] = [
  {
    id: "mission-1",
    title: "Project one",
    kind: "Web app",
    year: "20XX",
    blurb: "Placeholder: what it is, who it is for, and the one thing it does well.",
    stack: ["Tech A", "Tech B", "Tech C"],
    href: "#missions",
    cover: "pink",
  },
  {
    id: "mission-2",
    title: "Project two",
    kind: "Tooling",
    year: "20XX",
    blurb: "Placeholder: what it is, who it is for, and the one thing it does well.",
    stack: ["Tech A", "Tech D"],
    href: "#missions",
    cover: "red",
  },
  {
    id: "mission-3",
    title: "Project three",
    kind: "Experiment",
    year: "20XX",
    blurb: "Placeholder: what it is, who it is for, and the one thing it does well.",
    stack: ["Tech B", "Tech E", "Tech F"],
    href: "#missions",
    cover: "red",
  },
  {
    id: "mission-4",
    title: "Project four",
    kind: "Open source",
    year: "20XX",
    blurb: "Placeholder: what it is, who it is for, and the one thing it does well.",
    stack: ["Tech C", "Tech G"],
    href: "#missions",
    cover: "pink",
  },
];

export const loadout: GearGroup[] = [
  {
    id: "primary",
    slot: "Primary",
    note: "What you reach for every day.",
    items: [
      { name: "Skill A", level: 5 },
      { name: "Skill B", level: 5 },
      { name: "Skill C", level: 4 },
      { name: "Skill D", level: 4 },
    ],
  },
  {
    id: "secondary",
    slot: "Secondary",
    note: "Solid, used most weeks.",
    items: [
      { name: "Skill E", level: 4 },
      { name: "Skill F", level: 3 },
      { name: "Skill G", level: 3 },
      { name: "Skill H", level: 3 },
    ],
  },
  {
    id: "support",
    slot: "Support",
    note: "Tools and habits around the work.",
    items: [
      { name: "Tool A", level: 4 },
      { name: "Tool B", level: 3 },
      { name: "Tool C", level: 2 },
      { name: "Tool D", level: 2 },
    ],
  },
];

export const contact: Contact = {
  email: "you@example.com",
  availability: "Placeholder: available from Month 20XX",
  pitch: "Placeholder: one sentence on the work you want to hear about.",
  links: [
    { label: "GitHub", handle: "@your-handle", href: "#exit" },
    { label: "LinkedIn", handle: "/in/your-handle", href: "#exit" },
    { label: "CV as PDF", handle: "cv.pdf", href: "#exit" },
  ],
};
