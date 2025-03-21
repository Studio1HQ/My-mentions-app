"use client";

import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

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
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="fixed top-4 right-4 flex items-center gap-4">
        {isSignedIn ? (
          <>
            <Link
              href="/comments"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
            >
              Go to Comments
            </Link>
            <SignOutButton>
              <button
                type="button"
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </SignOutButton>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>

      <h1 className="mb-8 text-4xl font-bold">Welcome to Comments App</h1>

      <div className="text-center">
        <p className="mb-4 text-xl">
          {isSignedIn
            ? "You're signed in! Click & Go to Comments to start commenting."
            : "Please sign in to start using the comments feature."}
        </p>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Features:</h2>
          <ul className="list-disc text-left space-y-2">
            <li>Real-time comments with @mentions</li>
            <li>Presence indicators to see who&apos;s online</li>
            <li>Emoji reactions to comments</li>
            <li>Audio, video, and screen recording</li>
            <li>Comment notifications</li>
            <li>Organized comment sidebar</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
