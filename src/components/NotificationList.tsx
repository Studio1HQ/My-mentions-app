// Updated NotificationList.tsx
import {
  useNotifications,
  type Notification,
} from "@/contexts/NotificationsContext";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { memo, useCallback } from "react";

interface NotificationListProps {
  onNotificationClick?: () => void;
}

function NotificationListItem({
  notification,
  onNotificationClick,
  onMarkAsRead,
}: {
  notification: Notification;
  onNotificationClick?: () => void;
  onMarkAsRead: (id: string) => Promise<void>;
}) {
  const handleClick = useCallback(async () => {
    if (!notification.read) {
      await onMarkAsRead(notification.id);
    }
    onNotificationClick?.();
  }, [notification.id, notification.read, onMarkAsRead, onNotificationClick]);

  return (
    <button
      type="button"
      className="flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-muted"
      onClick={handleClick}
    >
      <div className="flex-1 space-y-1">
        <p className="text-sm">
          {notification.type === "mention" && notification.mention
            ? notification.mention.comment.content
            : notification.data?.content || "Status changed"}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-1 flex h-2 w-2 rounded-full bg-blue-600" />
      )}
      {notification.read && (
        <Check className="mt-0.5 h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}

const MemoizedNotificationListItem = memo(NotificationListItem);

export function NotificationList({
  onNotificationClick,
}: NotificationListProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 pb-2">
        <h2 className="text-sm font-medium">Notifications</h2>
        {hasUnread && (
          <Button
            variant="ghost"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => markAllAsRead()}
          >
            Mark all as read
          </Button>
        )}
      </div>
      <ScrollArea className="h-[300px] px-4">
        {notifications.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No notifications
          </p>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <MemoizedNotificationListItem
                key={notification.id}
                notification={notification}
                onNotificationClick={onNotificationClick}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
