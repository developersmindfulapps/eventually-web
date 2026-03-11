import { ButtonLink } from "@/components/ui/Button";
import { CenteredCard } from "@/components/ui/CenteredCard";

export const metadata = {
  title: "This link is no longer valid",
  description: "This link may have expired or already been used.",
  robots: { index: false, follow: false },
};

function ErrorIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-primary"
    >
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AuthErrorPage() {
  return (
    <CenteredCard>
      <ErrorIcon />
      <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">
        This link is no longer valid
      </h1>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        It may have expired or already been used.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/support" variant="primary" aria-label="Try again via support">
          Try again
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" aria-label="Back to home">
          Back to home
        </ButtonLink>
      </div>
    </CenteredCard>
  );
}


