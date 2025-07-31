"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { updateDisplayName } from "../actions/userActions";

export default function AccountPage() {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!newEmail.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the confirmation link!");
      setNewEmail("");
    }
    setLoading(false);
  };

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
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1
              className="text-[50px] font-bold dm-serif-display-regular"
              style={{ color: "var(--foreground)" }}>
              Account Settings
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                ← Back to Home
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
                className="text-xl font-bold mb-4"
                style={{ color: "var(--foreground)" }}>
                Current Account
              </h2>
              <div className="space-y-2">
                <p style={{ color: "var(--foreground)" }}>
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p style={{ color: "var(--foreground)" }}>
                  <span className="font-medium">User ID:</span> {user?.id}
                </p>
              </div>
            </div>

            {/* Change Email */}
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: "var(--blur-bg)",
                borderColor: "var(--blur-border)",
              }}>
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "var(--foreground)" }}>
                Change Email Address
              </h2>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="newEmail"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--foreground)" }}>
                    New Email Address*
                  </label>
                  <input
                    type="email"
                    id="newEmail"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    style={{
                      backgroundColor: "var(--blur-bg)",
                      color: "var(--foreground)",
                      borderColor: "var(--blur-border)",
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {loading ? "Updating..." : "Update Email"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: "var(--blur-bg)",
                borderColor: "var(--blur-border)",
              }}>
              <h2
                className="text-xl font-bold mb-4"
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
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50">
                  {loading ? "Updating..." : "Update Password"}
                </button>
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
                className="text-xl font-bold mb-4"
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
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors disabled:opacity-50">
                  {loading ? "Updating..." : "Update Display Name"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
