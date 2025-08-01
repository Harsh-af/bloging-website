"use client";

import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div
      className="border rounded-lg overflow-hidden backdrop-blur-sm"
      style={{
        backgroundColor: "var(--blur-bg)",
        borderColor: "var(--blur-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}>
      {/* Toolbar */}
      <div
        className="flex border-b px-4 py-2 gap-2"
        style={{ borderColor: "var(--blur-border)" }}>
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            !isPreview
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
          style={{ color: isPreview ? "var(--muted-text)" : undefined }}>
          Write
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isPreview
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
          style={{ color: !isPreview ? "var(--muted-text)" : undefined }}>
          Preview
        </button>
      </div>

      {/* Editor/Preview Area */}
      <div className="min-h-[200px]">
        {!isPreview ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleTabKey}
            placeholder={placeholder || "Write your blog post in Markdown..."}
            className="w-full h-full min-h-[200px] p-3 sm:p-4 resize-none outline-none text-sm sm:text-base"
            style={{
              backgroundColor: "transparent",
              color: "var(--foreground)",
            }}
          />
        ) : (
          <div
            className="p-3 sm:p-4 prose prose-sm max-w-none"
            style={{ color: "var(--foreground)" }}>
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  if (!content.trim()) {
    return (
      <div className="text-gray-500 italic">
        No content to preview. Start writing in the Write tab.
      </div>
    );
  }

  // Use the same MarkdownRenderer component for consistency
  return <MarkdownRenderer content={content} />;
}
