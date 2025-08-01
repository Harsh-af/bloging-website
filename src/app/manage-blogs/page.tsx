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
import { BlogListSkeleton } from "../components/SkeletonLoader";
import BlogPostItem from "../components/BlogPostItem";

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
      <main className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-semibold dm-serif-display-regular"
              style={{ color: "var(--foreground)" }}>
              Manage Your Blogs
            </h1>
            <div className="flex items-center gap-2 sm:gap-2 w-full sm:w-auto justify-end">
              <ThemeToggle />
              <HamburgerMenu />
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
          <a
            href="/dashboard"
            className="inline-flex items-center font-semibold gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
            style={{ width: "fit-content" }}>
            Post a new Blog
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
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
            <BlogListSkeleton />
          ) : posts.length > 0 ? (
            <div className="space-y-4 mt-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border-[1px] rounded-lg p-3 sm:p-4 mb-4 flex flex-col sm:flex-row justify-between items-start group hover:bg-[#151515] cursor-pointer transition-colors duration-300 backdrop-blur-sm"
                  style={{
                    backgroundColor: "var(--blur-bg)",
                    borderColor: "var(--blur-border)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                  onClick={() => router.push(`/post/${post.id}`)}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                    <div className="flex-1 text-center sm:text-left">
                      <div
                        className="font-semibold transition-colors duration-200 group-hover:text-white text-sm sm:text-base"
                        style={{ color: "var(--foreground)" }}>
                        {post.title}
                      </div>
                      <div
                        className="text-xs sm:text-sm transition-colors duration-200 group-hover:text-gray-300 mt-1"
                        style={{ color: "var(--muted-text)" }}>
                        <p
                          className="line-clamp-2"
                          style={{ color: "var(--foreground)" }}>
                          {post.content
                            .replace(/#{1,6}\s+/g, "") // Remove headings
                            .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
                            .replace(/\*(.*?)\*/g, "$1") // Remove italic
                            .replace(/`(.*?)`/g, "$1") // Remove inline code
                            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
                            .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
                            .replace(/```[\s\S]*?```/g, "") // Remove code blocks
                            .replace(/^\s*[-*+]\s+/gm, "") // Remove list markers
                            .replace(/^\s*\d+\.\s+/gm, "") // Remove numbered list markers
                            .replace(/^\s*>\s+/gm, "") // Remove blockquotes
                            .replace(/\n+/g, " ") // Replace multiple newlines with single space
                            .trim()
                            .substring(0, 150)}
                          {post.content.length > 150 ? "..." : ""}
                        </p>
                        <p>
                          Created:{" "}
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex justify-center sm:justify-start mt-3 sm:mt-0"
                    onClick={(e) => e.stopPropagation()}>
                    <EditButton postId={post.id} />
                    <DeleteButton postId={post.id} />
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
