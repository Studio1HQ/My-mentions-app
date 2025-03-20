import type { NextRequest, NextResponse } from "next/server";

declare module "next/server" {
  export interface RouteHandlerContext {
    params: Record<string, string | string[]>;
  }

  export type RouteHandler = (
    req: NextRequest,
    context: RouteHandlerContext
  ) => Promise<NextResponse> | NextResponse;
}
