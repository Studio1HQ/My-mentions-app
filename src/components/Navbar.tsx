import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            Mentions
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              href="/comments"
              className="text-sm font-medium hover:text-primary"
            >
              Comments
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
