"use client";

import { cn } from "@/lib/cn";

interface EventTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    potluckEnabled?: boolean;
    venuePollEnabled?: boolean;
}

export function EventTabs({ activeTab, setActiveTab, potluckEnabled, venuePollEnabled }: EventTabsProps) {
    const tabs = [
        { id: "details", label: "Details" },
        ...(potluckEnabled ? [{ id: "potluck", label: "Potluck" }] : []),
        ...(venuePollEnabled ? [{ id: "venue", label: "Venue Poll" }] : []),
        { id: "chat", label: "Chat" },
    ];

    return (
        <div className="border-b border-gray-200 bg-white px-6 sm:rounded-t-xl">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                            activeTab === tab.id
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                        aria-current={activeTab === tab.id ? "page" : undefined}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
