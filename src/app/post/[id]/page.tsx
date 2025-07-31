import Image from "next/image";
import { supabase } from "../../supabaseClient";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import MarkdownRenderer from "../../components/MarkdownRenderer";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !post) {
    console.error(error);
    return (
      <p className="text-[50px] font-bold mb-6 dm-serif-display-regular">
        Post not found.
      </p>
    );
  }

  return (
    <ProtectedRoute>
      <main className="px-30 py-20" style={{ color: "var(--foreground)" }}>
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-[50px] font-bold dm-serif-display-regular"
            style={{ color: "var(--foreground)" }}>
            {post.title}
          </h1>
          <div className="flex gap-2">
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
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--muted-text)" }}>
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        {post.image_url && (
          <div className="mb-6">
            <Image
              src={post.image_url}
              alt={post.title}
              width={800}
              height={384}
              className="w-full max-h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
        <MarkdownRenderer content={post.content} />
      </main>
    </ProtectedRoute>
  );
}
