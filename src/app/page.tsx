"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <h1 className="text-3xl font-bold">Welcome to Password Manager 🔐</h1>
      <p className="mt-2">Securely store and access your passwords</p>

      <div className="mt-6 space-x-4">
        {/* Login Button */}
        <button
          className="px-6 py-2 bg-blue-600 rounded-lg"
          onClick={() => router.push("/auth/login")}
        >
          Login
        </button>

        {/* Sign Up Button */}
        <button
          className="px-6 py-2 bg-green-600 rounded-lg"
          onClick={() => router.push("/auth/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
