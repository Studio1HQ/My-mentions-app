import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          My Next Mentions
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/comments" className="text-gray-300 hover:text-white">
            Comments
          </Link>
        </div>
      </div>
    </nav>
  );
}
