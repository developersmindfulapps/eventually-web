"use client";

import { useUpcomingEvents } from "@/hooks/useData";
import { EventCard } from "@/components/events/EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function FeaturedCarousel() {
    const { data: events, isLoading } = useUpcomingEvents(5);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 320; // width of card + gap
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (isLoading) {
        return <div className="h-64 w-full animate-pulse rounded-2xl bg-gray-100" />;
    }

    if (!events || events.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
                <p className="text-gray-500 mb-2">No upcoming featured events.</p>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Discover Groups</button>
            </div>
        );
    }

    return (
        <div className="relative group">
            <div className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                    onClick={() => scroll("left")}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 focus:outline-none"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-pl-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} featured />
                ))}
            </div>

            <div className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                    onClick={() => scroll("right")}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 focus:outline-none"
                >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}
