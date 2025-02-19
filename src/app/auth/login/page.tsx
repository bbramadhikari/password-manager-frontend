"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      // Simple email/password validation logic for demo purposes
      if (email === "test@example.com" && password === "password123") {
        setIsAuthenticated(true); // Set authenticated state
        toast.success("Logged in successfully!");
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        toast.error("Invalid credentials");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <h2 className="text-2xl font-bold">Login</h2>

      {/* Email input field */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded w-80 text-black bg-white"
      />

      {/* Password input field */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded w-80 text-black bg-white"
      />

      {/* Login button */}
      <button
        onClick={handleLogin}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Redirect to sign up */}
      <p
        className="mt-4 text-sm cursor-pointer"
        onClick={() => router.push("/auth/signup")}
      >
        Don't have an account? Sign up
      </p>
    </div>
  );
}
