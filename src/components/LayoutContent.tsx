"use client";

import Link from "next/link";
import { useAuth, useUser, useOrganization } from "@clerk/nextjs";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { NotificationBell } from "@/components/NotificationBell";
import { VeltPresence, useVeltClient } from "@veltdev/react";
import { useEffect, useState } from "react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();
  const { client } = useVeltClient();
  const [veltError, setVeltError] = useState<string | null>(null);

  // Set up Velt user and document
  useEffect(() => {
    async function initializeVelt() {
      if (!client || !isLoaded || !isSignedIn || !userId || !user) return;

      try {
        // Set up user identification
        await client.identify({
          userId,
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          organizationId: organization?.id || "default-org",
        });

        // Set up document context
        await client.setDocument("mentions-app", {
          documentName: "Next.js Mentions App",
        });
      } catch (error) {
        console.error("Error initializing Velt:", error);
        setVeltError(
          "Failed to initialize real-time features. Please check if you have any content blockers enabled."
        );
      }
    }

    initializeVelt();
  }, [client, isLoaded, isSignedIn, userId, user, organization]);

  return (
    <NotificationsProvider>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">Next.js Mentions</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/comments"
                className="transition-colors hover:text-foreground/80"
              >
                Comments
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <NotificationBell />
          </div>
        </div>
      </header>
      <main className="container py-6">
        {veltError && (
          <div className="mb-4 rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Connection Warning
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{veltError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {isLoaded && isSignedIn && !veltError && <VeltPresence />}
        {children}
      </main>
    </NotificationsProvider>
  );
}
