"use client";

import { useEffect, type ReactNode } from "react";
import { useVeltClient } from "@veltdev/react";
import { logger } from "@/lib/logger";
import { ErrorBoundary } from "./ErrorBoundary";

interface VeltWrapperProps {
  children: ReactNode;
  documentId: string;
}

export function VeltWrapper({ children, documentId }: VeltWrapperProps) {
  const { client } = useVeltClient();

  useEffect(() => {
    if (!client) {
      logger.warn("Velt client not initialized");
      return;
    }

    try {
      // Initialize Velt with the current document
      client.setDocumentId(documentId);
      logger.info("Velt initialized with document", { documentId });
    } catch (error) {
      logger.error("Failed to initialize Velt", error);
    }

    // Cleanup function
    return () => {
      try {
        // Clean up Velt resources if needed
        logger.debug("Cleaning up Velt resources");
      } catch (error) {
        logger.error("Error during Velt cleanup", error);
      }
    };
  }, [client, documentId]);

  if (!client) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-yellow-800">
            Initializing...
          </h3>
          <p className="text-sm text-yellow-600">
            Please wait while we set up the collaboration features.
          </p>
        </div>
      </div>
    );
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
