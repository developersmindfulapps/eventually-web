import type { Metadata } from "next";

import { ResetSuccessPageClient } from "@/components/auth/ResetSuccessPageClient";

export const metadata: Metadata = {
  title: "Password updated",
  description:
    "Your password has been changed successfully. You can now sign in with your new password.",
  robots: { index: false, follow: false },
};

export default function PasswordResetSuccessPage() {
  return <ResetSuccessPageClient />;
}


