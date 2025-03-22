"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { MessageSquare, Users, Bell, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background/90 to-background/80 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-96 w-96 h-full bg-gradient-to-r from-primary/5 to-transparent rotate-12 blur-3xl transform -translate-x-full animate-[gradient-shift_15s_ease_infinite_alternate]" />
        <div className="absolute top-0 -right-96 w-96 h-full bg-gradient-to-l from-secondary/5 to-transparent -rotate-12 blur-3xl transform translate-x-full animate-[gradient-shift_20s_ease_infinite_alternate]" />
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/5 blur-3xl rounded-full" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Mentions</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              href="/comments"
              className="text-sm font-medium hover:text-primary"
            >
              Comments
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isSignedIn ? (
              <>
                <Link
                  href="/comments"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-700 bg-primary/10 px-4 text-sm font-medium text-primary shadow-sm transition-all duration-200 hover:bg-primary/20 hover:shadow-md hover:border-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary/90 px-8 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#0f172a]/80 via-[#0d1425] to-[#0a101f]/90 relative">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />

        <div className="container max-w-6xl mx-auto px-4 md:px-6 relative">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Collaborative
                  <br />
                  Commenting,{" "}
                  <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Reimagined
                  </span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A powerful platform for real-time collaboration with
                  @mentions, notifications, and interactive discussions.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {isSignedIn ? (
                  <Link
                    href="/comments"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary/90 px-8 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                  </Link>
                ) : (
                  <Link
                    href="/sign-in"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary/90 px-8 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/comments"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-700 bg-background/50 px-8 text-sm font-medium shadow-sm transition-all duration-200 hover:bg-background/70 hover:text-primary hover:shadow-md hover:border-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  View Demo
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto flex justify-center rounded-xl border bg-background p-2 shadow-lg">
              <div className="w-full max-w-md overflow-hidden rounded-lg shadow-sm bg-background p-6 border">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">JD</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                    <p className="text-sm mt-1">
                      Hey team, I think we should add{" "}
                      <span className="text-primary font-medium">@Sarah</span>{" "}
                      to this discussion about the new feature!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pt-4">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-secondary">SJ</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                    <p className="text-sm mt-1">
                      Thanks for the mention! I&apos;ll review the design and
                      share my thoughts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#0a101f] to-[#0f172a]">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need for seamless team collaboration and
                communication
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 mt-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-800 bg-gradient-to-b from-background to-background/80 p-6 shadow-md backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mt-2">
                Real-time @mentions
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Quickly tag team members and get their attention with seamless
                @mentions.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-800 bg-gradient-to-b from-background to-background/80 p-6 shadow-md backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mt-2">
                Presence Indicators
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                See who&apos;s online and collaborating in real-time with your
                team.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-800 bg-gradient-to-b from-background to-background/80 p-6 shadow-md backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mt-2">
                Smart Notifications
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Never miss important comments with our intelligent notification
                system.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-800 bg-gradient-to-b from-background to-background/80 p-6 shadow-md backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mt-2">Emoji Reactions</h3>
              <p className="text-sm text-muted-foreground text-center">
                React to comments with a variety of emojis to express yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#0f172a] to-[#142033] border-t border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />

        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-20" />

        <div className="container max-w-6xl mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center p-1 bg-primary/5 border border-primary/10 rounded-full mb-4">
              <span className="px-4 py-1.5 text-sm font-medium text-primary">
                Join thousands of teams
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of teams already using our platform for better
                collaboration.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
              {isSignedIn ? (
                <Link
                  href="/comments"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary px-10 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary px-10 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gradient-to-b from-[#070c16] to-[#0a1020] border-t border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5" />

        <div className="container max-w-6xl mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center gap-8 text-center md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">
                © 2023 Mentions App. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link
                href="#"
                className="text-sm hover:text-primary hover:underline underline-offset-4 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm hover:text-primary hover:underline underline-offset-4 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm hover:text-primary hover:underline underline-offset-4 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="#"
                className="text-sm hover:text-primary hover:underline underline-offset-4 transition-colors"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
