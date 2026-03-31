export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}

export interface Group {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string; // or color
    unreadCount?: number;
}

export interface GroupMember {
    id: string;
    userId: string;
    name: string;
    avatarUrl?: string;
    role: "admin" | "member";
}

// Must match backend: 'going' | 'maybe' | 'not_going'
export type RSVPStatus = "going" | "maybe" | "not_going";

export interface Event {
    id?: string;
    _id?: string;
    title: string;
    description?: string;
    startTime?: string; // ISO string
    endTime?: string;
    locationName?: string;
    locationAddress?: string;
    locationImageUrl?: string;
    groupId: string;
    groupName: string; // denormalized or fetched
    rsvpStatus: RSVPStatus;
    attendeeCount?: number;
    hostName?: string;
    potluckEnabled?: boolean;
    venuePollEnabled?: boolean;
    status?: "planning" | "finalized" | "completed";
    finalizedVenueId?: number | null;
    finalizedVenue?: {
        id: number;
        name: string;
        address: string;
        lat?: number | null;
        lng?: number | null;
    } | null;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatarUrl?: string;
    content: string;
    timestamp: string;
    chatId: string; // group or event ID
    chatName?: string;
}

export interface Reminder {
    id: string;
    title: string;
    eventId: string;
    type: "rsvp" | "upload_photos" | "upcoming";
    timeAgo?: string; // "2m ago"
}

export interface Attendee {
    id: string;
    userId: string;
    name: string;
    avatarUrl?: string;
    status: RSVPStatus;
    isHost?: boolean;
}

export interface PotluckItem {
    id: string;
    name: string;
    claimedBy?: {
        userId: string;
        name: string;
        avatarUrl?: string;
    };
}

export interface VenueVote {
    id: string;
    name: string;
    address: string;
    lat?: number | null;
    lng?: number | null;
    rating?: number | null;
    googlePlaceId?: string | null;
    voteCount: number;
    userVoted: boolean;
}

export interface PlaceResult {
    id: string;
    name: string;
    address: string;
    rating?: number | null;
    lat?: number | null;
    lng?: number | null;
}
