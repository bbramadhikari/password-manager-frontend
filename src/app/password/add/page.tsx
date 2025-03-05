"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddPasswordPage() {
  const [siteName, setSiteName] = useState("");
  const [siteLink, setSiteLink] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Handle Add Password
  const handleAdd = () => {
    if (!siteName) {
      alert("Please enter the website name.");
      return;
    }

    if (!siteLink) {
      alert("Please enter the website link.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    alert("Password added successfully...");
    router.push("../dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {/* Main Content */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center">Add Password</h2>

        {/* Website Name Input */}
        <input
          type="text"
          placeholder="Website Name"
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />

        {/* Website Link Input */}
        <input
          type="text"
          placeholder="Website Link (e.g., https://example.com)"
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          value={siteLink}
          onChange={(e) => setSiteLink(e.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Save Password Button */}
        <button
          className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={handleAdd}
        >
          Save Password
        </button>
      </div>
    </div>
  );
}