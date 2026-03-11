import { LegalPage } from "@/components/legal/LegalPage";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Account Deletion",
  description:
    "How to delete your EventUally account in-app, plus support contact and a permanent deletion warning.",
};

export default function AccountDeletionPage() {
  return (
    <LegalPage title="Account Deletion" lastUpdated="Jan 24, 2026">
      <section>
        <p>
          You can delete your EventUally account directly in the app. If you
          have trouble, support can help.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Delete your account in-app
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Open EventUally.</li>
          <li>Go to Settings.</li>
          <li>Select “Account”.</li>
          <li>Tap “Delete Account”.</li>
          <li>Confirm to permanently delete your account.</li>
        </ol>
      </section>

      <section>
        <Card className="bg-primary-soft">
          <h2 className="font-heading text-lg font-semibold text-text-primary">
            Important
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Account deletion is permanent. Your account data and any associated
            content may be removed and cannot be recovered.
          </p>
        </Card>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Need help?
        </h2>
        <p className="mt-3">
          Contact{" "}
          <a
            className="font-semibold text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-secondary"
            href="mailto:support@eventuallyapp.in"
          >
            support@eventuallyapp.in
          </a>{" "}
          and we’ll help you complete the request.
        </p>
      </section>
    </LegalPage>
  );
}


