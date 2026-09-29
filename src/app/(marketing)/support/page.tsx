import React from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { SupportFormCard } from "@/components/support/SupportFormCard";
import { FullFaqSection } from "@/components/support/FullFaqSection";
import { Mail, MessageSquareText, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Support & FAQs — EventUally",
  description:
    "Frequently asked questions and support for the EventUally mobile app. Learn how groups, events, Around You discovery, and privacy features work.",
};

export default function SupportPage() {
  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Support Header */}
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-badge-border bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>HELP &amp; FAQ CENTER</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            How can we help?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Find quick answers to how EventUAlly works below. If your question isn&apos;t covered, our team is ready to help.
          </p>
        </div>

        {/* 1. Full FAQ Section (Organized by Categories with Search) */}
        <FullFaqSection />

        {/* 2. Visual Separator & Transition to Contact Support */}
        <div className="my-16 border-t border-border/80 pt-16">
          <div className="text-center sm:text-left mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <MessageSquareText className="h-3.5 w-3.5" />
              <span>STILL NEED HELP?</span>
            </div>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Send us a message and we&apos;ll get back to you.
            </h2>
            <p className="mt-2 text-sm text-text-secondary sm:text-base">
              We typically respond to support inquiries within 24 hours.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Email Option Card */}
            <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-surface-subtle border-border">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-text-primary">
                    Prefer direct email?
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary sm:text-sm">
                    Email us directly at{" "}
                    <a
                      href="mailto:support@eventuallyapp.in"
                      className="font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
                    >
                      support@eventuallyapp.in
                    </a>{" "}
                    with your account email and a description of the issue.
                  </p>
                </div>
              </div>
              <ButtonLink
                href="mailto:support@eventuallyapp.in"
                variant="secondary"
                size="sm"
                className="flex-shrink-0"
              >
                Open Email
              </ButtonLink>
            </Card>

            {/* Support Form Card */}
            <SupportFormCard />
          </div>
        </div>
      </div>
    </Container>
  );
}
