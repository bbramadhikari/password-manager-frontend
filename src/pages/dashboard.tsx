import FaceAuth from "@/components/Auth/FaceAuth";
import OTPAuth from "@/components/Auth/OTPAuth";
import PasswordViewer from "@/components/Auth/PasswordViewer";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl mb-6">Secure Password Manager</h1>
      <FaceAuth />
      <OTPAuth />
      <PasswordViewer />
    </div>
  );
}
