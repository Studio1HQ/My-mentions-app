import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { useAuth } from "@clerk/nextjs";

// Mock Clerk's useAuth
jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockNotification = {
  id: "notification1",
  userId: "user1",
  type: "MENTION",
  read: false,
  createdAt: new Date(),
  mention: {
    id: "mention1",
    comment: {
      id: "comment1",
      content: "Hello @user1",
      authorId: "user2",
      createdAt: new Date(),
    },
  },
};

describe("NotificationsContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: true });
  });

  it("fetches notifications on mount when signed in", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ notifications: [mockNotification], unreadCount: 1 }),
    });

    await act(async () => {
      render(
        <NotificationsProvider>
          <div data-testid="unread-count">
            {mockNotification.mention.comment.content}
          </div>
        </NotificationsProvider>
      );
    });

    expect(
      screen.getByText((text) => text.includes("Hello @user1"))
    ).toBeInTheDocument();
    expect(screen.getByTestId("unread-count")).toHaveTextContent(
      "Hello @user1"
    );
  });

  it("handles error when fetching notifications", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    await act(async () => {
      render(
        <NotificationsProvider>
          <div>Test</div>
        </NotificationsProvider>
      );
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/notifications?page=1&limit=10"
    );
  });

  it("does not fetch notifications when not signed in", async () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false });

    await act(async () => {
      render(
        <NotificationsProvider>
          <div>Test</div>
        </NotificationsProvider>
      );
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
