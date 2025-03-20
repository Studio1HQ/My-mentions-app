import { LRUCache } from "lru-cache";
import { NextResponse } from "next/server";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max:
      options?.uniqueTokenPerInterval ||
      Number.parseInt(process.env.RATE_LIMIT_MAX || "60", 10),
    ttl:
      options?.interval ||
      Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  });

  return {
    check: (token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, [1]);
        return NextResponse.json({ success: true });
      }

      if (
        tokenCount[0] >= Number.parseInt(process.env.RATE_LIMIT_MAX || "60", 10)
      ) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { status: 429 }
        );
      }

      tokenCount[0] += 1;
      tokenCache.set(token, tokenCount);
      return NextResponse.json({ success: true });
    },
  };
}
