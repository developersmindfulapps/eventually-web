import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Event, Group, GroupMember, PlaceResult, Reminder, ChatMessage, RSVPStatus, Attendee, PotluckItem, VenueVote } from "@/types";

// Helper to map backend Group model to frontend Group interface
function normalizeGroupData(res: any): Group[] {
    const rawArray = Array.isArray(res) ? res : (res?.data || []);
    return rawArray.map((item: any) => ({
        ...item,
        id: item.id?.toString() || `temp-${Math.random()}`,
        name: item.name || "Untitled Group",
        description: item.description,
        unreadCount: item._count?.events || 0, // Fallback if backend doesn't provide explicit message counts
    })) as Group[];
}

// ─── Groups ──────────────────────────────────────────────────────────────────
// README: GET /api/groups — list user's groups
export function useMyGroups() {
    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const res = await apiFetch<any>("/groups");
            return normalizeGroupData(res);
        },
    });
}

// README: GET /api/groups/:groupId — fetch a single group
export function useGroup(groupId: string) {
    return useQuery({
        queryKey: ["group", groupId],
        queryFn: async () => {
            const res = await apiFetch<any>(`/groups/${groupId}`);
            return normalizeGroupData([res])[0];
        },
        enabled: !!groupId,
    });
}

// README: GET /api/groups/:groupId/members
function normalizeGroupMembers(res: any): GroupMember[] {
    const rawArray = Array.isArray(res) ? res : (res?.data || []);
    return rawArray.map((item: any) => ({
        id: item.id?.toString() || `temp-${Math.random()}`,
        userId: item.userId || item.user?.id || "unknown",
        name: item.user?.name || item.name || "Unknown Member",
        avatarUrl: item.user?.avatarUrl || item.avatarUrl || undefined,
        role: (item.role === "admin" ? "admin" : "member") as "admin" | "member",
    })) as GroupMember[];
}

export function useGroupMembers(groupId: string) {
    return useQuery({
        queryKey: ["group", groupId, "members"],
        queryFn: async () => {
            const res = await apiFetch<any>(`/groups/${groupId}/members`);
            return normalizeGroupMembers(res);
        },
        enabled: !!groupId,
    });
}

// ─── Group Mutations ─────────────────────────────────────────────────────────
export function useGroupMutations(groupId: string) {
    const queryClient = useQueryClient();

    const editGroup = useMutation({
        mutationFn: ({ name, description }: { name: string; description?: string }) =>
            apiFetch(`/groups/${groupId}`, {
                method: "PATCH",
                body: JSON.stringify({ name, description }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["group", groupId] });
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });

    const inviteMembers = useMutation({
        mutationFn: () =>
            apiFetch<{ inviteCode: string }>(`/groups/${groupId}/invites`, { method: "POST" }),
    });

    const deleteGroup = useMutation({
        mutationFn: () =>
            apiFetch(`/groups/${groupId}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });

    return { editGroup, inviteMembers, deleteGroup };
}

// ─── Events ───────────────────────────────────────────────────────────────────

// Helper to reliably extract Event[] from backend responses which may carry `{ data: [] }` envelopes
// and dynamically remap the backend Prisma schema variables to the frontend's expected properties.
function normalizeEventData(res: any): Event[] {
    const rawArray = Array.isArray(res) ? res : (res?.data || []);
    return rawArray.map((item: any) => ({
        ...item,
        id: (item.id || item._id || `temp-${Math.random().toString(36).substring(7)}`).toString(),
        
        // --- Mapping actual Prisma fields to Frontend TS interface ---
        title: item.name || item.title || "Untitled Event",
        startTime: item.dateTime || item.startTime || undefined,
        locationName: item.finalizedVenue?.name || item.meetingLabel || item.city || item.locationName || undefined,
        locationAddress: item.finalizedVenue?.address || item.locationAddress || undefined,
        groupId: (item.groupId || item.group?.id || "").toString(),
        groupName: item.group?.name || item.groupName || "Unknown Group",
        rsvpStatus: item.rsvps?.[0]?.status || item.rsvpStatus || "not_going",
        attendeeCount: item._count?.rsvps || item.attendeeCount || 0,
    })) as Event[];
}

// README: GET /api/events — list events (supports pagination, search, filters)
export function useUpcomingEvents(limit = 5) {
    return useQuery({
        queryKey: ["events", "upcoming", limit],
        queryFn: async () => {
            const res = await apiFetch<any>(`/events?limit=${limit}&sort=upcoming&rsvpStatus=going&upcoming=true`);
            const allEvents = normalizeEventData(res);
            // Client-side safety filter to prevent ANY timezone-drifted past events from rendering
            const now = new Date();
            return allEvents.filter((event) => event.startTime && new Date(event.startTime) > now);
        },
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
            const res = await apiFetch<any>(`/events${queryString ? `?${queryString}` : ""}`);
            return normalizeEventData(res);
        },
    });
}

// README: GET /api/events/:eventId
export function useEvent(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            const res = await apiFetch<any>(`/events/${eventId}`);
            return normalizeEventData([res])[0];
        },
        enabled: !!eventId,
    });
}

export function useGroupEvents(groupId: string) {
    return useQuery({
        queryKey: ["group", groupId, "events"],
        queryFn: async () => {
            const res = await apiFetch<any>(`/groups/${groupId}/events`);
            return normalizeEventData(res);
        },
        enabled: !!groupId,
    });
}

// ─── Event Creation ───────────────────────────────────────────────────────────
export interface CreateEventPayload {
    name: string;
    /** Display label sent as `type` to the backend (e.g. "Social") */
    type: string;
    /** Internal enum sent as `eventType` (e.g. "social") */
    eventType?: string;
    /** 'auto' = venue search mode, 'manual' = meeting point mode */
    placeMode?: 'auto' | 'manual';
    dateTime: string; // ISO string
    budgetPerPerson?: number | null;
    budgetTotal?: number | null;
    city?: string;
    meetingLabel?: string;
    meetingLat?: number | null;
    meetingLng?: number | null;
}

export function useCreateEvent(groupId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateEventPayload) =>
            apiFetch<any>(`/events/group/${groupId}`, {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["group", groupId, "events"] });
        },
    });
}

// ─── Venue Creation (post-event) ─────────────────────────────────────────────
export interface CreateVenuePayload {
    name: string;
    address: string;
    rating?: number;
    lat?: number;
    lng?: number;
}

export function useCreateEventVenue() {
    return useMutation({
        mutationFn: ({ eventId, venue }: { eventId: string | number; venue: CreateVenuePayload }) =>
            apiFetch<any>(`/events/${eventId}/venues`, {
                method: "POST",
                body: JSON.stringify(venue),
            }),
    });
}

// ─── Places ───────────────────────────────────────────────────────────────────
export function usePlacesSearch() {
    return useMutation({
        mutationFn: async ({ query, lat, lng }: { query: string; lat?: number; lng?: number }) => {
            const params = new URLSearchParams({ query });
            if (lat != null) params.append("lat", lat.toString());
            if (lng != null) params.append("lng", lng.toString());
            const res = await apiFetch<{ places: PlaceResult[] }>(`/places/nearby?${params.toString()}`);
            return (res as any)?.places ?? [];
        },
    });
}

// ─── RSVPs ────────────────────────────────────────────────────────────────────
// Backend: POST /api/events/:eventId/rsvps  body: { status: 'going' | 'maybe' | 'not_going' }
export function useRSVP() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eventId, status }: { eventId: string; status: RSVPStatus }) =>
            apiFetch(`/events/${eventId}/rsvps`, {
                method: "POST",
                body: JSON.stringify({ status }),
            }),
        onSuccess: (_, variables) => {
            // Invalidate ALL views that display RSVP state so status is consistent everywhere
            queryClient.invalidateQueries({ queryKey: ["event", variables.eventId] });
            queryClient.invalidateQueries({ queryKey: ["event", variables.eventId, "rsvps"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
            // Fuzzy match: any query starting with "groupEvents" (e.g. ["groupEvents", groupId])
            queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "groupEvents" });
        },
    });
}

// ─── Notifications ────────────────────────────────────────────────────────────
// TODO: Re-enable once backend endpoint /api/notifications is implemented in eventually-app repo.
// TEMPORARILY DISABLED — calling /api/notifications causes a 404 from the Railway backend
// and a runtime crash ("TypeError: e.map is not a function") that breaks the entire dashboard.
export function useReminders() {
    // TEMPORARILY DISABLED
    // return useQuery({
    //     queryKey: ["reminders"],
    //     queryFn: async () => {
    //         return await apiFetch<Reminder[]>("/notifications");
    //     },
    //     retry: false,
    // });

    // Return a safe empty array until the backend endpoint exists
    return { data: [] as import("@/types").Reminder[], isLoading: false, error: null };
}

// Helper to map backend Message to frontend ChatMessage
function normalizeChatMessages(res: any): ChatMessage[] {
    const rawArray = Array.isArray(res) ? res : (res?.data || []);
    return rawArray.map((item: any) => ({
        ...item,
        id: item.id?.toString() || `temp-${Math.random()}`,
        senderId: item.userId || item.senderId || "unknown",
        senderName: item.user?.name || item.senderName || "Unknown User",
        senderAvatarUrl: item.user?.avatarUrl || item.senderAvatarUrl || undefined,
        content: item.content || "",
        timestamp: item.createdAt || item.timestamp || new Date().toISOString(),
        chatId: (item.eventId || item.chatId || "unknown").toString(),
    })) as ChatMessage[];
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
        queryFn: async () => {
            const res = await apiFetch<any>(`/events/${eventId}/messages`);
            return normalizeChatMessages(res);
        },
        enabled: !!eventId,
        refetchInterval: 5000,
    });
}

// Helper for Attendees
function normalizeAttendees(res: any): Attendee[] {
    const rawArray = Array.isArray(res) ? res : (res?.data || []);
    return rawArray.map((item: any) => ({
        ...item,
        id: item.id?.toString() || `temp-${Math.random()}`,
        userId: item.userId || item.user?.id || "unknown",
        name: item.user?.name || item.name || "Unknown User",
        avatarUrl: item.user?.avatarUrl || item.avatarUrl || undefined,
        status: (item.status || "not_going") as RSVPStatus,
        isHost: item.role === "admin" || item.isHost || false,
    })) as Attendee[];
}

// ─── Event Detail Hooks ───────────────────────────────────────────────────────
// README: GET /api/events/:eventId/rsvps
export function useEventAttendees(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId, "rsvps"],
        queryFn: async () => {
            const res = await apiFetch<any>(`/events/${eventId}/rsvps`);
            return normalizeAttendees(res);
        },
        enabled: !!eventId,
    });
}

// Helper for Potluck Items
function normalizePotluckItems(res: any): PotluckItem[] {
    const rawArray = Array.isArray(res) ? res : (res?.data || []);
    return rawArray.map((item: any) => {
        const claim = item.claims?.[0] || item.claimedBy;
        return {
            ...item,
            id: item.id?.toString() || `temp-${Math.random()}`,
            name: item.name || "Unnamed Item",
            claimedBy: claim ? {
                userId: claim.userId || claim.user?.id || "unknown",
                name: claim.user?.name || claim.name || "Unknown User",
                avatarUrl: claim.user?.avatarUrl || claim.avatarUrl,
            } : undefined,
        };
    }) as PotluckItem[];
}

// README: GET /api/events/:eventId/potluck
export function useEventPotluck(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId, "potluck"],
        queryFn: async () => {
            const res = await apiFetch<any>(`/events/${eventId}/potluck`);
            return normalizePotluckItems(res);
        },
        enabled: !!eventId,
    });
}

// Helper for Venues
function normalizeVenueVotes(res: any): VenueVote[] {
    const rawArray = Array.isArray(res) ? res : (res?.data || []);
    return rawArray.map((item: any) => ({
        ...item,
        id: item.id?.toString() || `temp-${Math.random()}`,
        name: item.name || item.eventVenue?.name || "Unnamed Venue",
        address: item.address || item.eventVenue?.address || "Unknown Address",
        lat: item.lat || item.eventVenue?.lat || null,
        lng: item.lng || item.eventVenue?.lng || null,
        rating: item.rating || item.eventVenue?.rating || null,
        googlePlaceId: item.googlePlaceId || item.eventVenue?.googlePlaceId || null,
        voteCount: item._count?.votes || item.voteCount || item.votes?.length || 0,
        userVoted: typeof item.userVoted !== 'undefined' ? item.userVoted : false, // Needs authUser context ideally, defaults to false
    })) as VenueVote[];
}

// README: GET /api/events/:eventId/venues
export function useEventVenues(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId, "venues"],
        queryFn: async () => {
            const res = await apiFetch<any>(`/events/${eventId}/venues`);
            return normalizeVenueVotes(res);
        },
        enabled: !!eventId,
    });
}

// ─── Infinite Events ──────────────────────────────────────────────────────────
// ─── Infinite Events ──────────────────────────────────────────────────────────
// README: GET /api/events (supports pagination)
export function useEventsInfinite(filters?: { groupId?: string; sort?: string; search?: string; month?: string; isExplore?: boolean }) {
    return useInfiniteQuery({
        queryKey: ["events", "infinite", filters],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams();
            if (filters?.groupId && filters.groupId !== "all") params.append("groupId", filters.groupId);
            if (filters?.sort) params.append("orderBy", filters.sort); // Use 'orderBy' for backend compatibility
            if (filters?.search) params.append("search", filters.search); // Backend expects 'search'
            if (filters?.month) params.append("month", filters.month);
            if (filters?.isExplore) params.append("isExplore", "true");
            params.append("page", pageParam.toString());
            // Explore mode is limited to 50 per prompt, otherwise standard batch
            params.append("limit", filters?.isExplore ? "50" : "10");
            const res = await apiFetch<any>(`/events?${params.toString()}`);
            return normalizeEventData(res);
        },
        getNextPageParam: (lastPage, allPages) => {
            const limit = filters?.isExplore ? 50 : 10;
            return lastPage.length === limit ? allPages.length + 1 : undefined;
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

    // POST /api/events/:eventId/venues/:venueId/vote
    const voteVenue = useMutation({
        mutationFn: ({ eventId, venueId }: { eventId: string; venueId: string }) =>
            apiFetch(`/events/${eventId}/venues/${venueId}/vote`, { method: "POST" }),
        onSuccess: (_, { eventId }) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId, "venues"] });
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
        },
    });

    // POST /api/events/:eventId/venues/:venueId/finalize (admin only)
    const finalizeVenue = useMutation({
        mutationFn: ({ eventId, venueId }: { eventId: string; venueId: string }) =>
            apiFetch(`/events/${eventId}/venues/${venueId}/finalize`, { method: "POST" }),
        onSuccess: (_, { eventId }) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            queryClient.invalidateQueries({ queryKey: ["event", eventId, "venues"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });

    // POST /api/events/:eventId/reset-votes (admin only)
    const resetVotes = useMutation({
        mutationFn: ({ eventId }: { eventId: string }) =>
            apiFetch(`/events/${eventId}/reset-votes`, { method: "POST" }),
        onSuccess: (_, { eventId }) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId, "venues"] });
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
        },
    });

    // POST /api/events/:eventId/reopen-voting (admin only)
    const reopenVoting = useMutation({
        mutationFn: ({ eventId }: { eventId: string }) =>
            apiFetch(`/events/${eventId}/reopen-voting`, { method: "POST" }),
        onSuccess: (_, { eventId }) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            queryClient.invalidateQueries({ queryKey: ["event", eventId, "venues"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });

    // POST /api/events/:eventId/messages
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

    return { claimPotluckItem, voteVenue, finalizeVenue, resetVotes, reopenVoting, sendMessage };
}
