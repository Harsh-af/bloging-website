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
import HamburgerMenu from "../components/HamburgerMenu";
import {
  ImageUploadSkeleton,
  FormSkeleton,
  PageSkeleton,
} from "../components/SkeletonLoader";

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
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

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

      const { data: uploadData, error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error details:", error);
        throw error;
      }

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

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) return;
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
      <main className="px-4 sm:px-8 md:px-16 lg:px-30 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-semibold dm-serif-display-regular"
            style={{ color: "var(--foreground)" }}>
            {isEditing ? "Edit Post" : "Create a new Post"}
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
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
        <div className="max-w-2xl mx-auto mt-17">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  ) : uploading ? (
                    <ImageUploadSkeleton />
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
                        Click to upload image
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
                Import Blog
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                {isEditing ? "Update Post" : "Post Blog"}
              </button>
            </form>
          </div>

          <div className="flex justify-end mt-4"></div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
