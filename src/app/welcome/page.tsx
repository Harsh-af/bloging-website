import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-[80px] font-bold mb-8 dm-serif-display-regular text-gray-500">
          Welcome to <span className="text-gray-100">Blogger.</span>
        </h1>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signin"
            className="border-blue-600 border-[1px] text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            ログイン
          </Link>
          <Link
            href="/signup"
            className="border-green-600 border-[1px] text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
            新規登録
          </Link>
        </div>
      </div>
    </main>
  );
}
