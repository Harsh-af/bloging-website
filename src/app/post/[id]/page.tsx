import { supabase } from "../../supabaseClient";
import ProtectedRoute from "../../components/ProtectedRoute";
import PostContent from "../../components/PostContent";

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

  // Fetch the author's display name
  const { data: userData } = await supabase
    .from("users")
    .select("display_name")
    .eq("id", post.author_id)
    .single();

  const postWithDisplayName = {
    ...post,
    author_display_name: userData?.display_name || post.author_id?.slice(0, 8),
  };

  return (
    <ProtectedRoute>
      <PostContent post={postWithDisplayName} />
    </ProtectedRoute>
  );
}
