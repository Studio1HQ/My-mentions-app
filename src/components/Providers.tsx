"use client";

import { ClerkProvider, useUser } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { VeltProvider, useSetDocument, useIdentify } from "@veltdev/react";

function VeltProviderWithAuth({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const apiKey = process.env.NEXT_PUBLIC_VELT_API_KEY;

  // Create a Velt user from Clerk's user data
  const veltUser =
    isSignedIn && user
      ? {
          userId: user.id,
          name: user.fullName || user.username || "Anonymous",
          email: user.emailAddresses[0]?.emailAddress || "",
          photoUrl: user.imageUrl || "",
          organizationId: "default-org",
        }
      : {
          userId: "anonymous",
          name: "Anonymous",
          email: "",
          photoUrl: "",
          organizationId: "default-org",
        };

  if (isSignedIn && user) {
    console.log("Debug - Identifying Velt User:", veltUser);
  }
  // Tell Velt who the current user is
  useIdentify(veltUser);

  // Set document ID
  useSetDocument("comments-app", {
    documentName: "Comments Application",
  });

  // Wait for Clerk to load before rendering VeltProvider
  if (!isLoaded) {
    return <p>Loading authentication...</p>;
  }

  if (!apiKey) {
    console.error("❌ Velt API key is missing!");
    return <p>Missing API Key</p>;
  }

  // Build Velt configuration
  const veltConfig = {
    apiKey,
    debug: true,
    user: isSignedIn && user ? veltUser : null, // Only pass user to config when signed in
    organizationId: "default-org",
    defaultConfig: {
      comments: {
        enabled: true,
        mentions: {
          enabled: true,
          enableUserMentions: true,
          enableGroupMentions: true,
          enableHereMentions: true,
          userSuggestions: async () => {
            if (!isSignedIn || !user) return [];
            return [
              {
                id: user.id,
                name: user.fullName || user.username || "Anonymous",
                email: user.emailAddresses[0]?.emailAddress || "",
                photoUrl: user.imageUrl || "",
              },
            ];
          },
        },
        threadSubscription: {
          enabled: true,
          autoSubscribeOnComment: true,
          autoSubscribeOnMention: true,
          showUnreadIndicator: true,
          defaultSubscribed: true,
        },
        sidebar: {
          enabled: true,
          defaultOpen: true,
          showResolved: true,
          position: "left",
        },
      },
      presence: {
        enabled: true,
        showInactiveUsers: false,
      },
      notifications: {
        enabled: true,
        showUnreadIndicator: true,
        defaultIsOpen: false,
        subscribeToThreads: true,
        notifyOnReply: true,
        notifyOnReaction: true,
        notifyOnResolution: true,
        useThreadSubscription: true,
        defaultSubscribed: true,
      },
      reactions: {
        enabled: true,
        emojis: ["👍", "👎", "❤️", "😄", "😢", "😮"],
      },
      recorder: {
        enabled: true,
        video: true,
        audio: true,
        screen: true,
      },
    },
  };

  console.log("Debug - Velt Config:", JSON.stringify(veltConfig, null, 2));

  return <VeltProvider {...veltConfig}>{children}</VeltProvider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        signIn: { baseTheme: undefined },
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <VeltProviderWithAuth>{children}</VeltProviderWithAuth>
      </ThemeProvider>
    </ClerkProvider>
  );
}
