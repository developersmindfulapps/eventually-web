"use client";

import { ChatMessage, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { useEventMutations } from "@/hooks/useData";
import { Send } from "lucide-react";

interface EventChatProps {
    eventId: string;
    messages: ChatMessage[];
    currentUser: User | null;
}

export function EventChat({ eventId, messages, currentUser }: EventChatProps) {
    const { sendMessage } = useEventMutations();
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        sendMessage.mutate({ eventId, message: newMessage });
        setNewMessage("");
    };

    return (
        <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`flex max-w-[80%] gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                <img
                                    src={msg.senderAvatarUrl || `https://ui-avatars.com/api/?name=${msg.senderName}`}
                                    alt={msg.senderName}
                                    className="h-8 w-8 rounded-full border border-gray-200 self-end"
                                />
                                <div>
                                    <div className={`p-3 rounded-2xl text-sm ${isMe
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm"
                                        }`}>
                                        <p>{msg.content}</p>
                                    </div>
                                    <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>
                                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="border-t border-gray-200 bg-white p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
