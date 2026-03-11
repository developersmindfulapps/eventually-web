"use client";

import { useState } from "react";
import { useUpcomingEvents, useMyEvents } from "@/hooks/useData";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { FiltersBar } from "@/components/home/FiltersBar";
import { EventRow } from "@/components/home/EventRow";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { useAuth } from "@/components/providers/AuthProvider";
import { getGreeting, getUserDisplayName } from "@/lib/auth/getUser";

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: upcomingEvents } = useUpcomingEvents(5);

    const [search, setSearch] = useState("");
    const [groupId, setGroupId] = useState("all");
    const [sort, setSort] = useState("upcoming");

    const { data: events, isLoading: eventsLoading } = useMyEvents({ search, groupId, sort });

    const displayName = getUserDisplayName(user);
    const greeting = getGreeting(displayName);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl space-y-8">
                {/* Greeting */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{greeting}</h1>
                    <p className="mt-1 text-sm text-gray-400">
                        {upcomingEvents?.length
                            ? `You have ${upcomingEvents.length} upcoming event${upcomingEvents.length > 1 ? "s" : ""} this week.`
                            : "No upcoming events — create one to get started."}
                    </p>
                </div>

                {/* Featured Events */}
                <div>
                    <h2 className="mb-3 text-base font-bold text-gray-900">Featured Events</h2>
                    <FeaturedCarousel />
                </div>

                {/* Search & Filter */}
                <FiltersBar
                    search={search}
                    setSearch={setSearch}
                    groupId={groupId}
                    setGroupId={setGroupId}
                    sort={sort}
                    setSort={setSort}
                />

                {/* Events List */}
                <div className="space-y-3 pb-10">
                    {eventsLoading &&
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-28 w-full animate-pulse rounded-xl bg-gray-100" />
                        ))}

                    {events?.map((event) => (
                        <EventRow key={event.id} event={event} />
                    ))}

                    {!eventsLoading && events?.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
                            <p className="text-sm text-gray-400">No events found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat widget only — no Create Event FAB */}
            <ChatWidget />
        </div>
    );
}
