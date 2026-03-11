"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMyGroups } from "@/hooks/useData";

interface CreateEventModalProps {
    onClose: () => void;
}

export function CreateEventModal({ onClose }: CreateEventModalProps) {
    const [title, setTitle] = useState("");
    const [groupId, setGroupId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: groups } = useMyGroups();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !groupId) return;

        setLoading(true);
        setError("");

        try {
            // README: POST /api/events/group/:groupId
            const event: any = await apiFetch(`/events/group/${groupId}`, {
                method: "POST",
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    startTime: startTime ? new Date(startTime).toISOString() : undefined,
                }),
            });
            queryClient.invalidateQueries({ queryKey: ["events"] });
            onClose();
            router.push(`/events/${event.id}`);
        } catch (err: any) {
            setError(err.message || "Failed to create event. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">Create Event</h2>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Event Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Birthday Party"
                            className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Group <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            required
                        >
                            <option value="">Select a group…</option>
                            {groups?.map((g) => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Description <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's the occasion?"
                            rows={2}
                            className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title.trim() || !groupId}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loading ? "Creating…" : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
