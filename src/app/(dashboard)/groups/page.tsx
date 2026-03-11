"use client";

import { useMyGroups } from "@/hooks/useData";
import { Users } from "lucide-react";
import Link from "next/link";

export default function GroupsPage() {
    const { data: groups, isLoading } = useMyGroups();

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
                    <p className="text-sm text-gray-400">All the communities you belong to.</p>
                </div>

                {isLoading && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-gray-100" />
                        ))}
                    </div>
                )}

                {!isLoading && groups && groups.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {groups.map((group) => (
                            <Link
                                key={group.id}
                                href={`/groups/${group.id}`}
                                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-[#1F7A63]/30 hover:shadow-md transition-all"
                            >
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E6F4F1] text-base font-bold text-[#1F7A63]">
                                    {group.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate font-semibold text-gray-900 text-sm">{group.name}</h3>
                                    {group.description && (
                                        <p className="truncate text-xs text-gray-400">{group.description}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!isLoading && (!groups || groups.length === 0) && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
                        <Users className="mx-auto mb-3 h-9 w-9 text-gray-200" />
                        <p className="font-medium text-gray-500 text-sm">No groups yet.</p>
                        <p className="mt-1 text-xs text-gray-400">Use the sidebar to create your first group.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
