"use client";

import { useEffect, useRef, useState } from "react";

/** Copies the address with the Clipboard API, falling back to a hidden textarea. */
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copy(email);
    setState(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <>
      <button type="button" className="exit-btn exit-btn--alt" data-copied={state === "copied"} onClick={onClick}>
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy email"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "copied" ? "Email address copied" : state === "failed" ? "Could not copy the email address" : ""}
      </span>
    </>
  );
}
