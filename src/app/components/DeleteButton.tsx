"use client";

import { supabase } from "../supabaseClient";

interface DeleteButtonProps {
  postId: string;
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("author_id", user?.id);

      if (!error) {
        window.location.reload();
      } else {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1 rounded-sm backdrop-blur-sm transition-colors"
      style={{
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "var(--foreground)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      aria-label="Delete post">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    </button>
  );
}
