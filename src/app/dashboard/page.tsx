"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [username, setUsername] = useState("Loading...");

  // Fetch user details from the database
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUsername("Guest");
        console.error("❌ No access token found in localStorage");
        return;
      }

      console.log("📡 Fetching user details with token:", token); // ✅ Log Token

      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("🔹 API Response Status:", response.status); // ✅ Log API Status

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Fetched User Data:", data); // ✅ Log User Data
          setUsername(data.username); // Set the fetched username
        } else {
          setUsername("Guest");
          console.error(
            "❌ Failed to fetch user details:",
            await response.text()
          );
        }
      } catch (error) {
        setUsername("Guest");
        console.error("⚠️ Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setIsAuthenticated(false);
    toast.success("Successfully logged out!");
    router.push("/");
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
        <h1 className="text-3xl font-bold text-center">
          Welcome, <span className="text-blue-400">{username}</span>! 🎉
        </h1>

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
