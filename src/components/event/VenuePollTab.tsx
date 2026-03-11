"use client";

import { VenueVote } from "@/types";
import { useEventMutations } from "@/hooks/useData";
import { MapPin, ThumbsUp } from "lucide-react";

interface VenuePollTabProps {
    eventId: string;
    venues: VenueVote[];
}

export function VenuePollTab({ eventId, venues }: VenuePollTabProps) {
    const { voteVenue } = useEventMutations();

    const handleVote = (venueId: string) => {
        voteVenue.mutate({ eventId, venueId });
    };

    const totalVotes = venues.reduce((acc, v) => acc + v.voteCount, 0);

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Vote for Venue</h2>

            <div className="space-y-4">
                {venues.map((venue) => {
                    const percentage = totalVotes > 0 ? Math.round((venue.voteCount / totalVotes) * 100) : 0;

                    return (
                        <div key={venue.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
                            {/* Progress Bar Background */}
                            <div
                                className="absolute inset-y-0 left-0 bg-indigo-50 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 mt-0.5 text-indigo-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                                        <p className="text-sm text-gray-500">{venue.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">{percentage}%</div>
                                        <div className="text-xs text-gray-500">{venue.voteCount} votes</div>
                                    </div>

                                    <button
                                        onClick={() => handleVote(venue.id)}
                                        disabled={venue.userVoted}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${venue.userVoted
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white hover:bg-gray-100 text-gray-400 border border-gray-200'
                                            }`}
                                    >
                                        <ThumbsUp className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
