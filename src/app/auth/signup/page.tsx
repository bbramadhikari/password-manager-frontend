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

    // Store Data (You can send it to the backend later)
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
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 text-white">
      <h2 className="text-2xl font-bold">Sign Up</h2>

      <input
        type="text"
        placeholder="Name (min 8 characters)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-4 p-2 border rounded w-80 text-black"
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-4 p-2 border rounded w-80 text-black"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 p-2 border rounded w-80 text-black"
        required
      />
      <input
        type="password"
        placeholder="Password (min 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-4 p-2 border rounded w-80 text-black"
        required
      />

      {/* Face Scan Section */}
      {!faceCaptured && (
        <button
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
          onClick={startCamera}
        >
          Scan Face
        </button>
      )}

      {/* Camera Preview */}
      {isCameraOpen && (
        <div className="mt-4">
          <video
            ref={videoRef}
            autoPlay
            className="w-80 h-60 border border-gray-300"
          />
          <button
            className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg"
            onClick={captureImage}
          >
            Capture Image
          </button>
        </div>
      )}

      {/* Display Captured Image */}
      {faceCaptured && imageData && (
        <div className="mt-4">
          <p>Face Captured:</p>
          <img
            src={imageData}
            alt="Captured Face"
            className="w-32 h-32 border rounded-lg"
          />
        </div>
      )}

      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        onClick={handleSignup}
      >
        Sign Up
      </button>

      <p
        className="mt-4 text-sm cursor-pointer"
        onClick={() => router.push("./login")}
      >
        Already have an account? Login
      </p>

      {/* Hidden Canvas for Capturing Image */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
