import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";

// Define type for Velt user format
interface VeltUser {
  userId: string;
  name: string;
  email: string;
  photoUrl: string;
  groups?: string[]; // Optional groups for @mentions
}

export async function GET() {
  try {
    // Get the current authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json([]);
    }

    // Get all users from Clerk
    const client = await clerkClient();
    const users = await client.users.getUserList({
      limit: 100,
      orderBy: "-created_at",
    });

    // Convert Clerk users to Velt format
    const veltUsers: VeltUser[] = users.data.map((user: User) => ({
      userId: user.id,
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous",
      email: user.emailAddresses[0]?.emailAddress || "",
      photoUrl: user.imageUrl || "",
      groups: ["organization"], // Add users to a default organization group
    }));

    // Return the users in the format Velt expects
    return NextResponse.json({
      users: veltUsers,
      groups: [
        {
          id: "organization",
          name: "Organization",
          description: "All users in the organization",
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching users from Clerk:", error);
    return NextResponse.json({ users: [], groups: [] }, { status: 500 });
  }
}
