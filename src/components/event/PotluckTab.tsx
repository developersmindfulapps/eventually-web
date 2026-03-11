"use client";

import { useState } from "react";
import { PotluckItem, User } from "@/types";
import { useEventMutations } from "@/hooks/useData";
import { Plus, Check, X } from "lucide-react";
// Assuming we have a current user context or hook, for now passing as prop or mocking
// In real app, useAuth or similar.

interface PotluckTabProps {
    eventId: string;
    items: PotluckItem[];
    currentUser: User | null;
}

export function PotluckTab({ eventId, items, currentUser }: PotluckTabProps) {
    const { claimPotluckItem } = useEventMutations();
    const [newItemName, setNewItemName] = useState("");
    // Admin add item logic would go here (mutation not yet in hook but easy to add)

    const handleClaim = (itemId: string) => {
        claimPotluckItem.mutate({ eventId, itemId });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 shadow-sm sm:rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Potluck Items</h2>
                    <button className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                        <Plus className="h-4 w-4" />
                        <span>Add Item</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {items.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No items yet. Be the first to add something!</p>
                    )}

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
                        >
                            <span className="font-medium text-gray-900">{item.name}</span>

                            {item.claimedBy ? (
                                <div className="flex items-center gap-2">
                                    <img
                                        src={item.claimedBy.avatarUrl || `https://ui-avatars.com/api/?name=${item.claimedBy.name}`}
                                        alt={item.claimedBy.name}
                                        className="h-6 w-6 rounded-full"
                                    />
                                    <span className="text-sm text-gray-500 line-through md:no-line-through">
                                        {item.claimedBy.userId === currentUser?.id ? "You" : item.claimedBy.name}
                                    </span>
                                    {item.claimedBy.userId === currentUser?.id && (
                                        <button
                                            onClick={() => {/* Unclaim logic */ }}
                                            className="ml-2 text-xs text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleClaim(item.id)}
                                    className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                                >
                                    Claim
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
