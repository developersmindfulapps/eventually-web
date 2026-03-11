"use client";

import { useEventsInfinite } from "@/hooks/useData";
import { EventRow } from "@/components/home/EventRow";
import { useEffect, useRef } from "react";
// Since I don't see mantine in package.json, I'll use a simple custom hook logic or standard IntersectionObserver.

export function EventList({ filters }: { filters: any }) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useEventsInfinite(filters);

    // Intersection Observer for infinite scroll
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === "pending") {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 w-full animate-pulse rounded-xl bg-gray-100" />
                ))}
            </div>
        );
    }

    if (status === "error") {
        return <div className="py-10 text-center text-red-500">Error loading events.</div>;
    }

    const events = data?.pages.flatMap((page) => page) || [];

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                <div className="mt-6">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create Event
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {events.map((event) => (
                <EventRow key={event.id} event={event} />
            ))}

            {/* Loading Indicator for next page */}
            <div ref={observerTarget} className="h-4 w-full">
                {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
