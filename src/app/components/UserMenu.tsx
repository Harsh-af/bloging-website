"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/welcome");
  };

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm" style={{ color: "var(--foreground)" }}>
        ようこそ、<span className="font-bold">{user?.email}</span>
      </p>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 rounded text-sm backdrop-blur-sm transition-colors"
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "var(--foreground)",
          borderColor: "rgba(239, 68, 68, 0.3)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}>
        ログアウト
      </button>
    </div>
  );
}
