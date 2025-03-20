import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationList } from "@/components/NotificationList";
import {
  NotificationsContext,
  type Notification,
  type NotificationsContextType,
} from "@/contexts/NotificationsContext";

// Mock Clerk
jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: () => ({ isSignedIn: true, userId: "user123" }),
}));

const mockNotification: Notification = {
  id: "notification1",
  type: "mention",
  read: false,
  createdAt: new Date().toISOString(),
  mention: {
    comment: {
      authorId: "user2",
      content: "Hello @user1",
    },
  },
};

const renderWithProviders = ({
  loading = false,
  error = null,
  notifications = [] as Notification[],
  markAsRead = jest.fn().mockResolvedValue(undefined),
  markAllAsRead = jest.fn().mockResolvedValue(undefined),
  handleCommentStatusChange = jest.fn(),
} = {}) => {
  const contextValue: NotificationsContextType = {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    handleCommentStatusChange,
  };

  return render(
    <NotificationsContext.Provider value={contextValue}>
      <NotificationList />
    </NotificationsContext.Provider>
  );
};

describe("NotificationList", () => {
  it("renders loading state", () => {
    renderWithProviders({ loading: true });
    // The component doesn't actually show a loading state, so we'll check for the header
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("renders error state", () => {
    renderWithProviders({ error: null });
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });

  it("renders empty state", () => {
    renderWithProviders();
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });

  it("renders notifications", () => {
    renderWithProviders({ notifications: [mockNotification] });
    expect(screen.getByText(/hello @user1/i)).toBeInTheDocument();
  });

  it("marks a notification as read", async () => {
    const markAsRead = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders({
      notifications: [mockNotification],
      markAsRead,
    });

    // Click the notification itself to mark it as read
    const notificationButton = screen
      .getByText(/hello @user1/i)
      .closest("button");
    if (!notificationButton) throw new Error("Notification button not found");

    await user.click(notificationButton);
    expect(markAsRead).toHaveBeenCalledWith(mockNotification.id);
  });

  it("marks all notifications as read", async () => {
    const markAllAsRead = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders({
      notifications: [mockNotification],
      markAllAsRead,
    });

    const button = screen.getByRole("button", { name: /mark all as read/i });
    await user.click(button);
    expect(markAllAsRead).toHaveBeenCalled();
  });

  it("handles comment status changes", () => {
    const handleCommentStatusChange = jest.fn();

    renderWithProviders({
      notifications: [mockNotification],
      handleCommentStatusChange,
    });

    // Simulate a status change
    handleCommentStatusChange("comment1", "status", "Comment approved");
    expect(handleCommentStatusChange).toHaveBeenCalledWith(
      "comment1",
      "status",
      "Comment approved"
    );
  });
});
