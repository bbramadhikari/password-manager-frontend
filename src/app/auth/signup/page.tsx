"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Load Face Detection Models Before Using
  useEffect(() => {}, []);

  // ✅ Handle Signup API Call
  const handleSignup = async () => {
    if (!name || !phone || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();
      console.log("📥 API Response:", data);

      if (response.ok) {
        alert("✅ Signup successful! Redirecting to login...");
        setTimeout(() => router.push("./login"), 2000);
      } else {
        alert(`❌ Signup failed: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("⚠️ API Error:", error);
      alert("⚠️ Error connecting to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Full Name (min 8 characters)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        {/* Phone Input */}
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        {/* Sign Up Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
