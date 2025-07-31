"use client";

import { useState } from "react";

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

      // Set cursor position after the inserted tab
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
            className="w-full h-full min-h-[200px] p-4 resize-none outline-none"
            style={{
              backgroundColor: "transparent",
              color: "var(--foreground)",
            }}
          />
        ) : (
          <div
            className="p-4 prose prose-sm max-w-none"
            style={{ color: "var(--foreground)" }}>
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );
}

// Markdown Preview Component
function MarkdownPreview({ content }: { content: string }) {
  if (!content.trim()) {
    return (
      <div className="text-gray-500 italic">
        No content to preview. Start writing in the Write tab.
      </div>
    );
  }

  return (
    <div className="markdown-preview">
      {content.split("\n").map((line, index) => {
        // Simple markdown parsing for preview
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-2xl font-bold mb-2">
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-xl font-bold mb-2">
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-bold mb-2">
              {line.substring(4)}
            </h3>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={index} className="mb-2">
              <strong>{line.substring(2, line.length - 2)}</strong>
            </p>
          );
        }
        if (
          line.startsWith("*") &&
          line.endsWith("*") &&
          !line.startsWith("**")
        ) {
          return (
            <p key={index} className="mb-2">
              <em>{line.substring(1, line.length - 1)}</em>
            </p>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-4 mb-1">
              • {line.substring(2)}
            </li>
          );
        }
        if (line.startsWith("1. ")) {
          return (
            <li key={index} className="ml-4 mb-1">
              {index + 1}. {line.substring(3)}
            </li>
          );
        }
        if (line.trim() === "") {
          return <br key={index} />;
        }
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      })}
    </div>
  );
}
