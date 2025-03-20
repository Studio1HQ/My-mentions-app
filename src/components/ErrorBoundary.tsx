"use client";

import { Component, type ReactNode } from "react";

export interface FallbackProps {
  error: Error;
  resetError: () => void;
}

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error || new Error("Unknown error")}
            resetError={this.resetError}
          />
        );
      }

      // Default fallback UI
      return (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-800">
              Something went wrong
            </h3>
            <p className="text-sm text-red-600">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              type="button"
              className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
              onClick={this.resetError}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
