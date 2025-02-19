"use client"; // Ensure this is also marked as a client component
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaRegFaceSmile } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function FaceAuth() {
  const { setIsFaceVerified } = useAuth(); // Use the context
  const [loading, setLoading] = useState(false);

  const handleFaceScan = async () => {
    setLoading(true);
    setTimeout(() => {
      setIsFaceVerified(true);
      toast.success("Face ID Verified ✅");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <FaRegFaceSmile className="text-6xl text-blue-500" />
      <button
        onClick={handleFaceScan}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? "Scanning..." : "Verify Face ID"}
      </button>
    </div>
  );
}
