"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/ui/Sidebar";
import { FloatingChat } from "@/components/event/FloatingChat";
import { EventHeader } from "@/components/event/EventHeader";
import { EventTabs } from "@/components/event/EventTabs";
import { EventDetailsTab } from "@/components/event/EventDetailsTab";
import { PotluckTab } from "@/components/event/PotluckTab";
import { VenuePollTab } from "@/components/event/VenuePollTab";
import { EventChat } from "@/components/event/EventChat";

import { useEvent, useEventAttendees, useEventPotluck, useEventVenues, useEventChat } from "@/hooks/useData";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function EventDetailsPage() {
    const params = useParams();
    const eventId = params.eventId as string;
    const [activeTab, setActiveTab] = useState("details");
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Data Fetching
    const { data: event, isLoading: eventLoading } = useEvent(eventId);
    const { data: attendees } = useEventAttendees(eventId);
    const { data: potluckItems } = useEventPotluck(eventId);
    const { data: venues } = useEventVenues(eventId);
    const { data: messages } = useEventChat(eventId);

    useEffect(() => {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    }, []);

    if (eventLoading) {
        return (
            <AuthGate>
                <div className="flex min-h-screen flex-col bg-white">
                    <Header />
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar />
                        <main className="flex-1 p-8">
                            <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
                        </main>
                    </div>
                </div>
            </AuthGate>
        );
    }

    if (!event) {
        return (
            <AuthGate>
                <div className="flex min-h-screen flex-col bg-white">
                    <Header />
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar />
                        <main className="flex-1 p-8 text-center text-gray-500">
                            Event not found.
                        </main>
                    </div>
                </div>
            </AuthGate>
        );
    }

    const isHost = currentUser?.id === event.hostName; // Logic needs real host ID check, simplified for now

    return (
        <AuthGate>
            <div className="flex min-h-screen flex-col bg-white">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <main className="relative flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-5xl space-y-6">
                            {/* Header */}
                            <EventHeader event={event} isHost={isHost} />

                            {/* Tabs & Content */}
                            <div className="bg-white shadow-sm sm:rounded-xl">
                                <EventTabs
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    potluckEnabled={event.potluckEnabled}
                                    venuePollEnabled={event.venuePollEnabled}
                                />

                                <div className="p-6">
                                    {activeTab === "details" && <EventDetailsTab event={event} attendees={attendees} />}
                                    {activeTab === "potluck" && <PotluckTab eventId={eventId} items={potluckItems || []} currentUser={currentUser} />}
                                    {activeTab === "venue" && <VenuePollTab eventId={eventId} venues={venues || []} />}
                                    {activeTab === "chat" && <EventChat eventId={eventId} messages={messages || []} currentUser={currentUser} />}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                <FloatingChat currentUser={currentUser} />
            </div>
        </AuthGate>
    );
}
