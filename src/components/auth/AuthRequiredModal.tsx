"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useEffect } from "react";

export function AuthRequiredModal() {
    // Prevent scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-6">
                    <Lock className="h-8 w-8 text-indigo-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Join EventUally
                </h2>
                <p className="text-gray-500 mb-8">
                    Sign up or log in to view full event details, RSVP, and chat with your groups.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Sign up
                    </Link>
                </div>

                <p className="mt-6 text-xs text-gray-400">
                    EventUally protects your privacy and data.
                </p>
            </div>
        </div>
    );
}
