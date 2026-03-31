"use client";

import { VenueVote, Event } from "@/types";
import { useEventMutations } from "@/hooks/useData";
import { MapPin, ThumbsUp, CheckCircle, RotateCcw, Trash2, Navigation } from "lucide-react";
import { useState } from "react";

interface VenuePollTabProps {
    eventId: string;
    venues: VenueVote[];
    isAdmin?: boolean;
    event?: Event;
}

function getDirectionsUrl(venue: { lat?: number | null; lng?: number | null; address?: string; name?: string }) {
    if (venue.lat && venue.lng) {
        return `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
    }
    if (venue.address) {
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.address)}`;
    }
    if (venue.name) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name)}`;
    }
    return null;
}

export function VenuePollTab({ eventId, venues, isAdmin, event }: VenuePollTabProps) {
    const { voteVenue, finalizeVenue, resetVotes, reopenVoting } = useEventMutations();
    const [confirmReset, setConfirmReset] = useState(false);

    const isFinalized = event?.status === "finalized" && !!event?.finalizedVenueId;
    const finalizedVenue = isFinalized
        ? venues.find((v) => String(v.id) === String(event?.finalizedVenueId)) || event?.finalizedVenue
        : null;

    const totalVotes = venues.reduce((acc, v) => acc + v.voteCount, 0);

    const handleVote = (venueId: string) => {
        voteVenue.mutate({ eventId, venueId });
    };

    const handleFinalize = (venueId: string) => {
        finalizeVenue.mutate({ eventId, venueId });
    };

    const handleResetVotes = () => {
        resetVotes.mutate({ eventId });
        setConfirmReset(false);
    };

    const handleReopenVoting = () => {
        reopenVoting.mutate({ eventId });
    };

    return (
        <div className="space-y-6">
            {/* ── Finalized Venue Banner ── */}
            {isFinalized && finalizedVenue && (
                <div className="rounded-xl border-2 border-[#1F7A63] bg-[#E6F4F1] p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-[#1F7A63]" />
                        <h3 className="font-bold text-[#1F7A63]">Venue Finalized</h3>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h4 className="text-lg font-bold text-gray-900">{finalizedVenue.name}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{finalizedVenue.address}</p>
                        </div>
                        {(() => {
                            const url = getDirectionsUrl(finalizedVenue);
                            return url ? (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-xl bg-[#1F7A63] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16614F] transition-colors flex-shrink-0"
                                >
                                    <Navigation className="h-4 w-4" />
                                    Get Directions
                                </a>
                            ) : null;
                        })()}
                    </div>

                    {/* Admin: Reopen voting */}
                    {isAdmin && (
                        <button
                            onClick={handleReopenVoting}
                            disabled={reopenVoting.isPending}
                            className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#1F7A63] hover:text-[#16614F] disabled:opacity-50"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            {reopenVoting.isPending ? "Reopening…" : "Reopen Voting"}
                        </button>
                    )}
                </div>
            )}

            {/* ── Voting Section ── */}
            <div className="bg-white p-6 shadow-sm sm:rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isFinalized ? "Venue Poll (Locked)" : "Vote for Venue"}
                    </h2>

                    {/* Admin: Reset Votes */}
                    {isAdmin && !isFinalized && (
                        <div className="flex items-center gap-2">
                            {confirmReset ? (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">Reset all votes?</span>
                                    <button
                                        onClick={handleResetVotes}
                                        disabled={resetVotes.isPending}
                                        className="text-red-500 font-semibold hover:text-red-600"
                                    >
                                        {resetVotes.isPending ? "Resetting…" : "Yes, reset"}
                                    </button>
                                    <button
                                        onClick={() => setConfirmReset(false)}
                                        className="text-gray-400 font-medium hover:text-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmReset(true)}
                                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Reset Votes
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {venues.map((venue) => {
                        const percentage = totalVotes > 0 ? Math.round((venue.voteCount / totalVotes) * 100) : 0;
                        const isTopChoice = venue.voteCount > 0 && venue.voteCount === Math.max(...venues.map((v) => v.voteCount));
                        const directionsUrl = getDirectionsUrl(venue);

                        return (
                            <div key={venue.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
                                {/* Progress Bar Background */}
                                <div
                                    className="absolute inset-y-0 left-0 bg-[#E6F4F1] transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />

                                <div className="relative z-10 flex items-center justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <MapPin className="h-5 w-5 mt-0.5 text-[#1F7A63] flex-shrink-0" />
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{venue.address}</p>
                                            {directionsUrl && (
                                                <a
                                                    href={directionsUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-[#1F7A63] hover:text-[#16614F]"
                                                >
                                                    <Navigation className="h-3 w-3" />
                                                    Directions
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">{percentage}%</div>
                                            <div className="text-xs text-gray-500">{venue.voteCount} vote{venue.voteCount !== 1 ? "s" : ""}</div>
                                        </div>

                                        {/* Vote button (disabled when finalized) */}
                                        <button
                                            onClick={() => handleVote(venue.id)}
                                            disabled={venue.userVoted || isFinalized}
                                            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                                                venue.userVoted
                                                    ? "bg-[#1F7A63] text-white shadow-md"
                                                    : isFinalized
                                                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                                    : "bg-white hover:bg-gray-100 text-gray-400 border border-gray-200"
                                            }`}
                                        >
                                            <ThumbsUp className="h-5 w-5" />
                                        </button>

                                        {/* Admin: Finalize this venue (only show if not already finalized) */}
                                        {isAdmin && !isFinalized && (
                                            <button
                                                onClick={() => handleFinalize(venue.id)}
                                                disabled={finalizeVenue.isPending}
                                                title="Finalize this venue"
                                                className="flex h-10 items-center gap-1.5 rounded-lg bg-[#1F7A63] px-3 text-xs font-semibold text-white hover:bg-[#16614F] transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                Finalize
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {venues.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <MapPin className="h-8 w-8 text-gray-200 mb-2" />
                            <p className="text-sm text-gray-400">No venues suggested yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
