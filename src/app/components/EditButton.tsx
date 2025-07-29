"use client";

interface EditButtonProps {
  postId: string;
}

export default function EditButton({ postId }: EditButtonProps) {
  const handleEdit = () => {
    window.location.href = `/dashboard?edit=${postId}`;
  };

  return (
    <button
      onClick={handleEdit}
      className="p-1 rounded-sm mr-2 backdrop-blur-sm transition-colors"
      style={{
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        color: "var(--foreground)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      aria-label="Edit post">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    </button>
  );
}
