"use client";

import Image from "next/image";
import { useState, useEffect, Suspense, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import ThemeToggle from "../components/ThemeToggle";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownHelp from "../components/MarkdownHelp";

function DashboardContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [postId, setPostId] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
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
      setImageUrl(data.image_url || "");
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      console.log("Uploading file:", fileName);
      const { data: uploadData, error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error details:", error);
        throw error;
      }

      // Get the public URL using Supabase client
      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      alert(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalImageUrl = imageUrl;

      // Upload image if a new one is selected
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) return; // Stop if upload failed
        finalImageUrl = uploadedUrl;
      }

      if (isEditing) {
        const { error } = await supabase
          .from("posts")
          .update({ title, content, image_url: finalImageUrl })
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
          .insert([
            { title, content, image_url: finalImageUrl, author_id: user?.id },
          ]);

        if (error) {
          console.error(error);
          alert("Failed to create post");
        } else {
          alert("Post created!");
          setTitle("");
          setContent("");
          setImageUrl("");
          setImageFile(null);
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post");
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
          <MarkdownHelp />
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Write your blog post in Markdown..."
          />

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}>
              Blog Image (Optional)
            </label>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={handleImageClick}
              disabled={uploading}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--blur-bg)",
                borderColor: "var(--blur-border)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}>
              {imageUrl ? (
                <div className="w-full">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p
                    className="text-sm mt-2"
                    style={{ color: "var(--muted-text)" }}>
                    Click to change image
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--muted-text)" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span style={{ color: "var(--muted-text)" }}>
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </span>
                </>
              )}
            </button>
          </div>

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
