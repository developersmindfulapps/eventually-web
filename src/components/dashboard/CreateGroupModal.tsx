"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createGroup } from "@/lib/api/groups";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface CreateGroupModalProps {
    onClose: () => void;
}

export function CreateGroupModal({ onClose }: CreateGroupModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError("");

        try {
            const payload = { name: name.trim(), description: description.trim() || undefined };
            console.log("[CreateGroup] Sending payload:", payload);

            const group = await createGroup(payload);
            console.log("[CreateGroup] Created successfully:", group);

            // Invalidate groups query so sidebar + groups page refresh
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            onClose();
            router.push(`/groups/${group.id}`);
        } catch (err: any) {
            console.error("[CreateGroup] Error:", err);
            setError(err.message || "Failed to create group. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">Create Group</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Group Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Birthday Squad"
                            className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1F7A63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F7A63]/20"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Description <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this group about?"
                            rows={3}
                            className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1F7A63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F7A63]/20 resize-none"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#1F7A63] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16614F] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loading ? "Creating…" : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
