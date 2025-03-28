"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and Password are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("📥 API Response:", data);

      if (response.ok) {
        // Store JWT tokens
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("refresh_token", data.refresh);

        setIsAuthenticated(true);
        toast.success("Logged in successfully!");
        router.push("../dashboard");
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("⚠️ API Error:", error);
      toast.error("⚠️ Error connecting to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          required
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="text-center text-sm text-gray-400 cursor-pointer hover:text-blue-500 transition duration-300"
          onClick={() => router.push("./signup")}
        >
          Don't have an account? Sign up
        </p>
      </div>
    </div>
  );
}
