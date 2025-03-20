import type { Comment, Mention, Notification } from "@prisma/client";
import { NotificationType } from "@prisma/client";

// Comment with relations
export interface CommentWithRelations extends Comment {
  replies?: CommentWithRelations[];
  mentions?: MentionWithRelations[];
  parent?: CommentWithRelations | null;
}

// Mention with relations
export interface MentionWithRelations extends Mention {
  comment?: CommentWithRelations;
  notification?: NotificationWithRelations | null;
}

// Notification with relations
export interface NotificationWithRelations extends Notification {
  mention?: MentionWithRelations | null;
}

// Input types for creating/updating records
export interface CreateCommentInput {
  content: string;
  authorId: string;
  parentId?: string | null;
  mentionedUserIds?: string[]; // Array of Clerk user IDs
}

export interface UpdateCommentInput {
  content?: string;
  mentionedUserIds?: string[]; // Array of Clerk user IDs
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  mentionId?: string;
}

// Re-export types from Prisma
export { NotificationType };
