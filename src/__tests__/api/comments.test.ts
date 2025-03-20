import { PATCH, DELETE } from "@/app/api/comments/[id]/route";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

// Mock NextResponse
jest.mock("next/server", () => {
  const mockResponse = (body: unknown, init?: { status?: number }) => ({
    json: async () => body,
    status: init?.status || 200,
  });
  return {
    NextRequest: jest.fn().mockImplementation((url, init) => ({
      ...init,
      json: async () => JSON.parse(init.body),
      url,
    })),
    NextResponse: {
      json: jest
        .fn()
        .mockImplementation((body, init) => mockResponse(body, init)),
    },
  };
});

// Mock logger to prevent error output during tests
jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock Clerk auth
jest.mock("@clerk/nextjs/server", () => ({
  getAuth: jest.fn().mockReturnValue({ userId: "author1" }),
}));

jest.mock("@/lib/db", () => {
  const mockPrisma = {
    comment: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    mention: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    notification: {
      createMany: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe("Comments API", () => {
  const mockComment = {
    id: "comment1",
    content: "Hello @user1 and @user2!",
    authorId: "author1",
    createdAt: new Date().toISOString(),
    mentions: [],
    replies: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("PATCH /api/comments/[id]", () => {
    it("creates mentions and notifications when updating comment with @mentions", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/comments/comment1",
        {
          method: "PATCH",
          body: JSON.stringify({ content: "Hello @user1 and @user2!" }),
        }
      );
      const params = { params: { id: "comment1" } };

      const updatedComment = {
        ...mockComment,
        content: "Hello @user1 and @user2!",
        mentions: [
          { userId: "user1", commentId: "comment1" },
          { userId: "user2", commentId: "comment1" },
        ],
      };

      // Set up mock implementations
      (prisma.comment.update as jest.Mock).mockResolvedValueOnce(
        updatedComment
      );
      (prisma.mention.createMany as jest.Mock).mockResolvedValueOnce({
        count: 2,
      });
      (prisma.notification.createMany as jest.Mock).mockResolvedValueOnce({
        count: 2,
      });

      const response = await PATCH(request, params);
      expect(response).toBeDefined();
      const responseData = await response.json();
      expect(responseData).toEqual(updatedComment);

      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: "comment1" },
        data: { content: "Hello @user1 and @user2!" },
        include: {
          mentions: true,
          replies: true,
        },
      });

      expect(prisma.mention.createMany).toHaveBeenCalledWith({
        data: [
          { commentId: "comment1", userId: "user1" },
          { commentId: "comment1", userId: "user2" },
        ],
      });

      expect(prisma.notification.createMany).toHaveBeenCalledWith({
        data: [
          { userId: "user1", type: "MENTION", mentionId: "comment1" },
          { userId: "user2", type: "MENTION", mentionId: "comment1" },
        ],
      });
    });

    it("handles comment update without @mentions", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/comments/comment1",
        {
          method: "PATCH",
          body: JSON.stringify({ content: "Hello world!" }),
        }
      );
      const params = { params: { id: "comment1" } };

      const updatedComment = {
        ...mockComment,
        content: "Hello world!",
        mentions: [],
      };

      // Set up mock implementation
      (prisma.comment.update as jest.Mock).mockResolvedValueOnce(
        updatedComment
      );

      const response = await PATCH(request, params);
      expect(response).toBeDefined();
      const responseData = await response.json();
      expect(responseData).toEqual(updatedComment);

      expect(prisma.mention.createMany).not.toHaveBeenCalled();
      expect(prisma.notification.createMany).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/comments/[id]", () => {
    it("deletes comment and its mentions", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/comments/comment1",
        {
          method: "DELETE",
        }
      );
      const params = { params: { id: "comment1" } };

      // Set up mock implementations
      (prisma.comment.delete as jest.Mock).mockResolvedValueOnce(mockComment);
      (prisma.mention.deleteMany as jest.Mock).mockResolvedValueOnce({
        count: 2,
      });

      const response = await DELETE(request, params);
      expect(response).toBeDefined();
      expect(response.status).toBe(204);

      expect(prisma.mention.deleteMany).toHaveBeenCalledWith({
        where: { commentId: "comment1" },
      });

      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: "comment1" },
      });
    });
  });
});
