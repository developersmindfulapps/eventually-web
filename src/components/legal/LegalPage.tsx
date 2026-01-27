import { Container } from "@/components/ui/Container";

export function LegalPage({
  title,
  lastUpdated,
  toc,
  children,
}: {
  title: string;
  lastUpdated?: string;
  toc?: Array<{ id: string; label: string }>;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-[780px]">
        <header className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
          {lastUpdated ? (
            <p className="mt-2 text-sm text-text-secondary">
              Last updated: {lastUpdated}
            </p>
          ) : null}
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_220px]">
          <div className="space-y-10 text-[15px] leading-[1.75] text-text-secondary sm:text-base sm:leading-[1.75]">
            {children}
          </div>

          {toc && toc.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5">
                <p className="font-heading text-sm font-semibold text-text-primary">
                  On this page
                </p>
                <nav aria-label="Table of contents" className="mt-3">
                  <ul className="space-y-2 text-sm">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1 inline-flex"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          ) : null}
        </div>
      </article>
    </Container>
  );
}


