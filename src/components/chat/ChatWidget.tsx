"use client";

import { MessageSquare, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRecentChats } from "@/hooks/useData";
import { cn } from "@/lib/cn";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: chats } = useRecentChats();

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                    isOpen && "hidden" // Hide when modal is open, or keep it? Design says modal.
                )}
            >
                <MessageSquare className="h-6 w-6" />
            </button>

            {/* Chat Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative z-50 flex h-[600px] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl transition-all sm:h-[500px]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 p-4">
                            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat List (simplified for MVP) */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-2">
                                {chats?.map((chat) => (
                                    <button
                                        key={chat.id}
                                        className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <img src={chat.senderAvatarUrl || "https://ui-avatars.com/api/?name=" + chat.senderName} className="h-10 w-10 rounded-full" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-semibold text-gray-900 truncate">{chat.senderName}</h4>
                                                <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{chat.content}</p>
                                        </div>
                                    </button>
                                ))}
                                {!chats?.length && (
                                    <div className="text-center py-8">
                                        <MessageSquare className="mx-auto h-8 w-8 text-gray-300" />
                                        <p className="mt-2 text-sm text-gray-500">No recent messages</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer / Input (Placeholder) */}
                        <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-2xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    className="block w-full rounded-full border-0 bg-white py-2 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <SearchIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
    )
}
