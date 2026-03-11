"use client";

import { Home, Calendar, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { useMyGroups } from "@/hooks/useData";

export function LeftSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { data: groups } = useMyGroups();

    return (
        <aside
            className={cn(
                "hidden flex-col border-r border-gray-200 bg-white transition-all duration-300 md:flex",
                collapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            <div className="flex h-14 items-center justify-end px-4">
                {/* Toggle Button logic could go here, or handled by a global state */}
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
                <NavItem icon={Home} label="Home" active collapsed={collapsed} />
                <NavItem icon={Calendar} label="My Calendar" collapsed={collapsed} />
                <NavItem icon={Users} label="Discover Groups" collapsed={collapsed} />

                <div className="my-4 border-t border-gray-100" />

                {!collapsed && (
                    <div className="px-2 pb-2">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-md border-0 bg-gray-50 py-1.5 pl-9 pr-2 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Search groups..."
                            />
                        </div>
                    </div>
                )}

                <div className="mt-2 space-y-1">
                    {!collapsed && <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Groups</h3>}
                    {groups?.map((group) => (
                        <GroupItem key={group.id} group={group} collapsed={collapsed} />
                    ))}
                </div>
            </nav>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center justify-center p-4 text-gray-400 hover:text-gray-600 border-t border-gray-100"
            >
                {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
        </aside>
    );
}

function NavItem({ icon: Icon, label, active, collapsed }: any) {
    return (
        <a
            href="#"
            className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                collapsed && "justify-center"
            )}
        >
            <Icon
                className={cn(
                    "h-5 w-5 flex-shrink-0",
                    active ? "text-indigo-700" : "text-gray-400 group-hover:text-gray-500",
                    !collapsed && "mr-3"
                )}
            />
            {!collapsed && <span>{label}</span>}
        </a>
    );
}

function GroupItem({ group, collapsed }: { group: any; collapsed: boolean }) {
    // Generate initials or use icon
    const initials = group.name.substring(0, 2).toUpperCase();
    const colorClass = "bg-orange-100 text-orange-600"; // Dynamic colors could be better

    return (
        <a
            href="#"
            className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-gray-50",
                collapsed && "justify-center"
            )}
        >
            <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-bold text-xs", colorClass, !collapsed && "mr-3")}>
                {initials}
            </div>
            {!collapsed && (
                <div className="flex flex-1 items-center justify-between truncate">
                    <span className="truncate text-gray-700">{group.name}</span>
                    {group.unreadCount > 0 && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                </div>
            )}
            {collapsed && group.unreadCount > 0 && (
                <span className="absolute top-1 right-1 inline-block h-2 w-2 rounded-full bg-indigo-600" />
            )}
        </a>
    );
}
