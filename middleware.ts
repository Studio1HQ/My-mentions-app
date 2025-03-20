import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Create a middleware that allows Velt API routes and static files
export default clerkMiddleware((auth, req: NextRequest) => {
  // Allow Velt API routes to bypass authentication
  const url = req.nextUrl.pathname;
  if (url.startsWith("/api/velt")) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(jpg|jpeg|gif|png|svg|ico|css|js|woff2?|map)$).*)",
    // Always run for API routes except Velt
    "/(api(?!/velt)|trpc)(.*)",
  ],
};
