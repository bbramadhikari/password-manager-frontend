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
      console.error("Error accessing the camera: ", error);
      alert("Failed to access the camera.");
    }
  };

  // Capture Image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        setImageData(imageDataUrl); // Store image data
        setFaceCaptured(true);
        setIsCameraOpen(false);
        // Stop the camera
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  };

  // Handle Signup
  const handleSignup = () => {
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
    if (!faceCaptured) {
      alert("Please scan your face before signing up.");
      return;
    }

    // Simulate sending data to the backend
    console.log({
      name,
      phone,
      email,
      password,
      faceImage: imageData,
    });

    alert("Signup successful! (Face image captured)");
    router.push("./login");
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
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          required
        />

        {/* Phone Input */}
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          required
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          required
        />

        {/* Face Scan Section */}
        {!faceCaptured && (
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
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
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={handleSignup}
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p
          className="text-center text-sm text-gray-400 cursor-pointer hover:text-blue-500 transition duration-300"
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