"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";

interface PasswordEntry {
  domain: string;
  password: string;
}

export default function ShowPasswordPage() {
  const { setIsFaceVerified, isOTPVerified, setIsOTPVerified } = useAuth();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isVerified, setIsVerified] = useState(false);

  // Simulated password data (replace with real data from backend)
  const storedPasswords: PasswordEntry[] = [
    { domain: "google.com", password: "Google@123" },
    { domain: "facebook.com", password: "FbSecure#456" },
    { domain: "github.com", password: "GitHub$789" },
  ];

  // Simulate Face ID Verification
  const handleFaceID = () => {
    setIsCameraOpen(true);

    setTimeout(() => {
      setIsFaceVerified(true);
      setIsCameraOpen(false);
      toast.success("Face ID Verified ✅");

      setOtpSent(true);
      toast.success("OTP Sent to your email 📩");
    }, 3000);
  };

  // Verify OTP
  const handleOTPSubmit = () => {
    if (otp === "123456") {
      setIsOTPVerified(true);
      toast.success("OTP Verified ✅");

      // Show stored passwords after full verification
      setPasswords(storedPasswords);
      setIsVerified(true);
    } else {
      toast.error("Invalid OTP ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <h2 className="text-2xl font-bold">Show Passwords</h2>

      {/* Face ID Button */}
      {!isVerified && (
        <button
          className="mt-4 px-6 py-2 bg-blue-600 rounded-lg"
          onClick={handleFaceID}
        >
          Verify Face ID
        </button>
      )}

      {/* Simulated Camera View */}
      {isCameraOpen && <p className="mt-4">📷 Scanning Face...</p>}

      {/* OTP Input (Shown after Face ID is Verified) */}
      {otpSent && !isVerified && (
        <div className="mt-4 flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-2 border border-gray-300 rounded text-black"
          />
          <button
            className="mt-2 px-6 py-2 bg-green-600 rounded-lg"
            onClick={handleOTPSubmit}
          >
            Submit OTP
          </button>
        </div>
      )}

      {/* Show Table with Passwords (Only if Face ID & OTP Verified) */}
      {isVerified && (
        <div className="mt-6 w-3/4">
          <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-900">
                <th className="py-2 px-4 text-left">Domain</th>
                <th className="py-2 px-4 text-left">Password</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((entry, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="py-2 px-4">{entry.domain}</td>
                  <td className="py-2 px-4">{entry.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
