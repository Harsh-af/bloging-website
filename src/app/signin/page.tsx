"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import { ButtonSkeleton } from "../components/SkeletonLoader";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className="text-3xl sm:text-4xl md:text-[50px] font-semibold mb-4 dm-serif-display-regular"
            style={{ color: "var(--foreground)" }}>
            Sign In
          </h1>
          <p style={{ color: "var(--foreground)" }}>Welcome back to Blogger</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}>
              Email*
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              style={{
                backgroundColor: "var(--blur-bg)",
                color: "var(--foreground)",
                borderColor: "var(--blur-border)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}>
              Password*
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              style={{
                backgroundColor: "var(--blur-bg)",
                color: "var(--foreground)",
                borderColor: "var(--blur-border)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              required
            />
          </div>

          {error && (
            <div
              className="text-red-600 text-sm p-3 rounded-lg"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
              {error}
            </div>
          )}

          {loading ? (
            <ButtonSkeleton
              className="w-full bg-blue-600"
              text="Signing In..."
            />
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Sign In
            </button>
          )}
        </form>

        <div className="text-center mt-6">
          <p style={{ color: "var(--foreground)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
