"use client";

import { useReminders, useRecentChats, useUpcomingEvents } from "@/hooks/useData";
import { MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function QuickPanel() {
    const { data: reminders } = useReminders();
    const { data: chats } = useRecentChats();
    const { data: nextEvents } = useUpcomingEvents(1);
    const nextEvent = nextEvents?.[0];

    return (
        <aside className="hidden w-[300px] flex-col overflow-y-auto border-l border-gray-200 bg-white p-6 xl:flex">
            {/* Quick Reminders */}
            <div className="mb-8">
                <h3 className="mb-4 text-sm font-bold text-gray-900">Quick Reminders</h3>
                <div className="space-y-3">
                    {reminders?.map((reminder) => (
                        <div key={reminder.id} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                            <div className={`w-1 self-stretch rounded-full ${reminder.type === 'rsvp' ? 'bg-orange-400' : 'bg-indigo-500'}`}></div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">{reminder.title}</h4>
                                <p className="text-xs text-gray-500">{reminder.timeAgo}</p>
                            </div>
                        </div>
                    ))}
                    {!reminders?.length && <p className="text-sm text-gray-500">No reminders.</p>}
                </div>
            </div>

            {/* Recent Chats */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900">Recent Chats</h3>
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">VIEW ALL</button>
                </div>
                <div className="space-y-4">
                    {chats?.map((chat) => (
                        <div key={chat.id} className="flex items-start gap-3">
                            <img src={chat.senderAvatarUrl || "https://ui-avatars.com/api/?name=" + chat.senderName} className="h-8 w-8 rounded-full" alt="" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">{chat.senderName}</h4>
                                    <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{chat.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Event Location */}
            {nextEvent && (
                <div>
                    <h3 className="mb-4 text-sm font-bold text-gray-900">Next Event Location</h3>
                    <div className="group relative h-40 w-full overflow-hidden rounded-xl bg-gray-200">
                        <img
                            src={nextEvent.locationImageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"}
                            alt="Location"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-white/90 p-3 backdrop-blur-sm m-2 rounded-lg">
                            <h4 className="text-sm font-bold text-gray-900">{nextEvent.locationName}</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{nextEvent.locationAddress}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
