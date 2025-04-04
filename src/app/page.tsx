"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md space-y-6 transform transition-all duration-500 hover:scale-105">
        <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
          Welcome to Password Manager 🔏
        </h1>
        <p className="text-center text-gray-400">
          We promise to keep your password safe.
        </p>
        <div className="space-y-4">
          <button
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>
          <button
            className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
