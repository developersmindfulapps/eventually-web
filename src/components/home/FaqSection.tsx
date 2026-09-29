"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FEATURED_FAQS } from "@/lib/faqData";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative scroll-mt-20 border-t border-border/70 bg-surface/30 py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-badge-border bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
            <Sparkles className="h-3.5 w-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Everything you need to know.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            Quick answers to how EventUAlly helps you organize real-world gatherings.
          </p>
        </div>

        {/* Featured FAQ Accordion */}
        <div className="mx-auto mt-12 max-w-3xl space-y-3.5">
          {FEATURED_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-primary/50 bg-surface shadow-sm"
                    : "border-border bg-surface/80 hover:border-border/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 text-left font-heading text-base font-bold text-text-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-text-muted transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-text-secondary border-t border-border/50 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* "Have more questions? View all FAQs" */}
        <div className="mx-auto mt-10 max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6 text-center sm:text-left">
          <div>
            <h3 className="font-heading text-base font-bold text-text-primary">
              Have more questions?
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Explore our full FAQ guide covering Groups, Privacy, Blocking, and Chat.
            </p>
          </div>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95 flex-shrink-0"
          >
            <span>View all FAQs</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
