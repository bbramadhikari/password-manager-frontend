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
    if (!email || !password) {
      toast.error("Email and Password are required!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (email === "test@example.com" && password === "password123") {
        setIsAuthenticated(true); // Mark user as authenticated
        toast.success("Logged in successfully!");
        router.push("../dashboard"); // Redirect to dashboard
      } else {
        toast.error("Invalid credentials");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <h2 className="text-2xl font-bold">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 p-2 border rounded w-80 text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-4 p-2 border rounded w-80 text-black"
      />

      <button
        onClick={handleLogin}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p
        className="mt-4 text-sm cursor-pointer"
        onClick={() => router.push("./signup")}
      >
        Don't have an account? Sign up
      </p>
    </div>
  );
}
