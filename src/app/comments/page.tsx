"use client";

import {
  VeltComments,
  VeltCommentTool,
  useSetDocument,
  VeltPresence,
  VeltCommentsSidebar,
  VeltReactionTool,
  VeltNotificationsTool,
  VeltRecorderTool,
} from "@veltdev/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CommentsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/comments");
    }
  }, [isLoaded, isSignedIn, router]);

  // Set the document ID for this specific page
  useSetDocument("comments-page", {
    documentName: "Comments Page",
    documentDescription: "Page for managing and viewing comments",
    metadata: {
      type: "comments",
      status: "active",
    },
  });

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Don't show anything while redirecting
  }

  return (
    <main className="min-h-screen p-4">
      {/* Show who's online */}
      <div className="fixed top-4 right-4 z-50">
        <VeltPresence />
      </div>

      {/* Notifications bell */}
      <div className="fixed top-4 right-24 z-50">
        <VeltNotificationsTool />
      </div>

      <div className="flex">
        {/* Comments sidebar */}
        <div className="w-80 h-screen overflow-y-auto border-r bg-background p-4">
          <VeltCommentsSidebar documentId="comments-page" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          <h1 className="mb-4 text-2xl font-bold">Comments</h1>
          <div className="relative min-h-[500px] rounded-lg border bg-background p-4">
            <p className="mb-4">
              Select text to add a comment, or use the comment tool to comment
              on an area. Use @ to mention someone.
            </p>

            {/* Enable reactions */}
            <VeltReactionTool />

            {/* Comments */}
            <VeltComments
              id="comments-page"
              threadOptions={{
                showResolved: true,
                enableResolve: true,
                enableDraft: true,
              }}
            />

            {/* Comment tools */}
            <div className="fixed bottom-4 right-4 flex gap-2">
              <VeltRecorderTool />
              <VeltCommentTool id="comments-page" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
