import type { Metadata, Viewport } from "next";
import { Anton, Barlow, Space_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import { profile } from "@/data/cv";
import "./globals.css";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});
const body = Barlow({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});
const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});
// Japanese faces ship as many small unicode-range slices; the browser only
// fetches the slice holding the handful of katakana on the page.
const jp = Zen_Kaku_Gothic_New({
  weight: "900",
  variable: "--font-jp-face",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: `${profile.name}: ${profile.role}`,
  description: profile.tagline,
};

export const viewport: Viewport = {
  themeColor: "#0d0d15",
  colorScheme: "dark",
};

// Runs before first paint. `motion` is what turns the fixed stage on; without it
// (reduced motion, or script never running) the page is the static layout.
const motionGate = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${jp.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
