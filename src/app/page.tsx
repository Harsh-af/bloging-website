"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import BlogPostItem from "./components/BlogPostItem";
import ProtectedRoute from "./components/ProtectedRoute";
import UserMenu from "./components/UserMenu";
import ThemeToggle from "./components/ThemeToggle";
import { useAuth } from "./contexts/AuthContext";

interface Post {
  id: string;
  title: string;
  created_at: string;
  author_id: string;
  author_email?: string;
  image_url?: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      console.log("Fetching posts...");
      console.log("Current user:", user?.id);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Posts data:", data);
      console.log("Posts error:", error);

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
      } else {
        const postsWithEmails = (data || []).map((post) => ({
          ...post,
          author_email: `User ${post.author_id?.slice(0, 8) || "Unknown"}...`,
        }));
        console.log("Processed posts:", postsWithEmails);
        setPosts(postsWithEmails);
      }
    } catch (err) {
      console.error("Catch error:", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, fetchPosts]);

  return (
    <ProtectedRoute>
      <main className="px-30 py-10">
        <h1
          className="text-[95px] font-bold mb-6 dm-serif-display-regular"
          style={{ color: "var(--foreground)" }}>
          Blogger.
        </h1>
        <div className="flex justify-between items-center w-full mb-6">
          <div className="flex flex-col gap-3">
            <p
              className="font-bold dm-serif-display-regular"
              style={{ color: "var(--foreground)" }}>
              こんにちは！
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              新しいブログを書く
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
        <div className="mt-10">
          <p
            className="font-bold text-left block mb-3"
            style={{ color: "var(--foreground)" }}>
            ブログ:
          </p>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p style={{ color: "var(--foreground)" }}>Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error: {error}</p>
              <button
                onClick={fetchPosts}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Retry
              </button>
            </div>
          ) : posts && posts.length > 0 ? (
            <ul>
              {posts.map((post) => (
                <BlogPostItem key={post.id} post={post} />
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--foreground)" }}>No posts yet :(</p>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
