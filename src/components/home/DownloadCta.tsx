"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AppleAppStoreBadge, GooglePlayBadge } from "@/components/ui/StoreBadges";

export function DownloadCta() {
  return (
    <section id="download" className="relative scroll-mt-20 py-16 sm:py-24">
      <Container>
        {/* Deep Dark Teal Banner Card */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#061B20] via-[#0B2A31] to-[#041418] p-8 sm:p-12 lg:p-16 text-white shadow-2xl border border-teal-800/40">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>GET EVENTUALLY</span>
              </div>

              <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                Your next plan is probably closer than you think.
              </h2>

              <p className="mt-4 max-w-xl text-base text-teal-100/80 sm:text-lg">
                Download the app and start making it happen. Free on iOS and Android.
              </p>
            </div>

            {/* Right Store Badges */}
            <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-4">
              <AppleAppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
