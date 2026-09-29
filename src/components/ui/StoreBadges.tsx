"use client";

import React from "react";
import Link from "next/link";

export function AppleAppStoreBadge({ href = "/#download", className = "" }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="Download EventUally on the Apple App Store"
      className={`inline-flex items-center gap-3 rounded-2xl bg-black px-4 py-2.5 text-white transition-all hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] shadow-md border border-slate-700/60 ${className}`}
    >
      <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.01.63-2.65 1.38-.56.65-.99 1.69-.87 2.71 1.05.08 2.06-.52 2.6-1.22z" />
      </svg>
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-medium leading-none text-slate-400">Download on the</span>
        <span className="text-sm font-bold tracking-tight text-white leading-tight">App Store</span>
      </div>
    </Link>
  );
}

export function GooglePlayBadge({ href = "/#download", className = "" }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="Get EventUally on Google Play"
      className={`inline-flex items-center gap-3 rounded-2xl bg-black px-4 py-2.5 text-white transition-all hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] shadow-md border border-slate-700/60 ${className}`}
    >
      <svg className="h-7 w-7" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M3.6 2.4c-.2.2-.3.5-.3.9v17.4c0 .4.1.7.3.9l9.3-9.6L3.6 2.4z" />
        <path fill="#FBBC05" d="M16.5 8.7l-3.6 3.3 3.6 3.3 4.1-2.4c1.2-.7 1.2-1.9 0-2.6l-4.1-1.6z" />
        <path fill="#EA4335" d="M3.6 21.6l9.3-9.6 3.6 3.3-10.4 6c-.9.5-1.9.4-2.5.3z" />
        <path fill="#34A853" d="M3.6 2.4c.6-.1 1.6-.2 2.5.3l10.4 6-3.6 3.3L3.6 2.4z" />
      </svg>
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-medium leading-none text-slate-400">GET IT ON</span>
        <span className="text-sm font-bold tracking-tight text-white leading-tight">Google Play</span>
      </div>
    </Link>
  );
}
