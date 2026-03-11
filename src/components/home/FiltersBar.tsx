"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";

interface FiltersBarProps {
    search: string;
    setSearch: (value: string) => void;
    groupId: string;
    setGroupId: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
}

export function FiltersBar({ search, setSearch, groupId, setGroupId, sort, setSort }: FiltersBarProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-md border-0 bg-white py-1.5 pl-9 pr-2 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm"
                    placeholder="Search all events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-2">
                <div className="relative">
                    <select
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        className="appearance-none block w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm"
                    >
                        <option value="all">All Groups</option>
                        {/* Groups should be fetched and mapped here ideally */}
                    </select>
                    <Filter className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                <div className="relative">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="appearance-none block w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm"
                    >
                        <option value="upcoming">Sort: Upcoming</option>
                        <option value="newest">Sort: Newest</option>
                    </select>
                    <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
            </div>
        </div>
    );
}
