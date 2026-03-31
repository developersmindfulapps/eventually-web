"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    useGroup,
    useGroupEvents,
    useGroupMembers,
    useGroupMutations,
} from "@/hooks/useData";
import { ChevronLeft, CalendarX, Copy, Check, Pencil, Trash2, UserPlus, Plus } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { cn } from "@/lib/cn";

type Tab = "events" | "past" | "members";

// ─── Small reusable inline components ────────────────────────────────────────

function InitialsAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
    return (
        <div
            className={cn(
                "flex flex-shrink-0 items-center justify-center rounded-full bg-[#E6F4F1] font-bold text-[#1F7A63]",
                size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base"
            )}
        >
            {initials || "?"}
        </div>
    );
}

function RoleBadge({ role }: { role: "admin" | "member" }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                role === "admin"
                    ? "bg-[#E6F4F1] text-[#1F7A63]"
                    : "bg-gray-100 text-gray-500"
            )}
        >
            {role === "admin" ? "Admin" : "Member"}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GroupDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = (Array.isArray(params?.groupId) ? params.groupId[0] : params?.groupId) ?? "";

    // Tabs
    const [activeTab, setActiveTab] = useState<Tab>("events");

    // Create event modal
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Search
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Modals / confirmation state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput), 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    // Data fetching
    const { data: group, isLoading: isGroupLoading } = useGroup(groupId);
    const { data: events, isLoading: isEventsLoading } = useGroupEvents(groupId);
    const { data: members, isLoading: isMembersLoading } = useGroupMembers(groupId);
    const { editGroup, inviteMembers, deleteGroup } = useGroupMutations(groupId);

    // Pre-fill edit form when group loads
    useEffect(() => {
        if (group) {
            setEditName(group.name);
            setEditDesc(group.description ?? "");
        }
    }, [group]);

    // Split events chronologically
    const nowIso = new Date().toISOString();
    const upcomingEvents = (events ?? []).filter(
        (e) => e.startTime && e.startTime > nowIso
    );
    const pastEvents = (events ?? []).filter(
        (e) => !e.startTime || e.startTime <= nowIso
    );

    // Search filter (Events tab only)
    const filteredUpcoming = upcomingEvents.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Detect if current user is admin
    const currentUserId =
        typeof window !== "undefined"
            ? (() => {
                  try {
                      // Pull from Supabase session in localStorage (key pattern: sb-*-auth-token)
                      const keys = Object.keys(localStorage).filter((k) =>
                          k.endsWith("-auth-token")
                      );
                      if (keys[0]) {
                          const session = JSON.parse(localStorage.getItem(keys[0]) ?? "{}");
                          return session?.user?.id ?? null;
                      }
                  } catch {
                      return null;
                  }
              })()
            : null;
    const currentMember = members?.find((m) => m.userId === currentUserId);
    const isAdmin = currentMember?.role === "admin";

    // ── Handlers ────────────────────────────────────────────────────────────

    const handleSaveEdit = useCallback(async () => {
        if (!editName.trim()) return;
        await editGroup.mutateAsync({ name: editName.trim(), description: editDesc.trim() || undefined });
        setShowEditModal(false);
    }, [editGroup, editName, editDesc]);

    const handleInvite = useCallback(async () => {
        setShowInviteModal(true);
        if (!inviteCode) {
            const res = await inviteMembers.mutateAsync(undefined);
            setInviteCode((res as any)?.inviteCode ?? null);
        }
    }, [inviteCode, inviteMembers]);

    const handleCopy = useCallback(() => {
        if (!inviteCode) return;
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [inviteCode]);

    const handleDelete = useCallback(async () => {
        await deleteGroup.mutateAsync(undefined);
        router.push("/groups");
    }, [deleteGroup, router]);

    // ── Loading skeleton ────────────────────────────────────────────────────

    if (isGroupLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 mx-auto max-w-3xl space-y-5">
                <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
                <div className="flex items-start gap-4">
                    <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200" />
                    <div className="space-y-2 flex-1">
                        <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-72 animate-pulse rounded bg-gray-100" />
                    </div>
                </div>
                <div className="flex gap-6 border-b pb-2">
                    {["w-16", "w-20", "w-16"].map((w, i) => (
                        <div key={i} className={`h-5 ${w} animate-pulse rounded bg-gray-100`} />
                    ))}
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <CalendarX className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Group not found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    This group doesn't exist or you don't have access.
                </p>
                <button
                    onClick={() => router.push("/groups")}
                    className="mt-6 text-sm font-semibold text-[#1F7A63] hover:underline"
                >
                    ← Back to My Groups
                </button>
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl">

                {/* Back button */}
                <button
                    onClick={() => router.push("/groups")}
                    className="mb-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Groups
                </button>

                {/* ── Group Header ─────────────────────────────────────────── */}
                <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#E6F4F1] text-2xl font-bold text-[#1F7A63]">
                        {group.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="truncate text-2xl font-bold text-gray-900">
                                    {group.name}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    {group.description || "No description provided."}
                                </p>
                            </div>
                            {/* Group Actions — visible to admin only */}
                            {isAdmin && (
                                <div className="flex flex-shrink-0 items-center gap-2">
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleInvite}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                    >
                                        <UserPlus className="h-3.5 w-3.5" />
                                        Invite
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Tabs ─────────────────────────────────────────────────── */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Group tabs">
                        {(
                            [
                                { key: "events", label: "Events", count: upcomingEvents.length },
                                { key: "past", label: "Past Events", count: pastEvents.length },
                                { key: "members", label: "Members", count: members?.length ?? 0 },
                            ] as { key: Tab; label: string; count: number }[]
                        ).map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={cn(
                                    "whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                                    activeTab === key
                                        ? "border-[#1F7A63] text-[#1F7A63]"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                )}
                            >
                                {label}
                                <span
                                    className={cn(
                                        "ml-2 rounded-full px-2 py-0.5 text-xs",
                                        activeTab === key
                                            ? "bg-[#E6F4F1] text-[#1F7A63]"
                                            : "bg-gray-100 text-gray-600"
                                    )}
                                >
                                    {count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* ── Tab: Events ──────────────────────────────────────────── */}
                {activeTab === "events" && (
                    <div className="space-y-4">
                        {/* Row: search + create button */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search upcoming events..."
                                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[#1F7A63] focus:outline-none focus:ring-1 focus:ring-[#1F7A63]"
                            />
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F7A63]/30 bg-[#E6F4F1] px-4 py-2.5 text-sm font-semibold text-[#1F7A63] shadow-sm transition hover:bg-[#d0ede7] whitespace-nowrap"
                            >
                                <Plus className="h-4 w-4" />
                                Create Event
                            </button>
                        </div>
                        {isEventsLoading ? (
                            <LoadingSkeleton />
                        ) : filteredUpcoming.length === 0 ? (
                            <EmptyState
                                message={
                                    searchQuery
                                        ? `No events matching "${searchQuery}".`
                                        : "No upcoming events."
                                }
                            />
                        ) : (
                            filteredUpcoming.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                        )}
                    </div>
                )}

                {/* ── Tab: Past Events ─────────────────────────────────────── */}
                {activeTab === "past" && (
                    <div className="space-y-4">
                        {isEventsLoading ? (
                            <LoadingSkeleton />
                        ) : pastEvents.length === 0 ? (
                            <EmptyState message="No past events." />
                        ) : (
                            pastEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                        )}
                    </div>
                )}

                {/* ── Tab: Members ─────────────────────────────────────────── */}
                {activeTab === "members" && (
                    <div className="space-y-2">
                        {isMembersLoading ? (
                            <LoadingSkeleton />
                        ) : !members || members.length === 0 ? (
                            <EmptyState message="No members found." />
                        ) : (
                            members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                                >
                                    <InitialsAvatar name={member.name} size="sm" />
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {member.name}
                                        </p>
                                    </div>
                                    <RoleBadge role={member.role} />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* ── Create Event Modal ───────────────────────────────────────── */}
            {showCreateModal && (
                <CreateEventModal
                    groupId={groupId}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* ── Edit Modal ───────────────────────────────────────────────── */}
            {showEditModal && (
                <Modal title="Edit Group" onClose={() => setShowEditModal(false)}>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#1F7A63] focus:outline-none focus:ring-1 focus:ring-[#1F7A63]"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                Description
                            </label>
                            <textarea
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                rows={3}
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#1F7A63] focus:outline-none focus:ring-1 focus:ring-[#1F7A63]"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={!editName.trim() || editGroup.isPending}
                                className="rounded-full bg-[#1F7A63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#196652] disabled:opacity-50"
                            >
                                {editGroup.isPending ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── Invite Modal ─────────────────────────────────────────────── */}
            {showInviteModal && (
                <Modal title="Invite Members" onClose={() => setShowInviteModal(false)}>
                    {inviteMembers.isPending ? (
                        <p className="text-sm text-gray-500">Generating invite code…</p>
                    ) : inviteCode ? (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">
                                Share this code with your friends to join the group.
                            </p>
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                                <span className="flex-1 font-mono text-lg font-bold tracking-widest text-gray-900">
                                    {inviteCode}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    {copied ? (
                                        <><Check className="h-3.5 w-3.5 text-green-600" /> Copied</>
                                    ) : (
                                        <><Copy className="h-3.5 w-3.5" /> Copy</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-red-500">Failed to generate invite code.</p>
                    )}
                </Modal>
            )}

            {/* ── Delete Confirm ───────────────────────────────────────────── */}
            {showDeleteConfirm && (
                <Modal title="Delete Group" onClose={() => setShowDeleteConfirm(false)}>
                    <p className="mb-5 text-sm text-gray-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-gray-900">{group.name}</span>? This
                        action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleteGroup.isPending}
                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {deleteGroup.isPending ? "Deleting…" : "Delete Group"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ─── Shared helper components ─────────────────────────────────────────────────

function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2].map((i) => (
                <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-gray-100" />
            ))}
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-sm font-medium text-gray-500">{message}</p>
        </div>
    );
}
