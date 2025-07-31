"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-li:text-foreground prose-blockquote:text-foreground prose-code:text-foreground prose-pre:text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              className="text-2xl font-bold mb-4 mt-6 first:mt-0"
              style={{ color: "var(--foreground)" }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="text-xl font-bold mb-3 mt-5"
              style={{ color: "var(--foreground)" }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="text-lg font-bold mb-2 mt-4"
              style={{ color: "var(--foreground)" }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className="mb-3 leading-relaxed"
              style={{ color: "var(--foreground)" }}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong
              className="font-bold"
              style={{ color: "var(--foreground)" }}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic" style={{ color: "var(--foreground)" }}>
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul
              className="list-disc list-inside mb-3 space-y-1"
              style={{ color: "var(--foreground)" }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className="list-decimal list-inside mb-3 space-y-1"
              style={{ color: "var(--foreground)" }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-1" style={{ color: "var(--foreground)" }}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic my-4"
              style={{ color: "var(--muted-text)" }}>
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                  style={{ color: "var(--foreground)" }}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
                <code
                  className="text-sm font-mono"
                  style={{ color: "var(--foreground)" }}>
                  {children}
                </code>
              </pre>
            );
          },
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
