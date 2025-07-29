"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import ThemeToggle from "../components/ThemeToggle";

function DashboardContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [postId, setPostId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      setIsEditing(true);
      setPostId(editId);
      fetchPost(editId);
    }
  }, [searchParams]);

  const fetchPost = async (id: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      alert("Failed to load post");
    } else if (data) {
      setTitle(data.title);
      setContent(data.content);
    }
  };

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle text files
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      const { error } = await supabase
        .from("posts")
        .update({ title, content })
        .eq("id", postId);

      if (error) {
        console.error(error);
        alert("Failed to update post");
      } else {
        alert("Post updated!");
        router.push("/");
      }
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("posts")
        .insert([{ title, content, author_id: user?.id }]);

      if (error) {
        console.error(error);
        alert("Failed to create post");
      } else {
        alert("Post created!");
        setTitle("");
        setContent("");
        router.push("/");
      }
    }
  };

  return (
    <ProtectedRoute>
      <main className="px-30 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-[50px] font-bold dm-serif-display-regular"
            style={{ color: "var(--foreground)" }}>
            {isEditing ? "Edit Post" : "Create a new Post"}
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded backdrop-blur-sm"
            style={{
              backgroundColor: "var(--blur-bg)",
              color: "var(--foreground)",
              borderColor: "var(--blur-border)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            required
          />
          <textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded min-h-[150px] backdrop-blur-sm"
            style={{
              backgroundColor: "var(--blur-bg)",
              color: "var(--foreground)",
              borderColor: "var(--blur-border)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            required
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".txt,.md,.doc,.docx"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleImportClick}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Import
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {isEditing ? "Update Post" : "Post Blog"}
          </button>
        </form>
      </main>
    </ProtectedRoute>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
