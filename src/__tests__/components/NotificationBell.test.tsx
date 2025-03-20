import { render, screen } from "@testing-library/react";
import { NotificationBell } from "@/components/NotificationBell";
import { useNotifications } from "@/contexts/NotificationsContext";

// Mock the useNotifications hook
jest.mock("@/contexts/NotificationsContext", () => ({
  useNotifications: jest.fn(),
}));

describe("NotificationBell", () => {
  it("renders without unread notifications", () => {
    // Mock the hook to return no unread notifications
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 0,
    });

    render(<NotificationBell />);

    // Check that the bell icon is rendered
    expect(screen.getByRole("button")).toBeInTheDocument();
    // Check that no unread count is displayed
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders with unread notifications", () => {
    // Mock the hook to return 5 unread notifications
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 5,
    });

    render(<NotificationBell />);

    // Check that the bell icon is rendered
    expect(screen.getByRole("button")).toBeInTheDocument();
    // Check that the unread count is displayed
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("displays 99+ for more than 99 unread notifications", () => {
    // Mock the hook to return 100 unread notifications
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 100,
    });

    render(<NotificationBell />);

    // Check that the bell icon is rendered
    expect(screen.getByRole("button")).toBeInTheDocument();
    // Check that 99+ is displayed
    expect(screen.getByText("99+")).toBeInTheDocument();
  });
});
