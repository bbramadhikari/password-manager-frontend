"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mt-6 space-x-4">
        <button
          className="px-6 py-2 bg-blue-600 rounded-lg"
          onClick={() => router.push("/password/add")}
        >
          Add Password
        </button>
        <button
          className="px-6 py-2 bg-green-600 rounded-lg"
          onClick={() => router.push("/password/show")}
        >
          Show Password
        </button>
      </div>
    </div>
  );
}
