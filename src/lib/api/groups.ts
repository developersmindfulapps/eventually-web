/**
 * Groups API helpers
 * Matches backend endpoints documented in README:
 *   GET  /api/groups              — list user's groups
 *   POST /api/groups              — create a new group
 *   GET  /api/groups/:groupId     — get group details
 *   POST /api/groups/join         — join a group via code
 */
import { apiFetch } from "@/lib/api";
import { Group } from "@/types";

export interface CreateGroupInput {
    name: string;
    description?: string;
}

// GET /api/groups
export function fetchGroups(): Promise<Group[]> {
    return apiFetch<Group[]>("/groups");
}

// GET /api/groups/:groupId
export function fetchGroup(groupId: string): Promise<Group> {
    return apiFetch<Group>(`/groups/${groupId}`);
}

// POST /api/groups
export function createGroup(input: CreateGroupInput): Promise<Group> {
    return apiFetch<Group>("/groups", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

// POST /api/groups/join  { code: string }
export function joinGroup(code: string): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>("/groups/join", {
        method: "POST",
        body: JSON.stringify({ code }),
    });
}

// DELETE /api/groups/:groupId
export function deleteGroup(groupId: string): Promise<void> {
    return apiFetch<void>(`/groups/${groupId}`, { method: "DELETE" });
}

// POST /api/groups/:groupId/leave
export function leaveGroup(groupId: string): Promise<void> {
    return apiFetch<void>(`/groups/${groupId}/leave`, { method: "POST" });
}
