"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSkeleton } from "./SkeletonLoader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/welcome");
    }
  }, [user, loading, router]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
