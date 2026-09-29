export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Getting Started" | "Groups" | "Events & RSVP" | "Privacy & Safety" | "Chat";
  isFeatured?: boolean;
}

export interface FAQCategory {
  id: string;
  name: "Getting Started" | "Groups" | "Events & RSVP" | "Privacy & Safety" | "Chat";
  description: string;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Core concepts, pricing, and how to begin using EventUAlly.",
  },
  {
    id: "groups",
    name: "Groups",
    description: "Creating groups, public vs. private communities, and permissions.",
  },
  {
    id: "events-rsvp",
    name: "Events & RSVP",
    description: "Event creation, Around You discovery, venue voting, and RSVPs.",
  },
  {
    id: "privacy-safety",
    name: "Privacy & Safety",
    description: "Location privacy, moderation, and how blocking affects groups and events.",
  },
  {
    id: "chat",
    name: "Chat",
    description: "Event-based discussions, threaded replies, and message moderation.",
  },
];

export const FAQ_DATA: FAQItem[] = [
  // ─── Getting Started ──────────────────────────────────────────
  {
    id: "what-is-eventually",
    category: "Getting Started",
    isFeatured: true,
    question: "What is EventUAlly and how does it work?",
    answer:
      "EventUAlly is a dedicated social event-planning mobile application designed to turn shared interests into real-world plans. Instead of chaotic group chats, EventUAlly brings group formation, event scheduling, venue voting, RSVP tracking, shared potlucks, and focused event chat together in one clean, purpose-built app.",
  },
  {
    id: "is-eventually-free",
    category: "Getting Started",
    isFeatured: true,
    question: "Is EventUAlly free to use?",
    answer:
      "Yes, EventUAlly is 100% free to download and use on iOS and Android. There are no ads, no third-party advertising trackers, and no subscription paywalls.",
  },
  {
    id: "how-to-get-started",
    category: "Getting Started",
    question: "How do I get started?",
    answer:
      "Download the app, create your profile, and either join an existing group via an invite link or QR code, or create your own group. You can also immediately open 'Around You' to discover public events happening near your location.",
  },
  {
    id: "know-people-beforehand",
    category: "Getting Started",
    question: "Do I need to know everyone beforehand?",
    answer:
      "Not at all. You can use EventUAlly with your existing friend circles, or join public activities and interest-based groups to meet new people around shared hobbies, sports, dinners, or meetups.",
  },

  // ─── Groups ───────────────────────────────────────────────────
  {
    id: "public-vs-private-groups",
    category: "Groups",
    isFeatured: true,
    question: "Are groups public or private?",
    answer:
      "EventUAlly supports both. Public groups are intended for open activities that people in the community can discover and join. Private groups are closed communities intended for friends, families, coworkers, or private gatherings where joining is strictly invite-only.",
  },
  {
    id: "any-member-create-event",
    category: "Groups",
    isFeatured: true,
    question: "Can any member create an event in a group?",
    answer:
      "Yes! Any group member can create an event and propose dates, times, and venue options without requiring administrator pre-approval.",
  },
  {
    id: "owners-and-admins-roles",
    category: "Groups",
    question: "What can group owners and administrators do?",
    answer:
      "Group owners and administrators can manage group settings, invite new members, promote or demote roles, review reported messages in the moderation queue, and remove events or members when necessary to maintain group safety and integrity.",
  },
  {
    id: "remove-member-from-group",
    category: "Groups",
    question: "Can a group owner remove a member?",
    answer:
      "Yes. Group owners and designated administrators can remove members from the group. Removed members lose access to that group and its associated private events and chats.",
  },
  {
    id: "owner-deletes-account",
    category: "Groups",
    question: "What happens to a group if its owner deletes their account?",
    answer:
      "When an account is deleted, personal identifying information is removed and displayed in anonymized form as 'Deleted User'. Group integrity and past event history remain intact so ongoing members can continue participating without data disruption.",
  },

  // ─── Events & RSVP ────────────────────────────────────────────
  {
    id: "how-to-discover-events",
    category: "Events & RSVP",
    question: "How do I discover events?",
    answer:
      "You can browse upcoming events inside the groups you have joined, or open the 'Around You' discovery tab to explore public gatherings, sports, dinners, and meetups in your local area.",
  },
  {
    id: "around-you-feature",
    category: "Events & RSVP",
    isFeatured: true,
    question: "How does the 'Around You' discovery feature work?",
    answer:
      "Around You detects public events within an approximate 100 km radius of your location. You can filter by category, time, or activity type and view event details, venue options, and attendee counts before deciding to join.",
  },
  {
    id: "how-rsvp-works",
    category: "Events & RSVP",
    question: "How does RSVP work?",
    answer:
      "You can mark your attendance as 'Going', 'Maybe', or 'Not Going'. Selecting 'Not Going' removes the event from your upcoming schedule, but you can always return to the event page later and update your RSVP if your availability changes.",
  },
  {
    id: "venue-voting-and-finalization",
    category: "Events & RSVP",
    question: "How does venue voting and finalization work?",
    answer:
      "When creating or planning an event, multiple venue options can be added. Group members can vote on their preferred venue. Once consensus is reached, the host or admin can finalize the chosen venue, locking in directions, map location, and time.",
  },
  {
    id: "what-is-potluck",
    category: "Events & RSVP",
    question: "What is the Potluck feature?",
    answer:
      "Potluck coordinates shared items for an event — such as food, drinks, snacks, or games. Event participants can add needed items, set quantities, and claim items so everyone knows what to bring without duplicate purchases.",
  },

  // ─── Privacy & Safety ─────────────────────────────────────────
  {
    id: "exact-location-privacy",
    category: "Privacy & Safety",
    question: "Can people see my exact location?",
    answer:
      "No. Your exact GPS location coordinates are never shown to other users. Around You only uses general proximity to surface public events in your city/region.",
  },
  {
    id: "how-blocking-works",
    category: "Privacy & Safety",
    question: "How does blocking work?",
    answer:
      "Blocking in EventUAlly is a one-way safety action. When you block a user, they immediately lose access to all groups you own and events you have created. However, groups or events owned by independent third parties are not automatically affected merely because one member blocked another.",
  },
  {
    id: "blocked-user-access",
    category: "Privacy & Safety",
    question: "Can someone I blocked still access my groups or events?",
    answer:
      "No. When you block someone, they are removed from groups you own and cannot view or join events created by you. Any existing RSVPs or votes they placed on your events are removed.",
  },
  {
    id: "what-happens-when-unblock",
    category: "Privacy & Safety",
    question: "What happens if I unblock someone?",
    answer:
      "Unblocking allows future interaction, but does not automatically restore previous group memberships, RSVPs, or votes that were removed due to the block. They would need to be invited or re-join.",
  },
  {
    id: "message-reporting",
    category: "Privacy & Safety",
    question: "What happens when I report a message?",
    answer:
      "Reported messages are sent directly to the group owner and administrator moderation queue with a snapshot of the content for review and action (dismissal or message removal).",
  },

  // ─── Chat ─────────────────────────────────────────────────────
  {
    id: "how-replies-work",
    category: "Chat",
    question: "How do replies work in event chat?",
    answer:
      "Event chats keep all conversations centered around the event. You can reply directly to any specific message. Replies include a reference preview of the parent message and can continue naturally to any depth.",
  },
  {
    id: "reply-to-reply",
    category: "Chat",
    question: "Can I reply to a reply?",
    answer:
      "Yes. You can reply to any message or subsequent reply within the event conversation thread without artificial depth limits.",
  },
  {
    id: "message-deletion-moderation",
    category: "Chat",
    question: "What happens when a message is deleted or moderated?",
    answer:
      "You can delete your own messages at any time (unless the message is under active moderation review). Once deleted, the content is replaced with 'This message was deleted' so conversation flow remains coherent.",
  },
  {
    id: "who-can-access-chat",
    category: "Chat",
    question: "Who can access event chat?",
    answer:
      "All members of the group that contains the event can access and read the event chat, regardless of whether they have confirmed their RSVP, provided they still have active access to the group.",
  },
  {
    id: "private-direct-messages",
    category: "Chat",
    question: "Can I send one-on-one direct messages?",
    answer:
      "EventUAlly focuses strictly on event-based and group conversations rather than one-on-one private DMs, keeping plans public, organized, and transparent for everyone involved.",
  },
];

export const FEATURED_FAQS = FAQ_DATA.filter((item) => item.isFeatured);
