"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate all required fields
    if (!displayName.trim()) {
      setError("Display name is required");
      setLoading(false);
      return;
    }

    if (displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters long");
      setLoading(false);
      return;
    }

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

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const getRedirectUrl = () => {
      if (typeof window !== "undefined") {
        return `${window.location.origin}/dashboard`;
      }
      return process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
        : "https://bloggerblogger.vercel.app/dashboard";
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user && !data.session) {
      setMessage("Check your email for the confirmation link!");
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-[50px] font-bold mb-4 dm-serif-display-regular"
            style={{ color: "var(--foreground)" }}>
            Sign Up
          </h1>
          <p style={{ color: "var(--foreground)" }}>
            Create your Blogger account
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}>
              Display Name*
            </label>
            <p className="text-xs text-gray-500 mb-2">
              *This will be your public name on all blog posts. Cannot be
              changed later.
            </p>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              style={{
                backgroundColor: "var(--blur-bg)",
                color: "var(--foreground)",
                borderColor: "var(--blur-border)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              placeholder="Enter your display name"
              required
              minLength={2}
              maxLength={50}
              pattern="[A-Za-z0-9\s]+"
              title="Display name must contain only letters, numbers, and spaces"
            />
          </div>
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
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}>
              Confirm Password*
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          {message && (
            <div
              className="text-green-600 text-sm p-3 rounded-lg"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p style={{ color: "var(--foreground)" }}>
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
