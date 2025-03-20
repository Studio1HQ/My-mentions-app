export interface Notification {
  id: string;
  userId: string;
  type: "MENTION";
  read: boolean;
  createdAt: Date;
  mention: {
    id: string;
    comment: {
      id: string;
      content: string;
      authorId: string;
      createdAt: Date;
    };
  };
}

export interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  errorMessage?: string;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  onNotificationClick?: () => void;
}
