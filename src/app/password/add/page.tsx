"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddPasswordPage() {
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // const handleSave = () => {
  //   if (!site || !password) {
  //     toast.error("Both fields are required!");
  //     return;
  //   }
  //   toast.success("Password saved!");
  // };

  const handleAdd = () => {
    if (!password) {
      alert("Please enter your password.");
      return;
    }

    if (!site) {
      alert("Please enter the domain name.");
      return;
    }

    alert("Password added successfully...");
    router.push("../dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <h2 className="text-2xl font-bold">Add Password</h2>

      <input
        type="text"
        placeholder="Website Link"
        className="mt-4 p-2 border rounded w-80 text-black"
        value={site}
        onChange={(e) => setSite(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="mt-4 p-2 border rounded w-80 text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="mt-4 px-6 py-2 bg-blue-600 rounded-lg"
        onClick={handleAdd}
      >
        Save Password
      </button>
    </div>
  );
}
