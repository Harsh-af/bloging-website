"use client";

import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center">
        <h1
          className="text-[80px] font-semibold mb-8 dm-serif-display-regular"
          style={{ color: "var(--foreground)" }}>
          Welcome to <span className="text-gray-500">Blogger.</span>
        </h1>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signin"
            className="border-blue-600 border-[1px] px-8 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition-colors font-medium text-foreground">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="border-green-600 border-[1px] px-8 py-3 rounded-lg hover:bg-green-700 hover:text-white transition-colors font-medium text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
