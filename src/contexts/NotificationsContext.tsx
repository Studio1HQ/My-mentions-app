"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { logger } from "@/lib/logger";

export type Notification = {
  id: string;
  read: boolean;
  createdAt: string;
  type: "mention" | "status";
  mention?: {
    comment: {
      authorId: string;
      content: string;
    };
  };
  data?: {
    commentId: string;
    status: string;
    content?: string;
  };
};

export type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  handleCommentStatusChange: (
    commentId: string,
    type: "mention" | "status",
    content?: string
  ) => void;
};

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/notifications?page=1&limit=10");
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (err) {
        logger.error("Error fetching notifications", { error: err });
        setError(
          err instanceof Error ? err.message : "Failed to fetch notifications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isSignedIn]);

  const handleCommentStatusChange = (
    commentId: string,
    type: "mention" | "status",
    content?: string
  ) => {
    const newNotification: Notification = {
      id: `${type}-${commentId}-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
      type,
      data: {
        commentId,
        status: type,
        content,
      },
    };

    if (type === "mention" && content) {
      newNotification.mention = {
        comment: {
          authorId: "System",
          content,
        },
      };
    }

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        handleCommentStatusChange,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
