import type { Metadata } from "next";

import { ConfirmRedirectClient } from "@/components/auth/ConfirmRedirectClient";

export const metadata: Metadata = {
  title: "Confirming",
  description: "Confirming your link. You can return to the EventUally app.",
  robots: { index: false, follow: false },
};

export default function AuthConfirmPage() {
  return <ConfirmRedirectClient />;
}


