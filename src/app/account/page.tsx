"use client";

import { useState } from "react";
import React from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { updateDisplayName } from "../actions/userActions";
import { ButtonSkeleton } from "../components/SkeletonLoader";

export default function AccountPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  // Fetch user display name on component mount
  React.useEffect(() => {
    const fetchUserDisplayName = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("display_name")
            .eq("id", user.id)
            .single();

          if (!error && data) {
            setUserDisplayName(data.display_name);
          }
        } catch (err) {
          console.error("Error fetching user display name:", err);
        }
      }
    };

    fetchUserDisplayName();
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!newPassword) {
      setError("New password is required");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  const handleDisplayNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!newDisplayName.trim()) {
      setError("Display name is required");
      setLoading(false);
      return;
    }

    if (newDisplayName.trim().length < 2) {
      setError("Display name must be at least 2 characters long");
      setLoading(false);
      return;
    }

    if (!user?.id) {
      setError("User not found");
      setLoading(false);
      return;
    }

    const result = await updateDisplayName(user.id, newDisplayName.trim());

    if (result.success) {
      setMessage("Display name updated successfully!");
      setNewDisplayName("");
    } else {
      setError("Failed to update display name");
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-semibold dm-serif-display-regular"
              style={{ color: "var(--foreground)" }}>
              Account Settings
            </h1>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
              <ThemeToggle />
              <Link
                href="/"
                className="hidden sm:inline-flex items-center bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1">
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>

          {error && (
            <div
              className="text-red-600 text-sm p-3 rounded-lg mb-4"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
              {error}
            </div>
          )}

          {message && (
            <div
              className="text-green-600 text-sm p-3 rounded-lg mb-4"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
              {message}
            </div>
          )}

          <div className="space-y-8">
            {/* Current Account Info */}
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: "var(--blur-bg)",
                borderColor: "var(--blur-border)",
              }}>
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--foreground)" }}>
                Current Account
              </h2>
              <div className="space-y-2">
                <p style={{ color: "var(--foreground)" }}>
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p style={{ color: "var(--foreground)" }}>
                  <span className="font-medium">Display Name:</span>{" "}
                  {userDisplayName || "Not set"}
                </p>
              </div>
            </div>

            {/* Change Password */}
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: "var(--blur-bg)",
                borderColor: "var(--blur-border)",
              }}>
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--foreground)" }}>
                Change Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--foreground)" }}>
                    New Password*
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    style={{
                      backgroundColor: "var(--blur-bg)",
                      color: "var(--foreground)",
                      borderColor: "var(--blur-border)",
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
                    Confirm New Password*
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
                    }}
                    required
                  />
                </div>
                {loading ? (
                  <ButtonSkeleton className="bg-green-600" text="Updating..." />
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                    Update Password
                  </button>
                )}
              </form>
            </div>

            {/* Change Display Name */}
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: "var(--blur-bg)",
                borderColor: "var(--blur-border)",
              }}>
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--foreground)" }}>
                Change Display Name
              </h2>
              <form onSubmit={handleDisplayNameChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="newDisplayName"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--foreground)" }}>
                    New Display Name*
                  </label>
                  <input
                    type="text"
                    id="newDisplayName"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    style={{
                      backgroundColor: "var(--blur-bg)",
                      color: "var(--foreground)",
                      borderColor: "var(--blur-border)",
                    }}
                    required
                    minLength={2}
                    maxLength={50}
                    pattern="[A-Za-z0-9\s]+"
                    title="Display name must contain only letters, numbers, and spaces"
                  />
                </div>
                {loading ? (
                  <ButtonSkeleton
                    className="bg-purple-600"
                    text="Updating..."
                  />
                ) : (
                  <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                    Update Display Name
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
