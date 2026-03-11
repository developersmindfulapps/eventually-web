"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMyGroups } from "@/hooks/useData";
import { CreateGroupModal } from "@/components/dashboard/CreateGroupModal";

export function DashboardSidebar() {
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const { data: groups } = useMyGroups();
    const pathname = usePathname();

    return (
        <>
            <aside className="hidden w-[220px] flex-shrink-0 flex-col border-r border-gray-100 bg-white md:flex">
                {/* ── Create Group (sticky top) ── */}
                <div className="p-4">
                    <button
                        onClick={() => setShowCreateGroup(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F7A63] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16614F] transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Create Group
                    </button>
                </div>

                {/* ── My Groups label ── */}
                <div className="px-4 pb-2">
                    <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                            My Groups
                        </span>
                    </div>
                </div>

                {/* ── Groups list ── */}
                <nav className="flex-1 overflow-y-auto px-2 pb-4">
                    {groups?.map((group) => {
                        const initials = group.name.substring(0, 2).toUpperCase();
                        const active = pathname?.startsWith(`/groups/${group.id}`);
                        return (
                            <Link
                                key={group.id}
                                href={`/groups/${group.id}`}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-[#E6F4F1] text-[#1F7A63]"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                                        active ? "bg-[#1F7A63] text-white" : "bg-[#E6F4F1] text-[#1F7A63]"
                                    )}
                                >
                                    {initials}
                                </div>
                                <span className="truncate">{group.name}</span>
                            </Link>
                        );
                    })}

                    {groups?.length === 0 && (
                        <div className="px-2 py-6 text-center">
                            <p className="text-xs text-gray-400">No groups yet.</p>
                            <p className="mt-1 text-xs text-gray-400">
                                Create one to get started.
                            </p>
                        </div>
                    )}

                    {!groups && (
                        <div className="space-y-2 px-2 pt-1">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-9 animate-pulse rounded-lg bg-gray-100" />
                            ))}
                        </div>
                    )}
                </nav>
            </aside>

            {/* Create Group Modal */}
            {showCreateGroup && (
                <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
            )}
        </>
    );
}
