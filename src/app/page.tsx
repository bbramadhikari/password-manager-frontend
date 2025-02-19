// app/page.tsx
"use client"; // This tells Next.js this is a client-side component

import { useAuth } from "@/context/AuthContext";
import FaceAuth from "@/components/Auth/FaceAuth";
import OTPAuth from "@/components/Auth/OTPAuth";
import PasswordViewer from "@/components/Auth/PasswordViewer";

export default function HomePage() {
  const { isFaceVerified, isOTPVerified } = useAuth(); // Destructure auth states

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Password Manager</h1>

      {/* Render Face Authentication if Face ID not verified */}
      {!isFaceVerified && <FaceAuth />}

      {/* Render OTP Authentication if OTP not verified */}
      {isFaceVerified && !isOTPVerified && <OTPAuth />}

      {/* Show password if both Face ID and OTP are verified */}
      {isFaceVerified && isOTPVerified && <PasswordViewer />}
    </div>
  );
}
