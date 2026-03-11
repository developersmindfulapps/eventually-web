import Link from "next/link";

function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link
                    href="/"
                    aria-label="EventUally home"
                    className="font-heading text-lg font-semibold tracking-tight text-text-primary rounded-md px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                    EventUally
                </Link>
                <nav aria-label="Primary" className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                        Sign up
                    </Link>
                </nav>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="border-t border-border bg-footer-bg">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-text-secondary">
                        <span className="font-heading font-semibold text-text-primary">
                            EventUally
                        </span>{" "}
                        — plan together, effortlessly.
                    </div>
                    <nav
                        aria-label="Footer"
                        className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
                    >
                        <Link href="/support" className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1">
                            Support
                        </Link>
                        <Link href="/privacy" className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1">
                            Terms of Service
                        </Link>
                        <Link href="/account-deletion" className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1">
                            Account Deletion
                        </Link>
                    </nav>
                </div>
                <div className="mt-8 text-xs text-text-secondary">
                    © {new Date().getFullYear()} EventUally. All rights reserved.
                    <span className="mx-2" aria-hidden="true">•</span>
                    EventUally is built with modern security practices and encrypted infrastructure.
                </div>
            </div>
        </footer>
    );
}

// Wraps all marketing pages: /, /login, /signup, /terms, /privacy, /support, etc.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
            <Footer />
        </>
    );
}
