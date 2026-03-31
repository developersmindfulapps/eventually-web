/**
 * eventTypes.ts — Single source of truth for event types on web.
 *
 * AUTHORITY: Mobile app CreateEventScreen.tsx + backend Prisma schema.
 * DO NOT add or remove types without updating both this file and verifying
 * the backend schema accepts the eventType value.
 *
 * Backend Prisma field: eventType String?
 * Accepted enum values: social | trip | outdoor | athome |
 *                       concert | conference | sports | show | custom
 *
 * Venue behavior categories:
 *  - SOCIAL   → venue search (multi-select candidates) + optional manual address
 *  - FIXED    → single venue/manual meeting point (concert-style)
 *  - FLEXIBLE → both manual meeting point AND optional venue search allowed
 *  - CUSTOM   → all modes available; user picks
 *  - HOME     → no location UI needed
 */

// ─── Venue Behavior Modes ─────────────────────────────────────────────────────

export type VenueMode = "social" | "fixed" | "flexible" | "custom" | "home";

// ─── Event Type Definition ────────────────────────────────────────────────────

export interface EventTypeDefinition {
    /** Display label shown to the user */
    label: string;
    /**
     * Internal enum stored in the backend `eventType` column.
     * Maps multiple display labels to the same internal value
     * (e.g. "Office Party" → "social").
     */
    eventType: string;
    /** Controls which location UI is rendered */
    venueMode: VenueMode;
    /** Short hint shown below the type selector */
    hint: string;
}

// ─── Canonical event type list ────────────────────────────────────────────────
// Order matches mobile CreateEventScreen dropdown.

export const EVENT_TYPES: readonly EventTypeDefinition[] = [
    // ── Social (multi-venue search) ──────────────────────────────────────────
    {
        label:     "Office Party",
        eventType: "social",
        venueMode: "social",
        hint:      "We'll help find nearby venues for the group to vote on.",
    },
    {
        label:     "Birthday",
        eventType: "social",
        venueMode: "social",
        hint:      "We'll help find nearby venues for the group to vote on.",
    },
    {
        label:     "Farewell",
        eventType: "social",
        venueMode: "social",
        hint:      "We'll help find nearby venues for the group to vote on.",
    },
    {
        label:     "Team Lunch",
        eventType: "social",
        venueMode: "social",
        hint:      "We'll help find nearby venues for the group to vote on.",
    },
    {
        label:     "House Party",
        eventType: "social",
        venueMode: "social",
        hint:      "We'll help find nearby venues for the group to vote on.",
    },

    // ── Fixed-location (single venue or manual meeting point) ────────────────
    {
        label:     "Concert",
        eventType: "concert",
        venueMode: "fixed",
        hint:      "Search for a specific venue or enter a manual meeting point.",
    },
    {
        label:     "Show",
        eventType: "show",
        venueMode: "fixed",
        hint:      "Theatre, comedy, performance — enter the venue or meeting point.",
    },
    {
        label:     "Conference",
        eventType: "conference",
        venueMode: "fixed",
        hint:      "Meetup, seminar — search a venue or enter the address.",
    },

    // ── Flexible (manual meeting point; venue search optional) ───────────────
    {
        label:     "Trip",
        eventType: "trip",
        venueMode: "flexible",
        hint:      "Weekend trip, city tour — set a meeting point or search venues.",
    },
    {
        label:     "Outdoor",
        eventType: "outdoor",
        venueMode: "flexible",
        hint:      "Hiking, cycling, picnic — set a meeting point or search nearby.",
    },

    // ── At-home (no location UI) ─────────────────────────────────────────────
    {
        label:     "Other",
        eventType: "athome",
        venueMode: "home",
        hint:      "At-home or undecided — no venue needed.",
    },

    // ── Custom (all options) ─────────────────────────────────────────────────
    {
        label:     "Custom",
        eventType: "custom",
        venueMode: "custom",
        hint:      "Choose whether to use venue search or a manual meeting point.",
    },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getEventType(label: string): EventTypeDefinition | undefined {
    return EVENT_TYPES.find((t) => t.label === label);
}

export const EVENT_TYPE_LABELS = EVENT_TYPES.map((t) => t.label);
