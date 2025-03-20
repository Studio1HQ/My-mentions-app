import { z } from "zod";

// Comment validations
export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().optional(),
  mentionedUserIds: z.array(z.string()).optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000).optional(),
  mentionedUserIds: z.array(z.string()).optional(),
});

// Pagination and filtering
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  parentId: z.string().optional(), // For fetching replies to a specific comment
});

// Notification validations
export const updateNotificationSchema = z.object({
  read: z.boolean(),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const notificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  userId: z.string(),
  read: z.boolean(),
  createdAt: z.date(),
  data: z.record(z.any()),
});
