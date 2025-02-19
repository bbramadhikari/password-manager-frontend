"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);

    setTimeout(() => {
      if (password === confirmPassword) {
        setIsAuthenticated(true); // Set authenticated state
        toast.success("Account created successfully!");
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        toast.error("Passwords do not match");
      }

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <h2 className="text-2xl font-bold">Sign Up</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-4 p-2 border rounded w-80"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 p-2 border rounded w-80"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-4 p-2 border rounded w-80"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-4 p-2 border rounded w-80"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mt-4 p-2 border rounded w-80"
      />

      <button
        onClick={handleSignUp}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </button>

      <p
        className="mt-4 text-sm cursor-pointer"
        onClick={() => router.push("/auth/login")}
      >
        Already have an account? Login
      </p>
    </div>
  );
}
