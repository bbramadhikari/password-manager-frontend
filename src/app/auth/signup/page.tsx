"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Camera states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Validation function
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Open Camera
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert("Failed to access the camera.");
    }
  };

  // Capture Image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = 300; // Resize for performance
      canvasRef.current.height = 300;
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 300, 300);
        const imageDataUrl = canvasRef.current.toDataURL("image/png", 0.8); // Compress
        setImageData(imageDataUrl);
        setFaceCaptured(true);
        setIsCameraOpen(false);

        // Stop the camera
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  // Handle Signup API Call
  const handleSignup = async () => {
    if (name.length < 8) {
      alert("Name must be at least 8 characters long.");
      return;
    }
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (!phone) {
      alert("Please enter your phone number.");
      return;
    }
    if (!faceCaptured || !imageData) {
      alert("Please scan your face before signing up.");
      return;
    }

    console.log("📤 Sending Signup Data:", {
      username: name,
      phone: phone,
      email: email,
      password: password,
      face_image: imageData,
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          phone: phone,
          email: email,
          password: password,
          face_image: imageData, // Sending Base64 image
        }),
      });

      const data = await response.json();
      console.log("📥 API Response:", data);

      if (response.ok) {
        alert("✅ Signup successful! Redirecting to login...");
        console.log("✅ Redirecting to /login...");

        setTimeout(() => {
          router.push("./login"); // ✅ Navigate to login after 2 seconds
        }, 2000);
      } else {
        alert(`❌ Signup failed: ${data.error || "Try again."}`);
      }
    } catch (error) {
      console.error("⚠️ API Error:", error);
      alert("⚠️ Error connecting to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Full Name (min 8 characters)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        {/* Phone Input */}
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        {/* Face Scan Section */}
        {!faceCaptured && (
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg"
            onClick={startCamera}
          >
            Scan Face
          </button>
        )}

        {/* Camera Preview */}
        {isCameraOpen && (
          <div className="space-y-2">
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-60 border border-gray-600 rounded-lg"
            />
            <button
              className="w-full bg-red-600 text-white py-2 rounded-lg"
              onClick={captureImage}
            >
              Capture Image
            </button>
          </div>
        )}

        {/* Display Captured Image */}
        {faceCaptured && imageData && (
          <div className="space-y-2">
            <p className="text-center text-gray-400">Face Captured:</p>
            <img
              src={imageData}
              alt="Captured Face"
              className="w-32 h-32 mx-auto border border-gray-600 rounded-lg"
            />
          </div>
        )}

        {/* Sign Up Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
          onClick={handleSignup}
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p
          className="text-center text-sm text-gray-400 cursor-pointer hover:text-blue-500"
          onClick={() => router.push("./login")}
        >
          Already have an account? Login
        </p>

        {/* Hidden Canvas for Capturing Image */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
