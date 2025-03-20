import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createCommentSchema, paginationSchema } from "@/lib/validations";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = await limiter.check(userId);
    if (rateLimitResult.status === 429) {
      return rateLimitResult;
    }

    const json = await req.json();
    const body = createCommentSchema.parse(json);

    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        authorId: userId,
        parentId: body.parentId,
      },
      include: {
        mentions: true,
      },
    });

    // Create mentions if any users are mentioned
    if (body.mentionedUserIds?.length) {
      await prisma.mention.createMany({
        data: body.mentionedUserIds.map((mentionedUserId) => ({
          userId: mentionedUserId,
          commentId: comment.id,
        })),
      });

      // Create notifications for mentions
      await prisma.notification.createMany({
        data: body.mentionedUserIds.map((mentionedUserId) => ({
          userId: mentionedUserId,
          type: "MENTION",
          mentionId: comment.mentions[0].id, // We'll get the first mention since they were just created
        })),
      });
    }

    return NextResponse.json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = paginationSchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      parentId: searchParams.get("parentId"),
    });

    const skip = (parsed.page - 1) * parsed.limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          parentId: parsed.parentId ?? null, // If no parentId, get top-level comments
        },
        include: {
          mentions: {
            include: {
              notification: true,
            },
          },
          replies: {
            include: {
              mentions: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: parsed.limit,
      }),
      prisma.comment.count({
        where: {
          parentId: parsed.parentId ?? null,
        },
      }),
    ]);

    return NextResponse.json({
      comments,
      total,
      pages: Math.ceil(total / parsed.limit),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
