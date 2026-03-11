import { FeatureGrid } from "@/components/home/FeatureGrid";
import { Hero } from "@/components/home/Hero";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: { absolute: "EventUally" },
  description:
    "The simplest way to plan events without messy group chats. Create groups, schedule, and vote on venues—calmly.",
};

function StoreButton({
  children,
  title,
  ariaLabel,
}: {
  children: string;
  title: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      disabled
      title={title}
      aria-label={ariaLabel}
      className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-surface px-6 text-base font-semibold text-text-primary/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-not-allowed"
    >
      {children} <span className="ml-2 text-text-secondary">(Coming Soon)</span>
    </button>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />

      <section id="download" className="border-t border-border/70 bg-background">
        <Container className="py-12 sm:py-16">
          <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
              Download EventUally
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              No ads. No tracking. Just planning.
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              <a href="/dashboard" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                Go to Web Dashboard &rarr;
              </a>
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <StoreButton
                title="Launching shortly"
                ariaLabel="App Store download link coming soon"
              >
                App Store
              </StoreButton>
              <StoreButton
                title="Launching shortly"
                ariaLabel="Google Play download link coming soon"
              >
                Google Play
              </StoreButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
