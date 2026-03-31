"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { useMyGroups } from "@/hooks/useData";
import { Group } from "@/types";
import { cn } from "@/lib/cn";

const LAST_GROUP_KEY = "lastGroupId";

function getLastGroupId(): string | null {
    if (typeof window === "undefined") return null;
    try { return localStorage.getItem(LAST_GROUP_KEY); } catch { return null; }
}

function setLastGroupId(id: string) {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(LAST_GROUP_KEY, id); } catch { /* noop */ }
}

interface Props {
    /** Button label override */
    label?: string;
    /** Extra className applied to the trigger button */
    className?: string;
    /** Size variant */
    size?: "sm" | "md";
}

export function CreateEventButton({ label = "Create Event", className, size = "md" }: Props) {
    const router = useRouter();
    const { data: groups, isLoading } = useMyGroups();
    const [showPicker, setShowPicker] = useState(false);
    const [noGroupsWarning, setNoGroupsWarning] = useState(false);

    const navigate = useCallback((group: Group) => {
        setLastGroupId(group.id);
        setShowPicker(false);
        setNoGroupsWarning(false);
        router.push(`/groups/${group.id}/create-event`);
    }, [router]);

    const handleClick = useCallback(() => {
        if (isLoading) return;

        if (!groups || groups.length === 0) {
            setNoGroupsWarning(true);
            return;
        }

        if (groups.length === 1) {
            navigate(groups[0]);
            return;
        }

        // Multiple groups — check localStorage first
        const lastId = getLastGroupId();
        if (lastId) {
            const last = groups.find((g) => g.id === lastId);
            if (last) {
                navigate(last);
                return;
            }
        }

        // Show picker
        setShowPicker(true);
    }, [groups, isLoading, navigate]);

    const sizeClass = size === "sm"
        ? "px-3 py-1.5 text-xs"
        : "px-4 py-2.5 text-sm";

    return (
        <>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl font-semibold transition-colors disabled:opacity-50",
                    "bg-[#1F7A63] text-white hover:bg-[#196652] shadow-sm",
                    sizeClass,
                    className
                )}
            >
                <Plus className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
                {label}
            </button>

            {/* ── No groups warning ─────────────────────────────────────── */}
            {noGroupsWarning && (
                <Overlay onClose={() => setNoGroupsWarning(false)}>
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4F1]">
                            <Plus className="h-5 w-5 text-[#1F7A63]" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">No groups yet</p>
                            <p className="mt-1 text-sm text-gray-500">
                                Create a group first to start hosting events.
                            </p>
                        </div>
                        <button
                            onClick={() => { setNoGroupsWarning(false); router.push("/groups"); }}
                            className="rounded-full bg-[#1F7A63] px-5 py-2 text-sm font-semibold text-white hover:bg-[#196652]"
                        >
                            Go to My Groups
                        </button>
                    </div>
                </Overlay>
            )}

            {/* ── Group picker ──────────────────────────────────────────── */}
            {showPicker && groups && (
                <Overlay onClose={() => setShowPicker(false)}>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Select a group
                    </p>
                    <p className="mb-4 text-sm text-gray-600">Which group is this event for?</p>
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                        {groups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => navigate(group)}
                                className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left shadow-sm transition hover:border-[#1F7A63]/30 hover:bg-[#E6F4F1]/40"
                            >
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#E6F4F1] text-sm font-bold text-[#1F7A63]">
                                    {group.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="truncate text-sm font-semibold text-gray-900">
                                    {group.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </Overlay>
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl mx-4">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
                {children}
            </div>
        </div>
    );
}
