"use client";

import { Share, Edit, Calendar, MapPin } from "lucide-react";
import { format, isValid } from "date-fns";
import { Event } from "@/types";
import { cn } from "@/lib/cn";

interface EventHeaderProps {
    event: Event;
    isHost?: boolean;
}

export function EventHeader({ event, isHost }: EventHeaderProps) {
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    const initial = event.title.charAt(0).toUpperCase();

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold text-indigo-600">
                        {initial}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{event.title}</h1>
                        <div className="mt-2 flex flex-col gap-1 text-gray-500 sm:flex-row sm:gap-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                <span className={cn(event.startTime && isValid(new Date(event.startTime)) ? "bg-[#E6F4F1] text-[#1F7A63]" : "bg-gray-100 text-gray-500", "flex h-6 w-6 items-center justify-center rounded-lg")}>
                                    <Calendar className="h-3.5 w-3.5" />
                                </span>
                                <span>
                                    {event.startTime && isValid(new Date(event.startTime))
                                        ? `${format(new Date(event.startTime), "EEEE, MMMM d")} • ${format(new Date(event.startTime), "h:mm a")}`
                                        : "Date TBD"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm">
                                <span>Hosted by <span className="font-semibold text-gray-900">{event.hostName || "Unknown"}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isHost && (
                        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Edit className="h-4 w-4" />
                            <span>Edit Event</span>
                        </button>
                    )}
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                    >
                        <Share className="h-4 w-4" />
                        <span>Share Invite</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
