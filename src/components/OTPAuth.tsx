import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OTPAuth() {
  const { setIsOTPVerified } = useAuth(); // Get the setter for OTP verification
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(""); // State to hold error message

  const handleOTPSubmit = async () => {
    setLoading(true);
    setError(""); // Clear any previous error messages
    console.log("Entered OTP:", otp); // Debug: log the OTP entered by the user

    // Simulate a delay for OTP verification
    setTimeout(() => {
      const trimmedOTP = otp.trim(); // Trim the OTP input to remove spaces
      console.log("Trimmed OTP:", trimmedOTP); // Debug: log the OTP after trimming

      // Check if the OTP entered is correct (in this case, it's hardcoded as '123456')
      if (trimmedOTP === "123456") {
        console.log("OTP is correct! Updating verification status."); // Log success
        setIsOTPVerified(true); // Set OTP verification status
        toast.success("OTP Verified ✅"); // Show success toast
        setError(""); // Clear any error message if OTP is correct
      } else {
        console.log("Invalid OTP entered:", trimmedOTP); // Log failure
        setError("Invalid OTP. Please try again."); // Set error message to display
        toast.error("Invalid OTP. Please try again."); // Show error toast
        setIsOTPVerified(false); // Set OTP verification status to false if incorrect
      }

      setLoading(false); // Stop loading after the OTP check is done
    }, 2000); // Simulated delay for the OTP check
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value);
          console.log("OTP state updated to:", e.target.value); // Debug: log OTP state updates
        }}
        className="mt-4 p-2 border border-gray-300 rounded"
        placeholder="Enter OTP"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}{" "}
      {/* Display error message */}
      <button
        onClick={handleOTPSubmit}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        disabled={loading} // Disable the button when loading
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}
