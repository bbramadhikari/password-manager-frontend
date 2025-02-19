import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OTPAuth() {
  const { setIsOTPVerified } = useAuth(); // Get the setter for OTP verification
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleOTPSubmit = async () => {
    setLoading(true);
    console.log("Entered OTP:", otp); // Debug: log the OTP entered by the user

    // Simulate OTP validation logic
    setTimeout(() => {
      const trimmedOTP = otp.trim(); // Remove any spaces from the OTP entered
      console.log("Trimmed OTP:", trimmedOTP); // Debug: check the OTP after trimming

      if (trimmedOTP === "123456") {
        console.log("OTP is correct! Updating verification status."); // Debug: log on success
        setIsOTPVerified(true); // Set OTP verification status
        toast.success("OTP Verified ✅");
      } else {
        console.log("Invalid OTP entered:", trimmedOTP); // Debug: log on failure
        toast.error("Invalid OTP");
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value);
          console.log("OTP state updated to:", e.target.value); // Debug: log when OTP state updates
        }}
        className="mt-4 p-2 border border-gray-300 rounded text-black"
        placeholder="Enter OTP"
      />
      <button
        onClick={handleOTPSubmit}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}
