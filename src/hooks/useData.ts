import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Event, Group, Reminder, ChatMessage, RSVPStatus, Attendee, PotluckItem, VenueVote } from "@/types";

// ─── Groups ──────────────────────────────────────────────────────────────────
// README: GET /api/groups — list user's groups
export function useMyGroups() {
    return useQuery({
        queryKey: ["groups"],
        queryFn: () => apiFetch<Group[]>("/groups"),
    });
}

// ─── Events ───────────────────────────────────────────────────────────────────
// README: GET /api/events — list events (supports pagination, search, filters)
export function useUpcomingEvents(limit = 5) {
    return useQuery({
        queryKey: ["events", "upcoming", limit],
        queryFn: () => apiFetch<Event[]>(`/events?limit=${limit}&sort=upcoming`),
    });
}

// README: GET /api/events (with optional q, groupId, sort params)
export function useMyEvents(filters?: { groupId?: string; sort?: string; search?: string }) {
    const queryKey = ["events", "my", filters];
    return useQuery({
        queryKey,
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.groupId && filters.groupId !== "all") params.append("groupId", filters.groupId);
            if (filters?.sort) params.append("sort", filters.sort);
            if (filters?.search) params.append("q", filters.search);
            const queryString = params.toString();
            return apiFetch<Event[]>(`/events${queryString ? `?${queryString}` : ""}`);
        },
    });
}

// README: GET /api/events/:eventId
export function useEvent(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId],
        queryFn: () => apiFetch<Event>(`/events/${eventId}`),
        enabled: !!eventId,
    });
}

// README: GET /api/groups/:groupId/events (not /events/my)
export function useGroupEvents(groupId: string) {
    return useQuery({
        queryKey: ["group", groupId, "events"],
        queryFn: () => apiFetch<Event[]>(`/groups/${groupId}/events`),
        enabled: !!groupId,
    });
}

// ─── RSVPs ────────────────────────────────────────────────────────────────────
// README: POST /api/events/:eventId/rsvps (body: { status })
export function useRSVP() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eventId, status }: { eventId: string; status: RSVPStatus }) =>
            apiFetch(`/events/${eventId}/rsvps`, {
                method: "POST",
                body: JSON.stringify({ status }),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["event", variables.eventId, "rsvps"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

// ─── Notifications (graceful — endpoint not in README, may not exist) ─────────
export function useReminders() {
    return useQuery({
        queryKey: ["reminders"],
        queryFn: async () => {
            try {
                return await apiFetch<Reminder[]>("/notifications");
            } catch {
                // Backend may not implement /notifications yet — return empty
                return [] as Reminder[];
            }
        },
        // Don't retry if it fails — avoid flooding console with errors
        retry: false,
    });
}

// ─── Chat ────────────────────────────────────────────────────────────────────
// README: GET /api/events/:eventId/messages
export function useRecentChats() {
    // No generic "recent chats" endpoint in README — return empty gracefully
    return useQuery({
        queryKey: ["chats", "recent"],
        queryFn: async () => [] as ChatMessage[],
        staleTime: Infinity,
    });
}

// README: GET /api/events/:eventId/messages (poll every 5s)
export function useEventChat(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId, "messages"],
        queryFn: () => apiFetch<ChatMessage[]>(`/events/${eventId}/messages`),
        enabled: !!eventId,
        refetchInterval: 5000,
    });
}

// ─── Event Detail Hooks ───────────────────────────────────────────────────────
// README: GET /api/events/:eventId/rsvps
export function useEventAttendees(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId, "rsvps"],
        queryFn: () => apiFetch<Attendee[]>(`/events/${eventId}/rsvps`),
        enabled: !!eventId,
    });
}

// README: GET /api/events/:eventId/potluck
export function useEventPotluck(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId, "potluck"],
        queryFn: () => apiFetch<PotluckItem[]>(`/events/${eventId}/potluck`),
        enabled: !!eventId,
    });
}

// README: GET /api/events/:eventId/venues
export function useEventVenues(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId, "venues"],
        queryFn: () => apiFetch<VenueVote[]>(`/events/${eventId}/venues`),
        enabled: !!eventId,
    });
}

// ─── Infinite Events ──────────────────────────────────────────────────────────
// README: GET /api/events (supports pagination)
export function useEventsInfinite(filters?: { groupId?: string; sort?: string; search?: string; month?: string }) {
    return useInfiniteQuery({
        queryKey: ["events", "infinite", filters],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams();
            if (filters?.groupId && filters.groupId !== "all") params.append("groupId", filters.groupId);
            if (filters?.sort) params.append("sort", filters.sort);
            if (filters?.search) params.append("q", filters.search);
            if (filters?.month) params.append("month", filters.month);
            params.append("page", pageParam.toString());
            params.append("limit", "10");
            return apiFetch<Event[]>(`/events?${params.toString()}`);
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
    });
}

// ─── Mutations ────────────────────────────────────────────────────────────────
export function useEventMutations() {
    const queryClient = useQueryClient();

    // README: POST /api/events/:eventId/potluck/items/:itemId/claim
    const claimPotluckItem = useMutation({
        mutationFn: ({ eventId, itemId }: { eventId: string; itemId: string }) =>
            apiFetch(`/events/${eventId}/potluck/items/${itemId}/claim`, { method: "POST" }),
        onSuccess: (_, { eventId }) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId, "potluck"] });
        },
    });

    // README: POST /api/events/:eventId/venues/:venueId/vote
    const voteVenue = useMutation({
        mutationFn: ({ eventId, venueId }: { eventId: string; venueId: string }) =>
            apiFetch(`/events/${eventId}/venues/${venueId}/vote`, { method: "POST" }),
        onSuccess: (_, { eventId }) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId, "venues"] });
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
        },
    });

    // README: POST /api/events/:eventId/messages
    const sendMessage = useMutation({
        mutationFn: ({ eventId, message }: { eventId: string; message: string }) =>
            apiFetch(`/events/${eventId}/messages`, {
                method: "POST",
                body: JSON.stringify({ message }),
            }),
        onSuccess: (_, { eventId }) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId, "messages"] });
        },
    });

    return { claimPotluckItem, voteVenue, sendMessage };
}
