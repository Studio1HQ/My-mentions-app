import { type NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request | NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as NextRequest);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, you would fetch the comment from a database
    const comment = {
      id: params.id,
      content: "Test comment",
      authorId: userId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(comment);
  } catch (error) {
    logger.error("Error fetching comment", { error });
    return NextResponse.json(
      { error: "Failed to fetch comment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request | NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as NextRequest);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // In a real app, you would update the comment in a database
    const updatedComment = {
      id: params.id,
      content,
      authorId: userId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(updatedComment);
  } catch (error) {
    logger.error("Error updating comment", { error });
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request | NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as NextRequest);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete mentions first
    await prisma.mention.deleteMany({
      where: { commentId: params.id },
    });

    // Then delete the comment
    await prisma.comment.delete({
      where: { id: params.id },
    });

    // Return 204 No Content
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    logger.error("Error deleting comment", { error });
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request | NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request as NextRequest);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Extract mentions from content
    const mentions = Array.from(content.matchAll(/@(\w+)/g)).map(
      (match) => (match as RegExpMatchArray)[1]
    );

    // Update comment and create mentions
    const updatedComment = await prisma.comment.update({
      where: { id: params.id },
      data: { content },
      include: {
        mentions: true,
        replies: true,
      },
    });

    if (mentions.length > 0) {
      await prisma.mention.createMany({
        data: mentions.map((userId) => ({
          commentId: params.id,
          userId,
        })),
      });

      await prisma.notification.createMany({
        data: mentions.map((userId) => ({
          userId,
          type: "MENTION",
          mentionId: params.id,
        })),
      });
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    logger.error("Error updating comment", { error });
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}
