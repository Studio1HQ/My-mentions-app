import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "@clerk/nextjs";
import { Comment } from "@/components/Comment";

// Mock Clerk's useAuth hook
jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
}));

const mockComment = {
  id: "comment1",
  content: "Hello @john and @jane!",
  authorId: "author123",
  createdAt: new Date("2025-03-15T23:07:55.000Z"),
};

const mockMentions = [{ userId: "john" }, { userId: "jane" }];

const mockOnDelete = jest.fn();
const mockOnEdit = jest.fn();

describe("Comment", () => {
  const mockProps = {
    id: "comment1",
    content: "Hello @user1!",
    authorId: "author123",
    createdAt: new Date("2025-03-16T01:07:55.000Z"),
    mentions: [{ userId: "user1" }],
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      userId: "author123",
      isSignedIn: true,
    });
  });

  it("renders comment content", () => {
    render(<Comment {...mockProps} />);
    expect(
      screen.getByText((content) => content.includes("Hello"))
    ).toBeInTheDocument();
    expect(screen.getByText("@user1")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("!"))
    ).toBeInTheDocument();
  });

  it("renders author ID", () => {
    render(<Comment {...mockProps} />);
    expect(screen.getByText("author123")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<Comment {...mockProps} />);
    expect(
      screen.getByText((text) => text.startsWith("3/16/2025"))
    ).toBeInTheDocument();
  });

  it("renders mentions with special styling", () => {
    render(<Comment {...mockProps} />);
    const mention = screen.getByText("@user1");
    expect(mention).toHaveClass("text-primary", "font-medium");
  });

  it("shows loading state during deletion", async () => {
    const onDelete = jest.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100))
    );
    const user = userEvent.setup();

    render(<Comment {...mockProps} onDelete={onDelete} />);

    // Open dropdown menu
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    // Click delete button and wait for it to be disabled
    const deleteButton = await screen.findByRole("menuitem", {
      name: /delete/i,
    });
    await user.click(deleteButton);
    await waitFor(() => {
      expect(deleteButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("renders comment content with mentions", () => {
    render(
      <Comment
        id={mockComment.id}
        content={mockComment.content}
        authorId={mockComment.authorId}
        createdAt={mockComment.createdAt}
        mentions={mockMentions}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Hello/)).toBeInTheDocument();
    expect(screen.getByText("@john")).toHaveClass(
      "text-primary",
      "font-medium"
    );
    expect(screen.getByText("@jane")).toHaveClass(
      "text-primary",
      "font-medium"
    );
    expect(screen.getByText(/!/)).toBeInTheDocument();
  });

  it("handles @mentions that are not in mentions array", () => {
    render(<Comment {...mockProps} content="Hello @unknown!" mentions={[]} />);

    const unknownMention = screen.getByText("@unknown");
    expect(unknownMention).not.toHaveClass("text-primary");
    expect(unknownMention).not.toHaveClass("font-medium");
  });

  it("shows loading state while deleting", async () => {
    const user = userEvent.setup();
    render(
      <Comment
        id={mockComment.id}
        content={mockComment.content}
        authorId={mockComment.authorId}
        createdAt={mockComment.createdAt}
        mentions={mockMentions}
        onDelete={mockOnDelete}
      />
    );

    const menuButton = screen.getByLabelText("Open menu");
    await user.click(menuButton);

    const deleteButton = screen.getByRole("menuitem", { name: /Delete/i });
    await user.click(deleteButton);

    expect(deleteButton).toHaveAttribute("data-disabled", "");
    expect(mockOnDelete).toHaveBeenCalledWith(mockComment.id);
  });

  it("preserves @mentions when editing comment", async () => {
    const user = userEvent.setup();
    render(
      <Comment
        id={mockComment.id}
        content={mockComment.content}
        authorId={mockComment.authorId}
        createdAt={mockComment.createdAt}
        mentions={mockMentions}
        onEdit={mockOnEdit}
      />
    );

    // Open edit mode
    await user.click(screen.getByLabelText("Open menu"));
    await user.click(screen.getByText("Edit"));

    // Check that mentions are preserved in edit mode
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue(mockComment.content);

    // Add another mention
    await user.type(textarea, " and @bob!");
    await user.click(screen.getByText("Post Comment"));

    expect(mockOnEdit).toHaveBeenCalledWith(
      mockComment.id,
      "Hello @john and @jane! and @bob!"
    );
  });

  it("renders non-mentioned text normally", () => {
    render(<Comment {...mockProps} content="Hello world!" mentions={[]} />);

    const content = screen.getByText((text) => text.includes("Hello world!"));
    expect(content).not.toHaveClass("text-primary", "font-medium");
  });

  it("handles comment with multiple @mentions in different positions", () => {
    const complexComment = {
      id: "comment456",
      content: "@alice Hi! How are you @bob? @charlie let's meet!",
      authorId: "author123",
      createdAt: new Date(),
      mentions: [{ userId: "alice" }, { userId: "bob" }, { userId: "charlie" }],
    };

    render(
      <Comment
        id={complexComment.id}
        content={complexComment.content}
        authorId={complexComment.authorId}
        createdAt={complexComment.createdAt}
        mentions={complexComment.mentions}
      />
    );

    const mentions = screen.getAllByText(/@\w+/);
    expect(mentions).toHaveLength(3);
    for (const mention of mentions) {
      expect(mention).toHaveClass("text-primary", "font-medium");
    }
  });

  it("shows edit and delete buttons for author", async () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: mockComment.authorId });

    render(
      <Comment
        id={mockComment.id}
        content={mockComment.content}
        authorId={mockComment.authorId}
        createdAt={mockComment.createdAt}
        mentions={mockMentions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const comment = screen.getByText(/Hello/);
    await userEvent.hover(comment);

    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });

  it("does not show edit and delete buttons for non-author", () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: "otherUser" });

    render(
      <Comment
        id={mockComment.id}
        content={mockComment.content}
        authorId={mockComment.authorId}
        createdAt={mockComment.createdAt}
        mentions={mockMentions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByLabelText("Open menu")).not.toBeInTheDocument();
  });

  it("opens edit mode when clicking edit", async () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: mockComment.authorId });
    const user = userEvent.setup();

    render(
      <Comment
        id={mockComment.id}
        content={mockComment.content}
        authorId={mockComment.authorId}
        createdAt={mockComment.createdAt}
        mentions={mockMentions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const comment = screen.getByText(/Hello/);
    await user.hover(comment);
    await user.click(screen.getByLabelText("Open menu"));
    await user.click(screen.getByText("Edit"));

    expect(screen.getByRole("textbox")).toHaveValue(mockComment.content);
  });

  it("calls onDelete when clicking delete", async () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: mockComment.authorId });
    const user = userEvent.setup();

    render(
      <Comment
        id={mockComment.id}
        content={mockComment.content}
        authorId={mockComment.authorId}
        createdAt={mockComment.createdAt}
        mentions={mockMentions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const comment = screen.getByText(/Hello/);
    await user.hover(comment);
    await user.click(screen.getByLabelText("Open menu"));
    await user.click(screen.getByText("Delete"));

    expect(mockOnDelete).toHaveBeenCalledWith(mockComment.id);
  });

  it("renders @mentions with special styling", () => {
    render(
      <Comment
        {...mockProps}
        content="Hello @john and @jane!"
        mentions={[{ userId: "john" }, { userId: "jane" }]}
      />
    );

    const johnMention = screen.getByText((text) => text.includes("@john"));
    const janeMention = screen.getByText((text) => text.includes("@jane"));

    expect(johnMention).toHaveClass("text-primary", "font-medium");
    expect(janeMention).toHaveClass("text-primary", "font-medium");
  });
});
