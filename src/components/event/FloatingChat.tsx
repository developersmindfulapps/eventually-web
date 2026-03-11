"use client";

import { MessageSquare, X, Minus } from "lucide-react";
import { useState } from "react";
import { User } from "@/types";

interface FloatingChatProps {
    currentUser: User | null;
}

export function FloatingChat({ currentUser }: FloatingChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-50"
            >
                <MessageSquare className="h-6 w-6" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-0 right-6 z-50 flex w-80 flex-col bg-white shadow-2xl rounded-t-xl border border-gray-200 transition-all duration-300 ${isMinimized ? "h-12" : "h-[450px]"}`}>
            {/* Header */}
            <div
                className="flex items-center justify-between bg-indigo-600 px-4 py-3 rounded-t-xl cursor-pointer"
                onClick={() => setIsMinimized(!isMinimized)}
            >
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="h-2 w-2 rounded-full bg-green-400 absolute right-0 top-0 ring-1 ring-indigo-600"></div>
                        <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Messages</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                        className="p-1 text-indigo-200 hover:text-white"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        className="p-1 text-indigo-200 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {!isMinimized && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex items-center justify-center text-center">
                        <div className="space-y-2">
                            <div className="bg-indigo-100 rounded-full h-12 w-12 mx-auto flex items-center justify-center text-indigo-600">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <p className="text-sm text-gray-500">Your recent chats will appear here.</p>
                            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">Start a new conversation</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
