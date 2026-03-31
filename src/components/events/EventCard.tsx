"use client";

import { Event, RSVPStatus } from "@/types";
import { useRSVP } from "@/hooks/useData";
import { format, isValid } from "date-fns";
import { MapPin, Clock, Calendar, ChevronDown, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import Link from "next/link";

interface EventCardProps {
    event: Event;
    featured?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
    going: "text-green-600 bg-green-50",
    maybe: "text-yellow-600 bg-yellow-50",
    not_going: "text-red-600 bg-red-50",
};

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
    going: CheckCircle,
    maybe: HelpCircle,
    not_going: XCircle,
};

const STATUS_LABELS: Record<string, string> = {
    going: "Going",
    maybe: "Maybe",
    not_going: "Not Going",
};

const RSVP_OPTIONS: RSVPStatus[] = ["going", "maybe", "not_going"];

export function EventCard({ event, featured }: EventCardProps) {
    const { mutate: rsvp } = useRSVP();
    const [expanded, setExpanded] = useState(false);

    const StatusIcon = STATUS_ICONS[event.rsvpStatus] || Clock;

    const handleRSVP = (status: RSVPStatus) => {
        if (!event.id) return;
        rsvp({ eventId: event.id, status });
    };

    // Safely parse and validate the date
    const dateObj = event.startTime ? new Date(event.startTime) : null;
    const isDateValid = dateObj && isValid(dateObj);

    if (featured) {
        return (
            <div className="min-w-[300px] snap-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-md bg-[#E6F4F1] px-2.5 py-1 text-xs font-semibold text-[#1F7A63]">
                        {event.groupName}
                    </span>
                    {event.attendeeCount && (
                        <div className="flex items-center -space-x-2">
                            <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-200"></div>
                            <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-300"></div>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] text-gray-600">+{event.attendeeCount}</span>
                        </div>
                    )}
                </div>

                <h3 className="mb-1.5 text-lg font-bold text-gray-900">{event.title}</h3>

                <div className="mb-3 space-y-1.5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{isDateValid ? format(dateObj, "EEE, MMM d • h:mm a") : "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.locationName}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                    <div className={cn("flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium", STATUS_COLORS[event.rsvpStatus] || "text-gray-500 bg-gray-50")}>
                        <StatusIcon className="h-3 w-3" />
                        <span>{STATUS_LABELS[event.rsvpStatus] || event.rsvpStatus}</span>
                    </div>
                    <Link href={`/events/${event.id}`} className="text-sm font-semibold text-[#1F7A63] hover:text-[#16614F]">
                        View Details
                    </Link>
                </div>
            </div>
        );
    }

    // List View Card
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md">
            <div className="flex gap-3">
                {/* Date Block */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-[#E6F4F1] px-3 py-1.5 text-[#1F7A63] min-w-[50px]">
                    <span className="text-xs font-bold uppercase">{isDateValid ? format(dateObj, "MMM") : "TBD"}</span>
                    <span className="text-xl font-bold">{isDateValid ? format(dateObj, "dd") : "-"}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                            <p className="text-xs text-[#1F7A63] font-medium">{event.groupName}</p>
                        </div>
                        {/* MVP RSVP Dropdown */}
                        <div className="relative group">
                            <button className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors hover:bg-opacity-80", STATUS_COLORS[event.rsvpStatus] || "text-gray-500 bg-gray-50")}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                <span>{STATUS_LABELS[event.rsvpStatus] || event.rsvpStatus}</span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </button>
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-1 hidden w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block z-10">
                                {RSVP_OPTIONS.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleRSVP(status)}
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {STATUS_LABELS[status]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-1.5 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-3">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{isDateValid ? format(dateObj, "h:mm a") : "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{event.locationName}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Actions */}
            <div className="mt-2.5 flex justify-end">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                >
                    {expanded ? "Show Less" : "Show Actions"}
                </button>
            </div>

            {expanded && (
                <div className="mt-2.5 grid grid-cols-4 gap-2 border-t border-gray-100 pt-2.5">
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
