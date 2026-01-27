import type { Metadata } from "next";

import { PasswordResetClient } from "@/components/auth/PasswordResetClient";

export const metadata: Metadata = {
  title: "Set a new password",
  description:
    "Set a new password for your EventUally account.",
  robots: { index: false, follow: false },
};

export default function PasswordResetPage() {
  return <PasswordResetClient />;
}


