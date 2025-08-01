"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

// Individual skeleton element
const Skeleton: React.FC<SkeletonProps> = ({ className = "", style = {} }) => (
  <div
    className={`animate-pulse bg-gray-300 dark:bg-gray-600 rounded ${className}`}
    style={{
      background:
        "linear-gradient(90deg, var(--skeleton-start) 25%, var(--skeleton-middle) 50%, var(--skeleton-end) 75%)",
      backgroundSize: "200% 100%",
      animation: "skeleton-loading 2.5s infinite",
      ...style,
    }}
  />
);

// Blog post skeleton
export const BlogPostSkeleton: React.FC = () => (
  <div
    className="p-6 rounded-lg border backdrop-blur-sm mb-4"
    style={{
      backgroundColor: "var(--blur-bg)",
      borderColor: "var(--blur-border)",
    }}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full ml-4" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </div>
);

// Blog list skeleton
export const BlogListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <BlogPostSkeleton key={index} />
    ))}
  </div>
);

// Full page loading skeleton
export const PageSkeleton: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>
  </div>
);

// Form skeleton
export const FormSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-10 w-24" />
  </div>
);

// Image upload skeleton
export const ImageUploadSkeleton: React.FC = () => (
  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
    <div className="flex flex-col items-center justify-center gap-2">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

// Card skeleton
export const CardSkeleton: React.FC = () => (
  <div
    className="p-6 rounded-lg border backdrop-blur-sm"
    style={{
      backgroundColor: "var(--blur-bg)",
      borderColor: "var(--blur-border)",
    }}>
    <Skeleton className="h-6 w-3/4 mb-4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex space-x-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
      </div>
    ))}
  </div>
);

// Custom skeleton with specific dimensions
export const CustomSkeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = "w-full", height = "h-4", className = "" }) => (
  <Skeleton className={`${width} ${height} ${className}`} />
);

// Button skeleton for loading states
export const ButtonSkeleton: React.FC<{
  className?: string;
  text?: string;
}> = ({ className = "", text = "Loading..." }) => (
  <button
    disabled
    className={`bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-2 px-4 rounded transition-colors disabled:opacity-50 ${className}`}
    style={{
      background:
        "linear-gradient(90deg, var(--skeleton-start) 25%, var(--skeleton-middle) 50%, var(--skeleton-end) 75%)",
      backgroundSize: "200% 100%",
      animation: "skeleton-loading 1.5s infinite",
    }}>
    <div className="flex items-center justify-center gap-2">
      <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      {text}
    </div>
  </button>
);

export default Skeleton;
