"use client";

import { useState } from "react";

export default function MarkdownHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        Markdown Help
      </button>

      {isOpen && (
        <div
          className="mt-2 p-4 border rounded-lg text-sm"
          style={{
            backgroundColor: "var(--blur-bg)",
            borderColor: "var(--blur-border)",
            color: "var(--muted-text)",
          }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: "var(--foreground)" }}>
                Headers
              </h4>
              <div className="space-y-1 text-xs">
                <div>
                  <code># Heading 1</code>
                </div>
                <div>
                  <code>## Heading 2</code>
                </div>
                <div>
                  <code>### Heading 3</code>
                </div>
              </div>
            </div>

            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: "var(--foreground)" }}>
                Text Formatting
              </h4>
              <div className="space-y-1 text-xs">
                <div>
                  <code>**bold text**</code>
                </div>
                <div>
                  <code>*italic text*</code>
                </div>
                <div>
                  <code>`inline code`</code>
                </div>
              </div>
            </div>

            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: "var(--foreground)" }}>
                Lists
              </h4>
              <div className="space-y-1 text-xs">
                <div>
                  <code>- Unordered list</code>
                </div>
                <div>
                  <code>1. Ordered list</code>
                </div>
              </div>
            </div>

            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: "var(--foreground)" }}>
                Links & Code
              </h4>
              <div className="space-y-1 text-xs">
                <div>
                  <code>[Link text](url)</code>
                </div>
                <div>
                  <code>```code block```</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
