import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary, type FallbackProps } from "../ErrorBoundary";

// Create a component that throws an error
const ThrowError = () => {
  throw new Error("Test error");
};

// Create a component that doesn't throw an error
const NoError = () => <div>Working correctly</div>;

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // Prevent console.error from cluttering the test output
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <NoError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Working correctly")).toBeInTheDocument();
  });

  it("renders fallback UI when there is an error", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("allows retry after error", () => {
    let shouldThrow = true;
    const ConditionalError = () => {
      if (shouldThrow) {
        throw new Error("Test error");
      }
      return <div>Working correctly</div>;
    };

    render(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Change the condition and click retry
    shouldThrow = false;
    fireEvent.click(screen.getByText("Try again"));

    expect(screen.getByText("Working correctly")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    let shouldThrow = true;
    const ConditionalError = () => {
      if (shouldThrow) {
        throw new Error("Test error");
      }
      return <div>Working correctly</div>;
    };

    const CustomFallback = ({ error, resetError }: FallbackProps) => (
      <div>
        <div>Custom error: {error.message}</div>
        <button type="button" onClick={resetError}>
          Reset
        </button>
      </div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ConditionalError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error: Test error")).toBeInTheDocument();

    // Change the condition and click reset
    shouldThrow = false;
    fireEvent.click(screen.getByText("Reset"));

    expect(screen.getByText("Working correctly")).toBeInTheDocument();
  });
});
