"use client";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import { useAuth } from "../contexts/AuthContext";

interface BlogPostItemProps {
  post: {
    id: string;
    title: string;
    created_at: string;
    author_id: string;
    author_email?: string;
  };
}

export default function BlogPostItem({ post }: BlogPostItemProps) {
  const { user } = useAuth();
  const isOwnPost = user?.id === post.author_id;

  return (
    <li
      className="border-[1px] rounded-lg p-4 mb-4 flex justify-between items-start group hover:bg-[#151515] cursor-pointer transition-colors duration-300 backdrop-blur-sm"
      style={{
        backgroundColor: "var(--blur-bg)",
        borderColor: "var(--blur-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}>
      <a href={`/post/${post.id}`} className="flex-1 block">
        <div
          className="font-bold transition-colors duration-200 group-hover:text-white"
          style={{ color: "var(--foreground)" }}>
          {post.title}
        </div>
        <div
          className="text-sm transition-colors duration-200 group-hover:text-gray-300"
          style={{ color: "var(--muted-text)" }}>
          <p>By: {post.author_email}</p>
          <p>{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </a>
      {isOwnPost && (
        <div onClick={(e) => e.stopPropagation()} className="flex">
          <EditButton postId={post.id} />
          <DeleteButton postId={post.id} />
        </div>
      )}
    </li>
  );
}
