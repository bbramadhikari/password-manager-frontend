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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Header Section */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Dashboard</h1>

        {/* Buttons */}
        <div className="space-y-4">
          {/* Add Password Button */}
          <button
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={() => router.push("/password/add")}
          >
            Add Password
          </button>

          {/* Show Password Button */}
          <button
            className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            onClick={() => router.push("/password/show")}
          >
            Show Password
          </button>
        </div>
      </div>
    </div>
  );
}