import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { paginationSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = paginationSchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const skip = (parsed.page - 1) * parsed.limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
        },
        include: {
          mention: {
            include: {
              comment: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: parsed.limit,
      }),
      prisma.notification.count({
        where: {
          userId,
        },
      }),
    ]);

    return NextResponse.json({
      notifications,
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

// Mark all notifications as read
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
