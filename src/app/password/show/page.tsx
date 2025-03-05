"use client";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

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

  const handleSignOut = () => {
    setIsAuthenticated(false); // Clear the authenticated state
    toast.success("Successfully logged out!"); // Show success message
    router.push("/"); // Redirect to the Home Page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {/* Header Section */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center">Show Passwords</h2>

        {/* Face ID Verification */}
        {!isVerified && (
          <div className="space-y-4">
            {/* Face ID Button */}
            <button
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              onClick={handleFaceID}
              disabled={isCameraOpen}
            >
              {isCameraOpen ? "Verifying Face ID..." : "Verify Face ID"}
            </button>

            {/* Loading Animation */}
            {isCameraOpen && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
              </div>
            )}

            {/* OTP Input (Shown after Face ID is Verified) */}
            {otpSent && !isOTPVerified && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                  onClick={handleOTPSubmit}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show Table with Passwords (Only if Face ID & OTP Verified) */}
        {isVerified && (
          <div className="mt-6">
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
    </div>
  );
}