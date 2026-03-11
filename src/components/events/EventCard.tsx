"use client";

import { Event, RSVPStatus } from "@/types";
import { useRSVP } from "@/hooks/useData";
import { format } from "date-fns";
import { MapPin, Clock, Calendar, ChevronDown, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import Link from "next/link";

interface EventCardProps {
    event: Event;
    featured?: boolean;
}

export function EventCard({ event, featured }: EventCardProps) {
    const { mutate: rsvp } = useRSVP();
    const [expanded, setExpanded] = useState(false);

    const statusColors = {
        going: "text-green-600 bg-green-50",
        maybe: "text-yellow-600 bg-yellow-50",
        no: "text-red-600 bg-red-50",
        pending: "text-gray-500 bg-gray-50",
    };

    const statusIcons = {
        going: CheckCircle,
        maybe: HelpCircle,
        no: XCircle,
        pending: Clock, // placeholder
    };

    const StatusIcon = statusIcons[event.rsvpStatus] || Clock;

    const handleRSVP = (status: RSVPStatus) => {
        rsvp({ eventId: event.id, status });
    };

    if (featured) {
        return (
            <div className="min-w-[300px] snap-center rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {event.groupName}
                    </span>
                    {event.attendeeCount && (
                        <div className="flex items-center -space-x-2">
                            {/* Mock avatars */}
                            <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-200"></div>
                            <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-300"></div>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] text-gray-600">+{event.attendeeCount}</span>
                        </div>
                    )}
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900">{event.title}</h3>

                <div className="mb-4 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.startTime), "EEE, MMM d • h:mm a")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.locationName}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className={cn("flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium", statusColors[event.rsvpStatus])}>
                        <StatusIcon className="h-3 w-3" />
                        <span className="capitalize">{event.rsvpStatus}</span>
                    </div>
                    <Link href={`/events/${event.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                        View Details
                    </Link>
                </div>
            </div>
        );
    }

    // List View Card
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex gap-4">
                {/* Date Block */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700">
                    <span className="text-xs font-bold uppercase">{format(new Date(event.startTime), "MMM")}</span>
                    <span className="text-xl font-bold">{format(new Date(event.startTime), "dd")}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                            <p className="text-xs text-indigo-600 font-medium">{event.groupName}</p>
                        </div>
                        {/* MVP RSVP Dropdown */}
                        <div className="relative group">
                            <button className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors hover:bg-opacity-80", statusColors[event.rsvpStatus])}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                <span className="capitalize">{event.rsvpStatus}</span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </button>
                            {/* Dropdown Menu - Simple hover implementation for now */}
                            <div className="absolute right-0 mt-1 hidden w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block z-10">
                                {["going", "maybe", "no"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleRSVP(status as RSVPStatus)}
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 capitalize"
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-4">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{format(new Date(event.startTime), "h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{event.locationName}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Actions */}
            <div className="mt-3 flex justify-end">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                >
                    {expanded ? "Show Less" : "Show Actions"}
                </button>
            </div>

            {expanded && (
                <div className="mt-3 grid grid-cols-4 gap-2 border-t border-gray-100 pt-3">
                    <Link href={`/events/${event.id}`} className="col-span-1 flex flex-col items-center justify-center gap-1 rounded-lg bg-gray-50 p-2 hover:bg-gray-100">
                        <span className="text-[10px] font-medium text-gray-600">Details</span>
                    </Link>
                    <button className="col-span-1 flex flex-col items-center justify-center gap-1 rounded-lg bg-gray-50 p-2 hover:bg-gray-100">
                        <span className="text-[10px] font-medium text-gray-600">Chat</span>
                    </button>
                    <button className="col-span-1 flex flex-col items-center justify-center gap-1 rounded-lg bg-gray-50 p-2 hover:bg-gray-100">
                        <span className="text-[10px] font-medium text-gray-600">Directions</span>
                    </button>
                    <button className="col-span-1 flex flex-col items-center justify-center gap-1 rounded-lg bg-gray-50 p-2 hover:bg-gray-100">
                        <span className="text-[10px] font-medium text-gray-600">Calendar</span>
                    </button>
                </div>
            )}
        </div>
    );
}
