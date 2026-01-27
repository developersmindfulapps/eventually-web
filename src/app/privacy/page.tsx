import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy",
  description:
    "EventUally Privacy Policy. Learn what data we collect, how we use it, and your choices.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="Jan 24, 2026"
      toc={[
        { id: "overview", label: "Overview" },
        { id: "information-we-collect", label: "Information we collect" },
        { id: "how-we-use-information", label: "How we use information" },
        { id: "sharing", label: "Sharing" },
        { id: "your-choices", label: "Your choices" },
      ]}
    >
      <section>
        <h2
          id="overview"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Overview
        </h2>
        <p className="mt-3">
          EventUally is built to help you plan events with friends. We aim to
          collect the minimum data needed to provide the service and to keep
          your information secure.
        </p>
      </section>

      <section>
        <h2
          id="information-we-collect"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Information we collect
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-text-primary">Account data</span>{" "}
            (such as email) to authenticate you and provide access to the app.
          </li>
          <li>
            <span className="font-semibold text-text-primary">
              Event content you provide
            </span>{" "}
            (groups, events, votes) to enable planning features.
          </li>
          <li>
            <span className="font-semibold text-text-primary">
              Basic diagnostics
            </span>{" "}
            to maintain reliability and fix bugs.
          </li>
        </ul>
      </section>

      <section>
        <h2
          id="how-we-use-information"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          How we use information
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Provide and improve the app’s core features.</li>
          <li>Prevent abuse and keep the service secure.</li>
          <li>Respond to support requests.</li>
        </ul>
      </section>

      <section>
        <h2
          id="sharing"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Sharing
        </h2>
        <p className="mt-3">
          We do not sell your personal information. We may share information
          with service providers that help us run the app (for example hosting
          and email delivery), only as needed to provide the service.
        </p>
      </section>

      <section>
        <h2
          id="your-choices"
          className="font-heading text-xl font-semibold text-text-primary"
        >
          Your choices
        </h2>
        <p className="mt-3">
          You can request help, updates, or deletion of your account by
          contacting{" "}
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


