"use client";

import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log("Current theme before toggle:", theme);
    toggleTheme();
    console.log(
      "Theme toggled, new theme:",
      theme === "light" ? "dark" : "light"
    );
    console.log("HTML classes:", document.documentElement.classList.toString());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg backdrop-blur-sm transition-colors"
      style={{
        backgroundColor: "var(--blur-bg)",
        borderColor: "var(--blur-border)",
        border: "1px solid var(--blur-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
      {theme === "light" ? (
        // Moon icon for dark mode
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          style={{ color: "var(--foreground)" }}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          style={{ color: "var(--foreground)" }}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M17.66 6.34l1.41-1.41" />
          <path d="M6.34 17.66l-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
