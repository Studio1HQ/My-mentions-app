"use client";

import { ClerkProvider, useUser } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { VeltProvider, useSetDocument, useContactUtils } from "@veltdev/react";
import { useEffect, useState } from "react";

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

  // Wait for Clerk to load before rendering VeltProvider
  if (!isLoaded) {
    return <p>Loading authentication...</p>;
  }

  if (!apiKey) {
    console.error("❌ Velt API key is missing!");
    return <p>Missing API Key</p>;
  }

  // Build Velt configuration - removed userSuggestions as we'll use updateContactList instead
  const veltConfig = {
    apiKey,
    debug: true,
    user: veltUser, // Pass user directly to the provider config
    organizationId: "default-org",
    defaultConfig: {
      comments: {
        enabled: true,
        mentions: {
          enabled: true,
          enableUserMentions: true,
          enableGroupMentions: true,
          enableHereMentions: true,
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

// Figma-like implementation that allows mentioning any user
function VeltUserSetup({ children }: { children: ReactNode }) {
  const { user, isSignedIn } = useUser();
  const contactElement = useContactUtils();
  const [allUsers, setAllUsers] = useState<
    Array<{
      userId: string;
      name: string;
      email: string;
      photoUrl: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Set document ID
  useSetDocument("comments-app", {
    documentName: "Comments Application",
  });

  // Fetch all users from our API
  useEffect(() => {
    async function fetchUsers() {
      if (!isSignedIn) return;

      try {
        setLoading(true);
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const users = await response.json();
        setAllUsers(users);
        console.log(`Fetched ${users.length} users for mentions`);
      } catch (error) {
        console.error("Error fetching users:", error);

        // Fallback to just the current user if API fails
        if (user) {
          setAllUsers([
            {
              userId: user.id,
              name: user.fullName || user.username || "Anonymous",
              email: user.emailAddresses[0]?.emailAddress || "",
              photoUrl: user.imageUrl || "",
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [isSignedIn, user]);

  // Update contact list with all users
  useEffect(() => {
    if (contactElement && allUsers.length > 0 && !loading) {
      contactElement.updateContactList(allUsers, { merge: false });
      console.log(
        `Contact list updated with ${allUsers.length} users for mentions`
      );
    }
  }, [contactElement, allUsers, loading]);

  return <>{children}</>;
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
        <VeltProviderWithAuth>
          <VeltUserSetup>{children}</VeltUserSetup>
        </VeltProviderWithAuth>
      </ThemeProvider>
    </ClerkProvider>
  );
}
