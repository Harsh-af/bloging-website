"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [postId, setPostId] = useState("");
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
          <h1 className="text-[50px] font-bold dm-serif-display-regular">
            {isEditing ? "Edit Post" : "Create a new Post"}
          </h1>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded border-[#353535]"
            required
          />
          <textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded min-h-[150px] border-[#353535] bg-transparent"
            required
          />
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
