"use client";

import React from "react";
import { PhoneMockup, PhoneMockupProps, Hotspot } from "./PhoneMockup";

export interface AppScreenshotProps extends PhoneMockupProps {
  title?: string;
  description?: string;
  badge?: string;
}

export function AppScreenshot({
  title,
  description,
  badge,
  className = "",
  ...mockupProps
}: AppScreenshotProps) {
  return (
    <div className={`relative flex flex-col items-center text-center ${className}`}>
      {badge ? (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-badge-border bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
          {badge}
        </span>
      ) : null}

      <div className="relative group">
        {/* Soft Decorative Ambient Teal Glow */}
        <div className="absolute -inset-6 rounded-full bg-teal-500/15 blur-2xl dark:bg-teal-400/20 pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />
        <PhoneMockup {...mockupProps} />
      </div>

      {title || description ? (
        <div className="mt-6 max-w-sm">
          {title ? (
            <h4 className="font-heading text-lg font-bold text-text-primary">{title}</h4>
          ) : null}
          {description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{description}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export type { Hotspot };
export { PhoneMockup };
