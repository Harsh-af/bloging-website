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
    <li className="border-[1px] border-[#353535] rounded-lg p-4 mb-4 flex justify-between items-start group hover:bg-[#151515] cursor-pointer transition-colors duration-300">
      <a href={`/post/${post.id}`} className="flex-1 block">
        <div className="font-bold transition-colors duration-200 group-hover:text-white">
          {post.title}
        </div>
        <div className="text-sm text-gray-500 transition-colors duration-200 group-hover:text-gray-300">
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
