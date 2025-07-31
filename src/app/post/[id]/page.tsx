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

  return (
    <ProtectedRoute>
      <PostContent post={post} />
    </ProtectedRoute>
  );
}
