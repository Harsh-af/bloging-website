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

  const lines = content.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBlockContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for code block start/end
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <pre
            key={`code-${i}`}
            className="p-4 rounded-lg overflow-x-auto my-4 bg-gray-100 border border-gray-300">
            <code className="text-xs font-mono block w-full text-gray-700">
              {codeBlockContent.join("\n")}
            </code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        // Start of code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      // Add line to code block
      codeBlockContent.push(line);
      continue;
    }

    // Regular markdown parsing
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold mb-2">
          {line.substring(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold mb-2">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-bold mb-2">
          {line.substring(4)}
        </h3>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="mb-2">
          <strong>{line.substring(2, line.length - 2)}</strong>
        </p>
      );
    } else if (
      line.startsWith("*") &&
      line.endsWith("*") &&
      !line.startsWith("**")
    ) {
      elements.push(
        <p key={i} className="mb-2">
          <em>{line.substring(1, line.length - 1)}</em>
        </p>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="ml-4 mb-1">
          • {line.substring(2)}
        </li>
      );
    } else if (line.startsWith("1. ")) {
      elements.push(
        <li key={i} className="ml-4 mb-1">
          {i + 1}. {line.substring(3)}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(
        <p key={i} className="mb-2">
          {line}
        </p>
      );
    }
  }

  // Handle any remaining code block
  if (inCodeBlock && codeBlockContent.length > 0) {
    elements.push(
      <pre
        key="code-final"
        className="p-4 rounded-lg overflow-x-auto my-4 bg-gray-100 border border-gray-300">
        <code className="text-xs font-mono block w-full text-gray-700">
          {codeBlockContent.join("\n")}
        </code>
      </pre>
    );
  }

  return <div className="markdown-preview">{elements}</div>;
}
