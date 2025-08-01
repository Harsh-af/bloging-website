"use client";

import Image from "next/image";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import { useAuth } from "../contexts/AuthContext";

interface BlogPostItemProps {
  post: {
    id: string;
    title: string;
    content?: string;
    created_at: string;
    author_id: string;
    author_display_name?: string;
    image_url?: string;
  };
}

export default function BlogPostItem({ post }: BlogPostItemProps) {
  const { user } = useAuth();
  const isOwnPost = user?.id === post.author_id;

  return (
    <li
      className="border-[1px] rounded-lg p-3 sm:p-4 mb-4 flex flex-col sm:flex-row justify-between items-start group hover:bg-[#151515] cursor-pointer transition-colors duration-300 backdrop-blur-sm"
      style={{
        backgroundColor: "var(--blur-bg)",
        borderColor: "var(--blur-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}>
      <a href={`/post/${post.id}`} className="flex-1 block w-full">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {post.image_url && (
            <div className="flex-shrink-0 self-center sm:self-start">
              <Image
                src={post.image_url}
                alt={post.title}
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
              />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <div
              className="font-semibold transition-colors duration-200 group-hover:text-white text-sm sm:text-base"
              style={{ color: "var(--foreground)" }}>
              {post.title}
            </div>
            <div
              className="text-xs sm:text-sm transition-colors duration-200 group-hover:text-gray-300 mt-1"
              style={{ color: "var(--muted-text)" }}>
              <p>By: {post.author_display_name}</p>
              <p>{new Date(post.created_at).toLocaleDateString()}</p>
              {post.content && (
                <p className="line-clamp-3 mt-2">
                  {post.content
                    .replace(/#{1,6}\s+/g, "") // Remove headings
                    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
                    .replace(/\*(.*?)\*/g, "$1") // Remove italic
                    .replace(/`(.*?)`/g, "$1") // Remove inline code
                    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
                    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
                    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
                    .replace(/^\s*[-*+]\s+/gm, "") // Remove list markers
                    .replace(/^\s*\d+\.\s+/gm, "") // Remove numbered list markers
                    .replace(/^\s*>\s+/gm, "") // Remove blockquotes
                    .replace(/\n+/g, " ") // Replace multiple newlines with single space
                    .trim()
                    .substring(0, 200)}
                  {post.content.length > 200 ? "..." : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </a>
      {isOwnPost && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex justify-center sm:justify-start mt-3 sm:mt-0">
          <EditButton postId={post.id} />
          <DeleteButton postId={post.id} />
        </div>
      )}
    </li>
  );
}
