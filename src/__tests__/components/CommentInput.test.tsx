import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "@clerk/nextjs";
import { CommentInput } from "@/components/CommentInput";

// Mock Clerk's useAuth hook
jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
}));

describe("CommentInput", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      userId: "user123",
      isSignedIn: true,
    });
  });

  it("renders with default placeholder", () => {
    render(<CommentInput onSubmit={mockOnSubmit} />);
    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
  });

  it("handles @mentions in the input", async () => {
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText("Write a comment...");
    await user.type(textarea, "Hello @john and @jane!");

    expect(textarea).toHaveValue("Hello @john and @jane!");
  });

  it("submits comment with @mentions", async () => {
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText("Write a comment...");
    await user.type(textarea, "Hello @john!");

    const submitButton = screen.getByText("Post Comment");
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith("Hello @john!");
  });

  it("handles multiple @mentions in a comment", async () => {
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText("Write a comment...");
    await user.type(textarea, "Hey @john, @jane, and @bob!");

    const submitButton = screen.getByText("Post Comment");
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith("Hey @john, @jane, and @bob!");
  });

  it("preserves @mentions when editing existing comment", async () => {
    const user = userEvent.setup();
    render(
      <CommentInput
        defaultValue="Hello @john!"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textarea = screen.getByPlaceholderText("Write a comment...");
    expect(textarea).toHaveValue("Hello @john!");

    // Add more mentions to existing comment
    await user.type(textarea, " and @jane!");

    const submitButton = screen.getByText("Post Comment");
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith("Hello @john! and @jane!");
  });

  it("disables submit button when comment is empty", () => {
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText("Post Comment");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when comment contains only @mentions", async () => {
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText("Write a comment...");
    await user.type(textarea, "@john");

    const submitButton = screen.getByText("Post Comment");
    expect(submitButton).not.toBeDisabled();
  });
});
