// Prints the /cv route to public/cv.pdf with headless Chrome or Edge.
// Usage: npm run build && npm start (in another shell), then npm run cv:pdf [url]
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const url = process.argv[2] || "http://localhost:3000/cv";
const browsers = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const bin = browsers.find((b) => existsSync(b));
if (!bin) {
  console.error("No Chrome/Edge found. Set CHROME_PATH.");
  process.exit(1);
}
const out = resolve("public/cv.pdf");
const r = spawnSync(
  bin,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--user-data-dir=${mkdtempSync(join(tmpdir(), "cvpdf-"))}`,
    `--print-to-pdf=${out}`,
    "--virtual-time-budget=4000",
    url,
  ],
  { stdio: "inherit" },
);
process.exit(r.status ?? 1);
