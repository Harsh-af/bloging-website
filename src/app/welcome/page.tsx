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
          className="text-[80px] font-bold mb-8 dm-serif-display-regular"
          style={{ color: "var(--foreground)" }}>
          Welcome to{" "}
          <span style={{ color: "var(--foreground)" }}>Blogger.</span>
        </h1>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signin"
            className="border-blue-600 border-[1px] px-8 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition-colors font-medium"
            style={{ color: "var(--foreground)" }}>
            ログイン
          </Link>
          <Link
            href="/signup"
            className="border-green-600 border-[1px] px-8 py-3 rounded-lg hover:bg-green-700 hover:text-white transition-colors font-medium"
            style={{ color: "var(--foreground)" }}>
            新規登録
          </Link>
        </div>
      </div>
    </main>
  );
}
