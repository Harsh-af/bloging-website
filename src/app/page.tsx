"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import BlogPostItem from "./components/BlogPostItem";
import ProtectedRoute from "./components/ProtectedRoute";
import HamburgerMenu from "./components/HamburgerMenu";
import ThemeToggle from "./components/ThemeToggle";
import { useAuth } from "./contexts/AuthContext";
import { getDisplayNames } from "./actions/userActions";

interface Post {
  id: string;
  title: string;
  created_at: string;
  author_id: string;
  author_display_name?: string;
  image_url?: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Supabase error:", postsError);
        setError("Failed to load posts");
        return;
      }

      const authorIds = [
        ...new Set((postsData || []).map((post) => post.author_id)),
      ];

      let displayNameMap: Map<string, string>;
      try {
        displayNameMap = await getDisplayNames(authorIds);
      } catch (error) {
        console.error("Error calling getDisplayNames:", error);
        displayNameMap = new Map<string, string>();
        authorIds.forEach((authorId) => {
          displayNameMap.set(authorId, `User ${authorId.slice(0, 8)}`);
        });
      }

      const { data, error } = { data: postsData, error: postsError };

      if (error) {
        console.error("Supabase error:", error);
        setError("Failed to load posts");
      } else {
        const postsWithDisplayNames = (data || []).map((post) => {
          return {
            ...post,
            author_display_name:
              displayNameMap.get(post.author_id) ||
              `User ${post.author_id?.slice(0, 8) || "Unknown"}`,
          };
        });
        setPosts(postsWithDisplayNames);
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
      fetchUserDisplayName();
    }
  }, [user, fetchPosts]);

  const fetchUserDisplayName = async () => {
    if (!user?.id) return;

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
  };

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
            <p style={{ color: "var(--foreground)" }}>
              Welcome{" "}
              <span className="font-bold">{userDisplayName || `User ${user?.id?.slice(0, 8)}`}</span>
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center font-bold gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
              style={{ width: "fit-content" }}
            >
              Post a new Blog
              <svg
                width="20"
                height="20"
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
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <HamburgerMenu />
          </div>
        </div>
        <div className="mt-7">
          <p
            className="font-bold text-left block mb-3"
            style={{ color: "var(--foreground)" }}>
            Blogs:
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
