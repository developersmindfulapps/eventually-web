"use client";

import { useState } from "react";
import { useUpcomingEvents } from "@/hooks/useData";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { EventList } from "@/components/events/EventList";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { useAuth } from "@/components/providers/AuthProvider";
import { getGreeting, getUserDisplayName } from "@/lib/auth/getUser";

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: upcomingEvents } = useUpcomingEvents(5);

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

                {/* Your Upcoming Events */}
                <div>
                    <h2 className="mb-3 text-base font-bold text-gray-900">Your upcoming events</h2>
                    <FeaturedCarousel />
                </div>

                {/* Explore Events */}
                <div>
                    <h2 className="mb-3 text-base font-bold text-gray-900">Explore events</h2>
                    <EventList filters={{ search: "", groupId: "all", month: "", sort: "createdAt", isExplore: true }} />
                </div>
            </div>

            {/* Chat widget only — no Create Event FAB */}
            <ChatWidget />
        </div>
    );
}
