"use client";

import { Event, Attendee, RSVPStatus } from "@/types";
import { useRSVP } from "@/hooks/useData";
import { MapPin, Navigation, Calendar as CalendarIcon, Download, ChevronRight } from "lucide-react";

interface EventDetailsTabProps {
    event: Event;
    attendees?: Attendee[];
}

export function EventDetailsTab({ event, attendees }: EventDetailsTabProps) {
    const { mutate: rsvp } = useRSVP();

    const handleRSVP = (status: RSVPStatus) => {
        if (!event.id) return;
        rsvp({ eventId: event.id, status });
    };

    const statusColors: Record<string, string> = {
        going: "bg-green-100 text-green-700 border-green-200",
        maybe: "bg-yellow-100 text-yellow-700 border-yellow-200",
        not_going: "bg-red-100 text-red-700 border-red-200",
    };

    const statusLabel: Record<string, string> = {
        going: "Going",
        maybe: "Maybe",
        not_going: "Not Going",
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <section className="bg-white p-6 shadow-sm sm:rounded-xl">
                    <h2 className="text-lg font-bold text-gray-900">About Event</h2>
                    <p className="mt-2 text-gray-600 whitespace-pre-line">
                        {event.description || "No description provided."}
                    </p>
                </section>

                {/* Venue Card */}
                <section className="bg-white p-6 shadow-sm sm:rounded-xl">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Venue</h2>
                    {/* Finalized Venue Banner */}
                    {event.status === "finalized" && event.finalizedVenue && (
                        <div className="mb-4 rounded-lg border-2 border-[#1F7A63] bg-[#E6F4F1] p-3">
                            <p className="text-xs font-semibold text-[#1F7A63] mb-0.5">✅ Finalized Venue</p>
                            <p className="font-bold text-gray-900">{event.finalizedVenue.name}</p>
                            <p className="text-sm text-gray-600">{event.finalizedVenue.address}</p>
                        </div>
                    )}
                    <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <div className="h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#E6F4F1] flex text-[#1F7A63]">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{event.locationName || "TBD"}</h3>
                            <p className="text-sm text-gray-500">{event.locationAddress || "Address not available"}</p>

                            {(event.locationAddress || (event.finalizedVenue?.lat && event.finalizedVenue?.lng)) && (
                                <a
                                    href={
                                        event.finalizedVenue?.lat && event.finalizedVenue?.lng
                                            ? `https://www.google.com/maps/dir/?api=1&destination=${event.finalizedVenue.lat},${event.finalizedVenue.lng}`
                                            : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.locationAddress!)}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#1F7A63] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#16614F] transition-colors"
                                >
                                    <Navigation className="h-3.5 w-3.5" />
                                    Get Directions
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                {/* Attendees */}
                <section className="bg-white p-6 shadow-sm sm:rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Attendees ({attendees?.length || 0})</h2>
                        <button className="text-sm font-semibold text-[#1F7A63] hover:text-[#16614F]">View All</button>
                    </div>

                    <div className="flex -space-x-2 overflow-hidden py-2">
                        {attendees?.slice(0, 8).map((attendee) => (
                            <img
                                key={attendee.id}
                                className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                src={attendee.avatarUrl || `https://ui-avatars.com/api/?name=${attendee.name}`}
                                alt={attendee.name}
                                title={`${attendee.name} (${statusLabel[attendee.status] || attendee.status})`}
                            />
                        ))}
                        {(attendees?.length || 0) > 8 && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-xs font-bold text-gray-600">
                                +{attendees!.length - 8}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
                {/* RSVP Status Card */}
                <section className="bg-white p-6 shadow-sm sm:rounded-xl">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Your RSVP</h2>
                    <div className={`mb-4 px-3 py-2 rounded-lg border text-center text-sm font-semibold ${statusColors[event.rsvpStatus] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                        Status: {statusLabel[event.rsvpStatus] || event.rsvpStatus}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => handleRSVP("going")}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${event.rsvpStatus === 'going' ? 'bg-[#1F7A63] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Going
                        </button>
                        <button
                            onClick={() => handleRSVP("maybe")}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${event.rsvpStatus === 'maybe' ? 'bg-[#1F7A63] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Maybe
                        </button>
                        <button
                            onClick={() => handleRSVP("not_going")}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${event.rsvpStatus === 'not_going' ? 'bg-[#1F7A63] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Not Going
                        </button>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="bg-white p-6 shadow-sm sm:rounded-xl">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 text-left">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Add to Calendar</span>
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 text-left">
                            <Navigation className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Get Directions</span>
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 text-left">
                            <Download className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Export .ics</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
