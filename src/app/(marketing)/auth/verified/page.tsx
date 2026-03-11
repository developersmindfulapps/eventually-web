import type { Metadata } from "next";

import { VerifiedPageClient } from "@/components/auth/VerifiedPageClient";

export const metadata: Metadata = {
  title: "Email verified",
  description:
    "Your account is now active.",
  robots: { index: false, follow: false },
};

export default function AuthVerifiedPage() {
  return <VerifiedPageClient />;
}


