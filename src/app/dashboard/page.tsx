"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();

  const { setIsAuthenticated } = useAuth();

  // Handle Sign Out
  const handleSignOut = () => {
    setIsAuthenticated(false); // Clear the authenticated state
    toast.success("Successfully logged out!"); // Show success message
    router.push("/"); // Redirect to the Home Page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <button
        onClick={handleSignOut}
        className="absolute top-6 right-6 px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Sign Out
      </button>

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
