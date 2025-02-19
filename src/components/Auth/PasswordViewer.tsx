import { useAuth } from "@/context/AuthContext";

export default function PasswordViewer() {
  const { isOTPVerified } = useAuth(); // Access the OTP verification status from context

  return (
    <div className="mt-6 p-4 border border-gray-400 rounded bg-gray-800 text-white">
      {isOTPVerified ? (
        <p>
          Your password: <strong>My$ecretP@ssword</strong>
        </p>
      ) : (
        <p className="text-red-500">Access Denied ❌</p>
      )}
    </div>
  );
}
