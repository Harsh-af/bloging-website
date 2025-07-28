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
      <p className="text-sm text-gray-100">
        ようこそ、<span className="font-bold">{user?.email}</span>
      </p>
      <button
        onClick={handleSignOut}
        className="border-[#c60000] border-[1px] bg-[#320000] text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm">
        ログアウト
      </button>
    </div>
  );
}
