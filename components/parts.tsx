import type { CSSProperties, ReactNode } from "react";
import type { Channel } from "@/data/cv";

export const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Scene title. The channel number rides inside the heading as a sticker. */
export function SceneHead({ channel, shadow }: { channel: Channel; shadow?: string }) {
  return (
    <header
      className="scene-head"
      data-enter="slam"
      style={shadow ? cssVars({ "--head-shadow": shadow }) : undefined}
    >
      <h2 className="display">
        {channel.title}
        <span className="sticker sticker--pink micro head-ch">CH.{channel.ch}</span>
      </h2>
      <span className="jp pb-2 text-[clamp(1rem,2.2vw,1.6rem)] text-peri" lang="ja" aria-hidden="true">
        {channel.jp}
      </span>
    </header>
  );
}

/** A decorative sticker that drifts at its own depth. Hidden from assistive tech. */
export function Float({
  depth,
  className = "",
  children,
}: {
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`float ${className}`} data-depth={depth} aria-hidden="true">
      {children}
    </div>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 42 32" aria-hidden="true">
      <path d="M2 11h20V2l18 14-18 14v-9H2z" fill="currentColor" />
    </svg>
  );
}
