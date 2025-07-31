"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!user) {
      setError("No user found");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "Check your email for the confirmation link to update your email address!"
        );
      }
    } catch (err) {
      setError("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h3
        className="text-lg font-semibold mb-3"
        style={{ color: "var(--foreground)" }}>
        Change Email Address
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--foreground)" }}>
            Email Address
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
            placeholder="Enter your new email address"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          {loading ? "Updating..." : "Update Email"}
        </button>
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}
