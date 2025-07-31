"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import MarkdownRenderer from "./MarkdownRenderer";
import ThemeToggle from "./ThemeToggle";

interface PostContentProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    author_id: string;
    image_url?: string;
    author_display_name?: string;
  };
}

export default function PostContent({ post }: PostContentProps) {
  const { user } = useAuth();
  const isOwnPost = user?.id === post.author_id;

  return (
    <main className="px-30 py-20" style={{ color: "var(--foreground)" }}>
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-[50px] font-bold dm-serif-display-regular"
          style={{ color: "var(--foreground)" }}>
          {post.title}
        </h1>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          {isOwnPost && (
            <Link
              href={`/dashboard?edit=${post.id}`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors inline-flex items-center gap-2">
              Edit Blog
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Link>
          )}
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm" style={{ color: "var(--muted-text)" }}>
          By: {post.author_display_name || post.author_id?.slice(0, 8)}
        </p>
        <p className="text-sm" style={{ color: "var(--muted-text)" }}>
          {new Date(post.created_at).toLocaleDateString()}
        </p>
      </div>
      {post.image_url && (
        <div className="mb-15 flex justify-center">
          <Image
            src={post.image_url}
            alt={post.title}
            width={800}
            height={400}
            className="w-auto h-auto rounded-lg shadow-lg"
            style={{ maxHeight: "400px", maxWidth: "100%" }}
          />
        </div>
      )}
      <MarkdownRenderer content={post.content} />
    </main>
  );
}
