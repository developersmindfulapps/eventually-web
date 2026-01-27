import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { SupportFormCard } from "@/components/support/SupportFormCard";

export const metadata = {
  title: "Support",
  description:
    "Get help with EventUally. Contact support and find quick answers about verification, privacy, and account deletion.",
};

function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-xl border border-border bg-surface px-4 py-3">
      <summary className="cursor-pointer list-none font-semibold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-lg px-1 py-1">
        <span className="inline-flex items-center justify-between w-full gap-4">
          <span>{question}</span>
          <span
            aria-hidden="true"
            className="text-text-secondary transition-transform group-open:rotate-45"
          >
            +
          </span>
        </span>
      </summary>
      <div className="mt-2 text-sm leading-6 text-text-secondary">{children}</div>
    </details>
  );
}

export default function SupportPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary">
          Support
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-text-secondary">
          Need help with EventUally? Contact us and we’ll get back within 24
          hours.
        </p>

        <div className="mt-8 grid gap-5">
          <Card>
            <h2 className="font-heading text-lg font-semibold text-text-primary">
              Prefer email?
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Email us at{" "}
              <a
                className="font-semibold text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-secondary"
                href="mailto:support@eventuallyapp.in"
              >
                support@eventuallyapp.in
              </a>{" "}
              and include your account email + a short description of the issue.
            </p>
            <div className="mt-5">
              <ButtonLink
                href="mailto:support@eventuallyapp.in"
                variant="secondary"
                aria-label="Email EventUally support"
              >
                Email Support
              </ButtonLink>
            </div>
          </Card>

          <SupportFormCard />

          <Card>
            <h2 className="font-heading text-lg font-semibold text-text-primary">
              Common questions
            </h2>
            <div className="mt-4 grid gap-3">
              <FaqItem question="How do I delete my account?">
                <p>
                  You’re in control. You can delete your account from inside the
                  app:
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Open EventUally</li>
                  <li>Go to Settings</li>
                  <li>Select Account</li>
                  <li>Tap Delete Account and confirm</li>
                </ol>
                <p className="mt-2">
                  Deletion is permanent and can’t be undone. If you can’t access
                  the app, email{" "}
                  <a
                    className="font-semibold text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-secondary"
                    href="mailto:support@eventuallyapp.in"
                  >
                    support@eventuallyapp.in
                  </a>{" "}
                  from the email you used for EventUally.
                </p>
                <p className="mt-2">
                  Full steps:{" "}
                  <a
                    className="font-semibold text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-secondary"
                    href="/account-deletion"
                  >
                    Account Deletion
                  </a>
                  .
                </p>
              </FaqItem>
              <FaqItem question="Why didn’t I receive a verification email?">
                <p>Try these quick steps:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Wait a few minutes and refresh your inbox</li>
                  <li>Check Spam / Junk and search for “EventUally”</li>
                  <li>
                    Confirm you signed up with the right email (including any
                    typos)
                  </li>
                  <li>Request a new verification email in the app</li>
                  <li>
                    If you used Apple “Hide My Email”, check that relay inbox
                  </li>
                </ul>
                <p className="mt-2">
                  Still stuck? Contact{" "}
                  <a
                    className="font-semibold text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-secondary"
                    href="mailto:support@eventuallyapp.in"
                  >
                    support@eventuallyapp.in
                  </a>{" "}
                  and include the email you tried to verify.
                </p>
              </FaqItem>
              <FaqItem question="Is my data private?">
                <p>
                  We collect only what’s needed to run EventUally (for example,
                  your email for login and the events/groups you create).
                </p>
                <p className="mt-2">
                  We do not sell your personal information. We may use trusted
                  service providers (like hosting and email delivery) only to
                  operate the service.
                </p>
                <p className="mt-2">
                  You can delete your account at any time (which removes your
                  account from the service). For details, see{" "}
                  <a
                    className="font-semibold text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-secondary"
                    href="/privacy"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </FaqItem>
              <FaqItem question="Do you show ads or use tracking?">
                <p>
                  EventUally does not show ads. We don’t use third-party
                  advertising trackers.
                </p>
                <p className="mt-2">
                  Like most apps, we may collect limited diagnostics to keep the
                  service reliable and fix bugs. We don’t use that information
                  to sell your data.
                </p>
              </FaqItem>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}


