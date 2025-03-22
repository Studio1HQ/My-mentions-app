import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Next Mentions App",
  description: "A collaborative app with mentions and comments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Log application startup
  if (typeof window !== "undefined") {
    logger.info("Application initialized", {
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
