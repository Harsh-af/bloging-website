"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import ThemeToggle from "../components/ThemeToggle";
import HamburgerMenu from "../components/HamburgerMenu";
import { useAuth } from "../contexts/AuthContext";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  image_url?: string;
}

export default function ManageBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load your posts");
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load your posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1
              className="text-[50px] font-bold dm-serif-display-regular"
              style={{ color: "var(--foreground)" }}>
              Manage Your Blogs
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <HamburgerMenu />
              <Link
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center font-bold gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
            style={{ width: "fit-content" }}>
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

          {error && (
            <div
              className="text-red-600 text-sm p-3 rounded-lg mb-4"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p style={{ color: "var(--foreground)" }}>
                Loading your posts...
              </p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4 mt-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 rounded-lg border backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "var(--blur-bg)",
                    borderColor: "var(--blur-border)",
                  }}
                  onClick={() => router.push(`/post/${post.id}`)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2
                        className="text-xl font-bold mb-2"
                        style={{ color: "var(--foreground)" }}>
                        {post.title}
                      </h2>
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: "var(--muted-text)" }}>
                        {post.content.substring(0, 150)}
                        {post.content.length > 150 ? "..." : ""}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span style={{ color: "var(--muted-text)" }}>
                          Created:{" "}
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 ml-4"
                      onClick={(e) => e.stopPropagation()}>
                      <EditButton postId={post.id} />
                      <DeleteButton postId={post.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p style={{ color: "var(--foreground)" }} className="mb-4">
                You haven&apos;t written any blogs yet.
              </p>
              <Link
                href="/dashboard"
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors">
                Write Your First Blog
              </Link>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
