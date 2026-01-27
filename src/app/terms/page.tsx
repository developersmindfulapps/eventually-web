import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Terms of Service",
  description:
    "EventUally Terms of Service. The rules for using the app and what you can expect from the service.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="Jan 24, 2026"
      toc={[
        { id: "acceptance", label: "Acceptance" },
        { id: "use-of-the-service", label: "Use of the service" },
        { id: "availability", label: "Availability" },
        { id: "termination", label: "Termination" },
        { id: "contact", label: "Contact" },
      ]}
    >
      <section>
        <h2
          id="acceptance"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Acceptance
        </h2>
        <p className="mt-3">
          By using EventUally, you agree to these Terms. If you do not agree,
          do not use the service.
        </p>
      </section>

      <section>
        <h2
          id="use-of-the-service"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Use of the service
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Use the app only for lawful purposes.</li>
          <li>Do not attempt to disrupt or abuse the service.</li>
          <li>
            You are responsible for content you create or share in groups.
          </li>
        </ul>
      </section>

      <section>
        <h2
          id="availability"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Availability
        </h2>
        <p className="mt-3">
          We work to keep the service available, but it may be interrupted for
          maintenance, updates, or issues outside of our control.
        </p>
      </section>

      <section>
        <h2
          id="termination"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Termination
        </h2>
        <p className="mt-3">
          You may stop using the service at any time. We may suspend or
          terminate access if we believe you are violating these Terms or
          harming the service.
        </p>
      </section>

      <section>
        <h2
          id="contact"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Contact
        </h2>
        <p className="mt-3">
          Questions? Contact{" "}
          <a
            className="font-semibold text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-secondary"
            href="mailto:support@eventuallyapp.in"
          >
            support@eventuallyapp.in
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}


