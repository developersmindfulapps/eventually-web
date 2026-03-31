"use client";

import { useParams, useRouter } from "next/navigation";
import { CreateEventModal } from "@/components/events/CreateEventModal";

export default function CreateEventPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = (Array.isArray(params?.groupId) ? params.groupId[0] : params?.groupId) ?? "";

    return (
        <CreateEventModal
            groupId={groupId}
            // When the modal closes (cancel or success), go back to the group page
            onClose={() => router.push(`/groups/${groupId}`)}
        />
    );
}
