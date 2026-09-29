import React, { Suspense } from 'react';
import { Container } from '@/components/ui/Container';
import { LegalLanguageSelector } from './LegalLanguageSelector';
import { Info } from 'lucide-react';

interface LegalPageProps {
  title: string;
  lastUpdated?: string;
  effectiveDate?: string;
  toc?: Array<{ id: string; label: string }>;
  showLanguageSelector?: boolean;
  requestedLanguage?: string;
  resolvedLanguage?: string;
  languageName?: string;
  isFallback?: boolean;
  isRTL?: boolean;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  lastUpdated,
  effectiveDate,
  toc,
  showLanguageSelector = true,
  requestedLanguage = 'en',
  resolvedLanguage = 'en',
  languageName,
  isFallback = false,
  isRTL = false,
  children,
}: LegalPageProps) {
  return (
    <Container className="py-12 sm:py-16">
      <article
        dir={isRTL ? 'rtl' : 'ltr'}
        className="mx-auto max-w-[840px]"
      >
        <header className="mb-8 border-b border-border/60 pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                {title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                {effectiveDate ? (
                  <span>
                    <strong>Effective Date:</strong> {effectiveDate}
                  </span>
                ) : null}
                {lastUpdated ? (
                  <span>
                    <strong>Last Updated:</strong> {lastUpdated}
                  </span>
                ) : null}
              </div>
            </div>

            {showLanguageSelector ? (
              <div className="flex-shrink-0 pt-1">
                <Suspense
                  fallback={
                    <div className="h-9 w-32 rounded-xl border border-border bg-surface animate-pulse" />
                  }
                >
                  <LegalLanguageSelector currentLanguage={requestedLanguage} />
                </Suspense>
              </div>
            ) : null}
          </div>

          {/* Translation Fallback Notice */}
          {isFallback && requestedLanguage !== 'en' ? (
            <div
              className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200"
              role="status"
              dir="ltr"
            >
              <Info className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="leading-relaxed">
                English is the canonical legal source for EventUAlly. A complete{' '}
                <strong>{languageName || requestedLanguage}</strong> translation is not yet available;
                displaying the English version.
              </p>
            </div>
          ) : null}
        </header>

        <div className={`grid gap-10 ${toc && toc.length > 0 ? 'lg:grid-cols-[1fr_240px]' : ''}`}>
          <div className="space-y-6 text-[15px] leading-[1.75] text-text-secondary sm:text-base sm:leading-[1.75]">
            {children}
          </div>

          {toc && toc.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-xs">
                <p className="font-heading text-sm font-semibold text-text-primary">
                  On this page
                </p>
                <nav aria-label="Table of contents" className="mt-3">
                  <ul className="space-y-2 text-sm">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1 block transition-colors line-clamp-1"
                          title={item.label}
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
