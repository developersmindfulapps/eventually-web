"use client";

import { useState } from "react";
import { EventFilters } from "@/components/events/EventFilters";
import { EventList } from "@/components/events/EventList";

export default function EventsPage() {
    const [filters, setFilters] = useState({
        search: "",
        groupId: "all",
        month: "",
        sort: "upcoming",
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
                    <p className="text-sm text-gray-400">Discover and manage your upcoming activities.</p>
                </div>

                <EventFilters filters={filters} setFilter={handleFilterChange} />
                <EventList filters={{ ...filters, search: filters.search }} />
            </div>
            {/* No FAB — Create Event happens via group detail page, matching mobile app flow */}
        </div>
    );
}
