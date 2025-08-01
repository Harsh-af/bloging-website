"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div
      className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-li:text-foreground prose-blockquote:text-foreground prose-code:text-foreground prose-pre:text-foreground"
      style={{ fontFamily: "Poppins, sans-serif" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => (
            <pre
              className="p-4 rounded-lg overflow-x-auto my-4"
              style={{
                backgroundColor: "var(--code-bg)",
                border: "1px solid var(--blur-border)",
              }}>
              {children}
            </pre>
          ),
          h1: ({ children }) => (
            <h1
              className="text-2xl font-semibold mb-4 mt-6 first:mt-0"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="text-xl font-semibold mb-3 mt-5"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="text-lg font-semibold mb-2 mt-4"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className="mb-3 leading-relaxed"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong
              className="font-semibold"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em
              className="italic"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul
              className="list-disc list-inside mb-3 space-y-1"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className="list-decimal list-inside mb-3 space-y-1"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              className="mb-1"
              style={{
                color: "var(--foreground)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic my-4"
              style={{
                color: "var(--muted-text)",
                fontFamily: "Poppins, sans-serif",
              }}>
              {children}
            </blockquote>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="px-1 py-0.5 rounded text-xs font-mono"
                  style={{
                    color: "var(--foreground)",
                    backgroundColor: "var(--code-bg)",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                  }}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="text-xs font-mono block w-full"
                style={{
                  color: "var(--foreground)",
                  fontFamily:
                    "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                  whiteSpace: "pre-wrap",
                }}>
                {children}
              </code>
            );
          },
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              {children}
            </a>
          ),
        }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
