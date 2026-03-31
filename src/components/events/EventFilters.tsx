"use client";

import { useState, useEffect } from "react";

import { Search, Filter, Calendar as CalendarIcon, ArrowUpDown } from "lucide-react";
import { useMyGroups } from "@/hooks/useData";

interface EventFiltersProps {
    filters: {
        search: string;
        groupId: string;
        month: string;
        sort: string;
    };
    setFilter: (key: string, value: string) => void;
}

export function EventFilters({ filters, setFilter }: EventFiltersProps) {
    const { data: groups } = useMyGroups();
    
    // Local state for debouncing
    const [localSearch, setLocalSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.search !== localSearch) {
                setFilter("search", localSearch);
            }
        }, 400); // 400ms debounce

        return () => clearTimeout(timer);
    }, [localSearch, filters.search, setFilter]);

    const months = [
        { value: "", label: "All Months" },
        { value: "0", label: "January" },
        { value: "1", label: "February" },
        { value: "2", label: "March" },
        { value: "3", label: "April" },
        { value: "4", label: "May" },
        { value: "5", label: "June" },
        { value: "6", label: "July" },
        { value: "7", label: "August" },
        { value: "8", label: "September" },
        { value: "9", label: "October" },
        { value: "10", label: "November" },
        { value: "11", label: "December" },
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm"
                    placeholder="Search events by name, group, or location..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col gap-2 sm:flex-row">
                {/* Group Filter */}
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                        value={filters.groupId}
                        onChange={(e) => setFilter("groupId", e.target.value)}
                        className="block w-full appearance-none rounded-lg border-0 bg-white py-2.5 pl-9 pr-8 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm shadow-sm"
                    >
                        <option value="all">All Groups</option>
                        {groups?.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Month Filter */}
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                        value={filters.month}
                        onChange={(e) => setFilter("month", e.target.value)}
                        className="block w-full appearance-none rounded-lg border-0 bg-white py-2.5 pl-9 pr-8 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm shadow-sm"
                    >
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort */}
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                        value={filters.sort}
                        onChange={(e) => setFilter("sort", e.target.value)}
                        className="block w-full appearance-none rounded-lg border-0 bg-white py-2.5 pl-9 pr-8 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm shadow-sm"
                    >
                        <option value="createdAt">Sort: Newly Created</option>
                        <option value="datetime">Sort: Upcoming First</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
