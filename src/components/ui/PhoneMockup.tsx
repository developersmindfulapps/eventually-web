"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  ChevronLeft, 
  Clock, 
  Heart, 
  Plus
} from "lucide-react";

export type MockupScreenType = 
  | "hero-around-you"
  | "hero-event-details"
  | "groups"
  | "create-event"
  | "around-you-map";

export interface Hotspot {
  id: string;
  label: string;
  number?: number;
  tooltip: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface PhoneMockupProps {
  screenshotUrl?: string;
  placeholderLabel?: string;
  screenType?: MockupScreenType;
  tilt?: "left" | "right" | "none";
  scale?: number;
  className?: string;
  priority?: boolean;
  hotspots?: Hotspot[];
}

export function PhoneMockup({
  screenshotUrl,
  placeholderLabel,
  screenType = "hero-around-you",
  tilt = "none",
  className = "",
  priority = false,
  hotspots = [],
}: PhoneMockupProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const tiltClass =
    tilt === "left"
      ? "-rotate-2 sm:-rotate-3 hover:rotate-0 transition-transform duration-500 ease-out"
      : tilt === "right"
      ? "rotate-2 sm:rotate-3 hover:rotate-0 transition-transform duration-500 ease-out"
      : "";

  return (
    <div className={`relative inline-block ${tiltClass} ${className}`}>
      {/* Outer Titanium Phone Shell */}
      <div className="relative mx-auto w-[280px] sm:w-[320px] md:w-[340px] aspect-[9/19.5] rounded-[48px] p-3 bg-gradient-to-b from-[#2d3748] via-[#1a202c] to-[#0f172a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.1)_inset] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.15)_inset]">
        {/* Antenna / Volume Buttons Decorative Bars */}
        <div className="absolute -left-[2px] top-28 h-8 w-[2px] rounded-l bg-slate-500/60" />
        <div className="absolute -left-[2px] top-40 h-12 w-[2px] rounded-l bg-slate-500/60" />
        <div className="absolute -left-[2px] top-56 h-12 w-[2px] rounded-l bg-slate-500/60" />
        <div className="absolute -right-[2px] top-36 h-16 w-[2px] rounded-r bg-slate-500/60" />

        {/* Inner Phone Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-slate-950 text-white select-none border border-slate-800/80">
          {/* Status Bar */}
          <div className="relative z-20 flex h-10 items-center justify-between px-6 pt-1 text-[11px] font-semibold tracking-tight text-white/90">
            <span>9:41</span>
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black shadow-inner flex items-center justify-end pr-2">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-900 border border-slate-700/50" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="font-bold">5G</span>
              <div className="h-2.5 w-5 rounded-sm border border-white/70 p-0.5">
                <div className="h-full w-3/4 rounded-2xs bg-white/90" />
              </div>
            </div>
          </div>

          {/* Screen Content: Real Screenshot OR Realistic Component Placeholder */}
          <div className="relative h-[calc(100%-40px)] w-full overflow-hidden">
            {screenshotUrl ? (
              <Image
                src={screenshotUrl}
                alt={placeholderLabel || "EventUally App Screenshot"}
                fill
                priority={priority}
                className="object-cover"
              />
            ) : (
              <PlaceholderScreenContent screenType={screenType} />
            )}

            {/* Subtle Screen Glare Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />

            {/* Interactive Hotspots / Callouts */}
            {hotspots.map((spot) => (
              <div
                key={spot.id}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 group"
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <button
                  type="button"
                  aria-label={`Highlight: ${spot.label}`}
                  className="relative flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-[11px] font-bold text-white shadow-lg ring-4 ring-teal-400/30 transition-transform duration-200 group-hover:scale-110 focus:outline-none"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
                  <span className="relative">{spot.number || "•"}</span>
                </button>

                {/* Tooltip */}
                <div
                  className={`absolute left-1/2 bottom-full mb-2 w-48 -translate-x-1/2 rounded-xl bg-slate-900/95 p-2.5 text-xs text-slate-100 shadow-xl backdrop-blur border border-slate-700 pointer-events-none transition-all duration-200 ${
                    activeHotspot === spot.id ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <p className="font-semibold text-teal-300">{spot.label}</p>
                  <p className="mt-1 text-[11px] text-slate-300 leading-tight">{spot.tooltip}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Home Bar */}
          <div className="absolute bottom-1.5 left-1/2 z-20 h-1 w-32 -translate-x-1/2 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}

/**
 * High-fidelity, beautifully styled placeholders matching the attached visual design
 */
function PlaceholderScreenContent({ screenType }: { screenType: MockupScreenType }) {
  switch (screenType) {
    case "hero-around-you":
      return (
        <div className="h-full w-full bg-[#0E1A1E] text-slate-100 flex flex-col justify-between p-3.5 pt-1 text-xs">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-teal-900/40">
              <div>
                <h3 className="font-heading text-sm font-bold text-white tracking-tight">Around You</h3>
                <p className="text-[10px] text-teal-400">Discover events near you</p>
              </div>
              <div className="flex gap-1.5">
                <span className="rounded-full bg-teal-900/60 px-2 py-0.5 text-[10px] text-teal-300 border border-teal-700/40 font-medium">Events</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">Groups</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 mt-2.5 overflow-x-hidden">
              <span className="rounded-full bg-teal-500 text-slate-950 font-semibold px-2.5 py-0.5 text-[10px]">Today</span>
              <span className="rounded-full bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px]">This Week</span>
              <span className="rounded-full bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px]">Free</span>
              <span className="rounded-full bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px]">Outdoor</span>
            </div>

            {/* Stylized Map View Graphic */}
            <div className="relative mt-2.5 h-36 rounded-2xl bg-[#091316] border border-teal-950 overflow-hidden flex items-center justify-center">
              {/* Subtle Grid Map Lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute h-24 w-24 rounded-full bg-teal-500/10 blur-xl" />

              {/* Map Pins */}
              <div className="absolute top-6 left-10 flex flex-col items-center">
                <div className="h-5 w-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center shadow-lg text-[9px] font-bold">☕</div>
                <div className="h-1.5 w-1.5 rotate-45 bg-teal-500 -mt-0.5" />
              </div>
              <div className="absolute top-12 right-12 flex flex-col items-center">
                <div className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg text-[9px] font-bold">🏸</div>
                <div className="h-1.5 w-1.5 rotate-45 bg-emerald-500 -mt-0.5" />
              </div>
              <div className="absolute bottom-6 left-20 flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center shadow-xl ring-2 ring-white/40 text-[10px] font-bold animate-bounce">🍕</div>
              </div>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-[#122226] border border-teal-800/40 p-2.5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-bold text-teal-300">
                  FOOD & SOCIAL
                </span>
                <h4 className="mt-1 font-bold text-white text-xs">Rooftop Dinner & Games</h4>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-300">
                  <Clock className="h-2.5 w-2.5 text-teal-400" /> Today, 7:30 PM • Indiranagar
                </p>
              </div>
              <span className="rounded-full bg-slate-800 p-1 text-teal-400">
                <Heart className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <span className="text-teal-300 font-medium">12 going • 4 spots left</span>
              <button className="rounded-full bg-teal-500 px-3 py-1 font-semibold text-slate-950 text-[10px]">RSVP</button>
            </div>
          </div>
        </div>
      );

    case "hero-event-details":
      return (
        <div className="h-full w-full bg-[#0c1619] text-slate-100 flex flex-col justify-between p-3.5 pt-1 text-xs">
          <div>
            <div className="flex items-center gap-2 pb-2">
              <span className="rounded-full bg-slate-800 p-1 text-slate-300"><ChevronLeft className="h-3.5 w-3.5" /></span>
              <h3 className="font-heading font-bold text-white">Event Details</h3>
            </div>
            
            {/* Event Banner */}
            <div className="relative mt-1 h-32 rounded-2xl bg-gradient-to-tr from-teal-900 via-slate-800 to-amber-900/60 p-3 flex flex-col justify-end border border-teal-700/30">
              <span className="rounded bg-black/40 backdrop-blur px-1.5 py-0.5 text-[9px] text-teal-300 font-medium w-fit">Meetup</span>
              <h4 className="font-bold text-sm text-white mt-1">Weekend Badminton</h4>
              <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="h-2.5 w-2.5 text-teal-400" /> Play Arena, Bangalore
              </p>
            </div>

            {/* Details list */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-teal-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Date & Time</p>
                    <p className="font-medium text-white text-[11px]">Sat, 14 Oct • 8:00 AM</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-teal-400" />
                  <div>
                    <p className="text-[10px] text-slate-400">Attendees</p>
                    <p className="font-medium text-white text-[11px]">6 Going • 2 Maybe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full rounded-2xl bg-teal-500 py-2.5 text-center font-bold text-slate-950 text-xs shadow-md">
            I&apos;m Going ✨
          </button>
        </div>
      );

    case "groups":
      return (
        <div className="h-full w-full bg-[#0c1619] text-slate-100 flex flex-col p-3.5 pt-1 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-teal-900/40">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-slate-800 p-1 text-slate-300"><ChevronLeft className="h-3.5 w-3.5" /></span>
              <h3 className="font-heading font-bold text-white text-sm">Groups</h3>
            </div>
            <span className="rounded-full bg-teal-500/20 p-1 text-teal-400"><Plus className="h-3.5 w-3.5" /></span>
          </div>

          <div className="flex gap-2 mt-2 border-b border-slate-800 pb-1.5">
            <span className="text-[11px] font-semibold text-teal-400 border-b-2 border-teal-400 pb-1">My Groups</span>
            <span className="text-[11px] text-slate-400 pb-1">Discover</span>
          </div>

          <div className="mt-2.5 space-y-2 overflow-y-auto">
            {[
              { name: "Bangalore Foodies", members: "128 members • 24 events", emoji: "🍲", tag: "Food" },
              { name: "Weekend Trekkers", members: "356 members • 18 events", emoji: "⛰️", tag: "Outdoors" },
              { name: "Book Club & Coffee", members: "420 members • 12 events", emoji: "📚", tag: "Culture" },
              { name: "Photography Walks", members: "630 members • 35 events", emoji: "📸", tag: "Creative" },
            ].map((grp, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-slate-900/90 border border-slate-800 p-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-teal-900/60 border border-teal-700/50 flex items-center justify-center text-sm">
                    {grp.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">{grp.name}</h4>
                    <p className="text-[9px] text-slate-400">{grp.members}</p>
                  </div>
                </div>
                <button className="rounded-full bg-teal-500 px-3 py-1 font-semibold text-slate-950 text-[10px]">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      );

    case "create-event":
      return (
        <div className="h-full w-full bg-white text-slate-900 flex flex-col justify-between p-3.5 pt-1 text-xs">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="rounded-full bg-slate-100 p-1 text-slate-600"><ChevronLeft className="h-3.5 w-3.5" /></span>
              <h3 className="font-heading font-bold text-slate-900 text-sm">Create Event</h3>
            </div>

            <div className="mt-3 space-y-2.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Event Title</label>
                <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-700 font-medium">
                  Brunch at Third Wave
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Date & Time</label>
                <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-700">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-teal-600" /> Sun, 22 Oct • 11:30 AM</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Venue / Suggestions</label>
                <div className="mt-1 flex items-center justify-between rounded-xl border border-teal-500/50 bg-teal-50/50 px-2.5 py-1.5 text-[11px] text-teal-800">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-teal-600" /> Third Wave Coffee, Indiranagar</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Description</label>
                <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-[10px] text-slate-500">
                  Catching up over iced coffees & breakfast bowls!
                </div>
              </div>
            </div>
          </div>

          <button className="w-full rounded-2xl bg-teal-600 py-2.5 text-center font-bold text-white text-xs shadow-md">
            Publish Event
          </button>
        </div>
      );

    case "around-you-map":
      return (
        <div className="h-full w-full bg-[#0a1417] text-slate-100 flex flex-col justify-between p-3.5 pt-1 text-xs">
          <div>
            {/* Search header */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-1.5 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-teal-400 ml-1" />
              <span className="text-[10px] text-slate-400">Search events, venues, groups...</span>
            </div>

            {/* Filter chips */}
            <div className="flex gap-1.5 mt-2 overflow-x-hidden">
              <span className="rounded-full bg-teal-500 text-slate-950 font-bold px-2.5 py-0.5 text-[10px]">Events</span>
              <span className="rounded-full bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px]">Today</span>
              <span className="rounded-full bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px]">This Week</span>
              <span className="rounded-full bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px]">Free</span>
            </div>

            {/* Map Canvas */}
            <div className="relative mt-2 h-44 rounded-2xl bg-[#071114] border border-teal-900/30 overflow-hidden">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:10px_10px]" />
              
              {/* Radius ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-28 w-28 rounded-full border border-teal-400/20 bg-teal-500/5 animate-pulse" />
              
              {/* Current Location Blue Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-teal-400 ring-4 ring-teal-400/30" />

              {/* Surrounding Pins */}
              <div className="absolute top-8 left-12 h-6 w-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-lg">☕</div>
              <div className="absolute top-10 right-14 h-6 w-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-lg">🎬</div>
              <div className="absolute bottom-8 right-16 h-6 w-6 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-lg">⚽</div>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="rounded-2xl bg-slate-900 border border-teal-800/40 p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-[11px]">Coffee & Conversations</h4>
                <p className="text-[9px] text-teal-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-2.5 w-2.5" /> Indiranagar, Bangalore • Sat, 4:00 PM
                </p>
              </div>
              <span className="rounded-full bg-teal-500/20 p-1 text-teal-400"><Heart className="h-3 w-3" /></span>
            </div>
          </div>
        </div>
      );
  }
}
