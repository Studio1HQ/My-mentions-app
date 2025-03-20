import { render, screen, act } from "@testing-library/react";
import { VeltWrapper } from "../VeltWrapper";
import { useVeltClient } from "@veltdev/react";
import { logger } from "@/lib/logger";

// Mock the Velt client hook
jest.mock("@veltdev/react", () => ({
  useVeltClient: jest.fn(),
}));

// Mock the logger
jest.mock("@/lib/logger", () => ({
  logger: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("VeltWrapper", () => {
  const mockVeltClient = {
    setDocumentId: jest.fn(),
  };

  const mockUseVeltClient = useVeltClient as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when client is not initialized", () => {
    mockUseVeltClient.mockReturnValue({ client: null });

    render(
      <VeltWrapper documentId="test-doc">
        <div>Child content</div>
      </VeltWrapper>
    );

    expect(screen.getByText("Initializing...")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please wait while we set up the collaboration features."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText("Child content")).not.toBeInTheDocument();
  });

  it("renders children when client is initialized", () => {
    mockUseVeltClient.mockReturnValue({ client: mockVeltClient });

    render(
      <VeltWrapper documentId="test-doc">
        <div>Child content</div>
      </VeltWrapper>
    );

    // The component should render children immediately when client is available
    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(screen.queryByText("Initializing...")).not.toBeInTheDocument();

    // Effect should have been called
    expect(mockVeltClient.setDocumentId).toHaveBeenCalledWith("test-doc");
    expect(logger.info).toHaveBeenCalledWith("Velt initialized with document", {
      documentId: "test-doc",
    });
  });

  it("logs warning when client is not available", () => {
    mockUseVeltClient.mockReturnValue({ client: null });

    render(
      <VeltWrapper documentId="test-doc">
        <div>Child content</div>
      </VeltWrapper>
    );

    expect(logger.warn).toHaveBeenCalledWith("Velt client not initialized");
  });

  it("handles initialization errors", () => {
    const error = new Error("Initialization failed");
    mockVeltClient.setDocumentId.mockImplementation(() => {
      throw error;
    });
    mockUseVeltClient.mockReturnValue({ client: mockVeltClient });

    render(
      <VeltWrapper documentId="test-doc">
        <div>Child content</div>
      </VeltWrapper>
    );

    // The error should be logged
    expect(logger.error).toHaveBeenCalledWith(
      "Failed to initialize Velt",
      error
    );

    // Children should still be rendered despite the error
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("cleans up client on unmount", () => {
    mockUseVeltClient.mockReturnValue({ client: mockVeltClient });

    const { unmount } = render(
      <VeltWrapper documentId="test-doc">
        <div>Child content</div>
      </VeltWrapper>
    );

    // Unmount should trigger the cleanup
    act(() => {
      unmount();
    });

    expect(logger.debug).toHaveBeenCalledWith("Cleaning up Velt resources");
  });
});
