"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    useCreateEvent,
    useCreateEventVenue,
    usePlacesSearch,
    CreateEventPayload,
} from "@/hooks/useData";
import {
    EVENT_TYPES,
    EventTypeDefinition,
    VenueMode,
} from "@/lib/constants/eventTypes";
import { PlaceResult } from "@/types";
import { MapPin, Search, Star, Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
    groupId: string;
    onClose: () => void;
}

export function CreateEventModal({ groupId, onClose }: Props) {
    const router = useRouter();
    const createEvent = useCreateEvent(groupId);
    const createVenue = useCreateEventVenue();
    const placesSearch = usePlacesSearch();

    // ── Core form fields ────────────────────────────────────────────────────
    const [name, setName] = useState("");
    const [selectedType, setSelectedType] = useState<EventTypeDefinition>(EVENT_TYPES[0]);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [budgetPerPerson, setBudgetPerPerson] = useState("");
    const [budgetTotal, setBudgetTotal] = useState("");

    // ── "Custom" / "fixed" secondary mode picker ───────────────────────────
    // null = not chosen yet; "venue" = search mode; "point" = manual address
    const [subMode, setSubMode] = useState<"venue" | "point" | null>(null);

    // ── Venue search state ──────────────────────────────────────────────────
    const [city, setCity] = useState("");
    const [venueQuery, setVenueQuery] = useState("");
    const [venueResults, setVenueResults] = useState<PlaceResult[]>([]);
    // Multi-select for social; single-select otherwise
    const [selectedVenues, setSelectedVenues] = useState<PlaceResult[]>([]);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Manual meeting point ────────────────────────────────────────────────
    const [meetingLabel, setMeetingLabel] = useState("");

    // ── UI state ──────────────────────────────────────────────────────────
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successState, setSuccessState] = useState(false);

    // ─── Derived venue-mode ────────────────────────────────────────────────

    const venueMode: VenueMode = selectedType.venueMode;

    /**
     * Resolved effective mode for "custom" and "fixed" types that have a
     * sub-mode picker. For all other types this is derived directly.
     */
    const effectiveMode: "search" | "manual" | "both" | "none" = (() => {
        if (venueMode === "social")    return "both";   // multi-venue search + optional manual
        if (venueMode === "home")      return "none";
        if (venueMode === "flexible")  return "both";
        if (venueMode === "fixed") {
            if (subMode === "venue")   return "search";
            if (subMode === "point")   return "manual";
            return "none"; // not chosen yet
        }
        if (venueMode === "custom") {
            if (subMode === "venue")   return "search";
            if (subMode === "point")   return "manual";
            return "none";
        }
        return "none";
    })();

    const showsVenueSearch = effectiveMode === "search" || effectiveMode === "both";
    const showsMeetingPoint = effectiveMode === "manual" || effectiveMode === "both";
    const showsLocationPanel = venueMode !== "home";
    const needsSubModePicker = venueMode === "fixed" || venueMode === "custom";
    const isMultiSelect = venueMode === "social";

    // ─── Event type change ─────────────────────────────────────────────────

    const handleTypeChange = (t: EventTypeDefinition) => {
        setSelectedType(t);
        setShowTypeDropdown(false);
        setSubMode(null);
        setSelectedVenues([]);
        setVenueResults([]);
        setMeetingLabel("");
        setCity("");
        setVenueQuery("");
    };

    // ─── Venue search ──────────────────────────────────────────────────────

    const runSearch = useCallback(
        async (q: string) => {
            if (!q.trim()) return;
            const results = await placesSearch.mutateAsync({ query: q });
            setVenueResults(results as PlaceResult[]);
        },
        [placesSearch]
    );

    const handleVenueQueryChange = (q: string) => {
        setVenueQuery(q);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (q.trim().length >= 2) {
            searchTimer.current = setTimeout(() => runSearch(q), 400);
        } else {
            setVenueResults([]);
        }
    };

    const toggleVenue = (venue: PlaceResult) => {
        if (isMultiSelect) {
            setSelectedVenues((prev) =>
                prev.find((v) => v.id === venue.id)
                    ? prev.filter((v) => v.id !== venue.id)
                    : [...prev, venue]
            );
        } else {
            // Single-select: replace and collapse results
            setSelectedVenues([venue]);
            setVenueQuery(venue.name);
            setVenueResults([]);
        }
    };

    const removeVenue = (id: string) =>
        setSelectedVenues((prev) => prev.filter((v) => v.id !== id));

    // ─── Validation ────────────────────────────────────────────────────────

    function validate(): boolean {
        const next: Record<string, string> = {};

        if (!name.trim() || name.trim().length < 3)
            next.name = "Event name must be at least 3 characters.";
        if (!date) next.date = "Date is required.";
        if (!time) next.time = "Time is required.";

        if (date && time) {
            const chosen = new Date(`${date}T${time}`);
            if (chosen < new Date(Date.now() + 60 * 60 * 1000))
                next.dateTime = "Event must be at least 1 hour from now.";
        }

        if (needsSubModePicker && !subMode)
            next.location = "Please choose a location mode.";

        if (showsVenueSearch && !city.trim())
            next.location = "City is required to search venues.";

        if (showsMeetingPoint && !meetingLabel.trim())
            next.location = "Meeting point description is required.";

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    // ─── Submit ────────────────────────────────────────────────────────────

    const handleSubmit = useCallback(async () => {
        if (!validate()) return;

        const placeMode = showsVenueSearch ? "auto" : "manual";
        const dateTime = new Date(`${date}T${time}`).toISOString();

        const payload: CreateEventPayload = {
            name: name.trim(),
            type: selectedType.label,
            eventType: selectedType.eventType,
            placeMode,
            dateTime,
            budgetPerPerson: budgetPerPerson ? Number(budgetPerPerson) : null,
            budgetTotal: budgetTotal ? Number(budgetTotal) : null,
            city: showsVenueSearch ? city.trim() || undefined : undefined,
            meetingLabel: showsMeetingPoint ? meetingLabel.trim() || undefined : undefined,
            meetingLat: null,
            meetingLng: null,
        };

        try {
            const newEvent = await createEvent.mutateAsync(payload);

            // Social / custom+venue: create multiple venue candidates for group voting
            if (showsVenueSearch && isMultiSelect && selectedVenues.length > 0 && newEvent?.id) {
                await Promise.allSettled(
                    selectedVenues.map((v) =>
                        createVenue.mutateAsync({
                            eventId: newEvent.id,
                            venue: {
                                name: v.name,
                                address: v.address,
                                rating: v.rating ?? undefined,
                                lat: v.lat ?? undefined,
                                lng: v.lng ?? undefined,
                            },
                        })
                    )
                );
            }

            setSuccessState(true);
            setTimeout(() => {
                onClose();
                if (newEvent?.id) router.push(`/events/${newEvent.id}`);
            }, 1500);
        } catch {
            setErrors({ submit: "Failed to create event. Please try again." });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, selectedType, date, time, budgetPerPerson, budgetTotal, city ,
        meetingLabel, selectedVenues, showsVenueSearch, showsMeetingPoint, isMultiSelect,
        createEvent, createVenue, onClose, router]);

    const isFormValid = name.trim().length >= 3 && date && time;

    // ─── Success screen ────────────────────────────────────────────────────

    if (successState) {
        return (
            <ModalShell title="" onClose={onClose}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F4F1] text-4xl">🎉</div>
                    <h2 className="text-xl font-bold text-gray-900">Event Created!</h2>
                    <p className="mt-1 text-sm text-gray-500">Redirecting you to the event…</p>
                </div>
            </ModalShell>
        );
    }

    // ─── Render ────────────────────────────────────────────────────────────

    return (
        <ModalShell title="Create Event" onClose={onClose}>
            <div className="flex gap-6">

                {/* ── Left: Form ───────────────────────────────────────────── */}
                <div className="flex-1 min-w-0 space-y-4">

                    {/* Event Name */}
                    <Field label="Event Name" required error={errors.name}>
                        <input
                            id="event-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sarah's Birthday Bash 🎂"
                            className={inputCls(!!errors.name)}
                        />
                    </Field>

                    {/* Event Type — dropdown from constants */}
                    <Field label="Event Type" required error={undefined}>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowTypeDropdown((o) => !o)}
                                className={cn(inputCls(false), "flex items-center justify-between text-left")}
                            >
                                <span>{selectedType.label}</span>
                                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", showTypeDropdown && "rotate-180")} />
                            </button>
                            {showTypeDropdown && (
                                <div className="absolute z-30 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                                    {EVENT_TYPES.map((t) => (
                                        <button
                                            key={t.label}
                                            type="button"
                                            onClick={() => handleTypeChange(t)}
                                            className={cn(
                                                "w-full px-4 py-2.5 text-left text-sm transition hover:bg-gray-50",
                                                selectedType.label === t.label
                                                    ? "bg-[#E6F4F1] font-semibold text-[#1F7A63]"
                                                    : "text-gray-700"
                                            )}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">{selectedType.hint}</p>
                    </Field>

                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date" required error={errors.date}>
                            <input id="event-date" type="date" value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={inputCls(!!errors.date)} />
                        </Field>
                        <Field label="Time" required error={errors.time}>
                            <input id="event-time" type="time" value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className={inputCls(!!errors.time)} />
                        </Field>
                    </div>
                    {errors.dateTime && <p className="text-xs text-red-500">{errors.dateTime}</p>}

                    {/* Budget */}
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Budget (Optional)</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Per Person" error={undefined}>
                                <input id="budget-per-person" type="number" min={0}
                                    value={budgetPerPerson}
                                    onChange={(e) => setBudgetPerPerson(e.target.value)}
                                    placeholder="0" className={inputCls(false)} />
                            </Field>
                            <Field label="Total Budget" error={undefined}>
                                <input id="budget-total" type="number" min={0}
                                    value={budgetTotal}
                                    onChange={(e) => setBudgetTotal(e.target.value)}
                                    placeholder="0" className={inputCls(false)} />
                            </Field>
                        </div>
                    </div>

                    {errors.submit && <p className="text-xs text-red-500">{errors.submit}</p>}
                </div>

                {/* ── Right: Location ───────────────────────────────────────── */}
                {showsLocationPanel && (
                    <div className="w-64 flex-shrink-0 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Location</p>

                        {/* Sub-mode picker for "fixed" and "custom" types */}
                        {needsSubModePicker && (
                            <div className="grid grid-cols-2 gap-2">
                                <ModeCard
                                    label={venueMode === "fixed" ? "Search venue" : "Pick a venue"}
                                    sub="Find & select"
                                    selected={subMode === "venue"}
                                    onClick={() => { setSubMode("venue"); setMeetingLabel(""); setSelectedVenues([]); }}
                                />
                                <ModeCard
                                    label="Meeting point"
                                    sub="Manual address"
                                    selected={subMode === "point"}
                                    onClick={() => { setSubMode("point"); setSelectedVenues([]); }}
                                />
                            </div>
                        )}

                        {errors.location && !showsVenueSearch && !showsMeetingPoint && (
                            <p className="text-xs text-red-500">{errors.location}</p>
                        )}

                        {/* ── Venue search UI ──────────────────────────────── */}
                        {showsVenueSearch && (
                            <>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="City (e.g. New Delhi)"
                                        className={cn(
                                            "w-full rounded-xl border py-2 pl-8 pr-3 text-xs text-gray-900 focus:border-[#1F7A63] focus:outline-none",
                                            errors.location && "border-red-300"
                                        )}
                                    />
                                </div>
                                {errors.location && (
                                    <p className="text-xs text-red-500">{errors.location}</p>
                                )}

                                <div className="flex gap-1.5">
                                    <input
                                        id="venue-search"
                                        type="text"
                                        value={venueQuery}
                                        onChange={(e) => handleVenueQueryChange(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && runSearch(venueQuery)}
                                        placeholder="Search venues…"
                                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#1F7A63] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => runSearch(venueQuery)}
                                        disabled={placesSearch.isPending}
                                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#1F7A63] text-white hover:bg-[#196652] disabled:opacity-50"
                                    >
                                        <Search className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                {placesSearch.isPending && (
                                    <p className="text-xs text-gray-400 text-center">Searching…</p>
                                )}

                                {/* Selected venue chips */}
                                {selectedVenues.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedVenues.map((v) => (
                                            <span key={v.id} className="inline-flex items-center gap-1 rounded-full bg-[#E6F4F1] px-2.5 py-1 text-xs font-medium text-[#1F7A63]">
                                                {v.name}
                                                <button type="button" onClick={() => removeVenue(v.id)} className="ml-0.5 opacity-60 hover:opacity-100">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Results list */}
                                {venueResults.length > 0 && (
                                    <div className="space-y-1.5 max-h-52 overflow-y-auto">
                                        {venueResults.map((venue) => {
                                            const isSel = selectedVenues.some((v) => v.id === venue.id);
                                            return (
                                                <button
                                                    key={venue.id}
                                                    type="button"
                                                    onClick={() => toggleVenue(venue)}
                                                    className={cn(
                                                        "w-full rounded-xl border p-2.5 text-left text-xs transition",
                                                        isSel
                                                            ? "border-[#1F7A63]/40 bg-[#E6F4F1]"
                                                            : "border-gray-100 bg-white hover:border-[#1F7A63]/30 hover:bg-[#E6F4F1]/40"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-1.5">
                                                        {isSel && <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#1F7A63]" />}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-gray-900 leading-tight truncate">{venue.name}</p>
                                                            <p className="text-gray-500 leading-tight truncate">{venue.address}</p>
                                                            {venue.rating != null && (
                                                                <p className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                                                                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />{venue.rating}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {venueResults.length === 0 && !placesSearch.isPending && (
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {isMultiSelect
                                            ? "Search and select venues for the group to vote on."
                                            : "Search and select a venue for this event."}
                                    </p>
                                )}
                            </>
                        )}

                        {/* ── Manual meeting point ─────────────────────────── */}
                        {showsMeetingPoint && (
                            <div className="space-y-1.5">
                                {showsVenueSearch && (
                                    <p className="text-xs font-semibold text-gray-700">Meeting Point</p>
                                )}
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                    <input
                                        id="meeting-label"
                                        type="text"
                                        value={meetingLabel}
                                        onChange={(e) => setMeetingLabel(e.target.value)}
                                        placeholder="Address or description"
                                        className={cn(
                                            "w-full rounded-xl border py-2 pl-8 pr-3 text-xs text-gray-900 focus:border-[#1F7A63] focus:outline-none",
                                            errors.location && !meetingLabel.trim()
                                                ? "border-red-300"
                                                : "border-gray-200"
                                        )}
                                    />
                                </div>
                                {errors.location && !meetingLabel.trim() && (
                                    <p className="text-xs text-red-500">{errors.location}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid || createEvent.isPending}
                    className="rounded-full bg-[#1F7A63] px-5 py-2 text-sm font-semibold text-white hover:bg-[#196652] disabled:opacity-40"
                >
                    {createEvent.isPending ? "Creating…" : "Create Event"}
                </button>
            </div>
        </ModalShell>
    );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function ModeCard({ label, sub, selected, onClick }: {
    label: string; sub: string; selected: boolean; onClick: () => void;
}) {
    return (
        <button type="button" onClick={onClick}
            className={cn(
                "rounded-xl border p-2.5 text-left text-xs transition",
                selected
                    ? "border-[#1F7A63] bg-[#E6F4F1] font-semibold text-[#1F7A63]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            )}
        >
            <p className="font-semibold leading-tight">{label}</p>
            <p className="mt-0.5 text-gray-400">{sub}</p>
        </button>
    );
}

function Field({ label, required, error, children }: {
    label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                {label}{required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function inputCls(hasError: boolean) {
    return cn(
        "w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1",
        hasError
            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
            : "border-gray-200 focus:border-[#1F7A63] focus:ring-[#1F7A63]/20"
    );
}

function ModalShell({ title, onClose, children }: {
    title: string; onClose: () => void; children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {title && (
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        <button onClick={onClose} aria-label="Close"
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
