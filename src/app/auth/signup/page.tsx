"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as faceapi from "face-api.js";

export default function SignupPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [faceDetected, setFaceDetected] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);

  // Camera references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ✅ Load Face Detection Models Before Using
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("⏳ Loading face detection models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models"); // Ensure this path is correct!
        setModelsLoaded(true);
        console.log("✅ Face detection model loaded!");
      } catch (error) {
        console.error("⚠️ Error loading face detection model:", error);
      }
    };
    loadModels();
  }, []);

  // ✅ Start Camera
  const startCamera = async () => {
    if (!modelsLoaded) {
      alert("Face detection model is still loading. Please wait...");
      return;
    }

    setIsCameraOpen(true);
    setFaceDetected(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      detectFace(); // Start detecting face as soon as camera starts
    } catch (error) {
      alert("Failed to access the camera.");
    }
  };

  // ✅ Detect Face in Real-Time with Bounding Box

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // ✅ Ensure video is loaded
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("⏳ Waiting for video to load...");
      return;
    }

    const detections = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detections) {
      setFaceDetected(true);
      console.log("✅ Face detected!");

      // ✅ Draw bounding box around face
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const { x, y, width, height } = detections.box;
        context.strokeStyle = "blue";
        context.lineWidth = 2;
        context.strokeRect(x, y, width, height);

        // ✅ Add label "Face Confirmed"
        context.fillStyle = "blue";
        context.fillRect(x, y - 20, width, 20);
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.fillText("Face Confirmed", x + 5, y - 5);
      }
    } else {
      setFaceDetected(false);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Stop running detection before capturing
    setFaceDetected(false);

    const video = videoRef.current;
    const context = canvasRef.current.getContext("2d");

    if (!context) return;

    // ✅ Detect face before capturing
    const detections = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (!detections) {
      alert("No face detected! Try again.");
      return;
    }

    console.log("✅ Face detected! Attempting to capture...");

    const { x, y, width, height } = detections.box; // Face bounding box

    // ✅ Crop only the detected face
    const faceCanvas = document.createElement("canvas");
    faceCanvas.width = width;
    faceCanvas.height = height;
    const faceCtx = faceCanvas.getContext("2d");

    if (faceCtx) {
      faceCtx.drawImage(
        video,
        x,
        y,
        width,
        height, // Source (bounding box)
        0,
        0,
        width,
        height // Destination (cropped face)
      );

      const faceImageDataUrl = faceCanvas.toDataURL("image/png", 0.8);
      setImageData(faceImageDataUrl);
      setFaceCaptured(true);

      console.log("✅ Image Captured!");

      // ✅ Stop the camera **after** capturing
      setIsCameraOpen(false);
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // ✅ Keep face detection running while camera is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCameraOpen) {
      interval = setInterval(detectFace, 500);
    }
    return () => clearInterval(interval);
  }, [isCameraOpen]);

  // ✅ Handle Signup API Call
  const handleSignup = async () => {
    if (!name || !phone || !email || !password || !imageData) {
      alert("All fields are required, including face scan!");
      return;
    }

    console.log("📤 Sending Signup Data:", {
      username: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      face_image: imageData,
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          face_image: imageData,
        }),
      });

      const data = await response.json();
      console.log("📥 API Response:", data);

      if (response.ok) {
        alert("✅ Signup successful! Redirecting to login...");
        setTimeout(() => router.push("./login"), 2000);
      } else {
        alert(`❌ Signup failed: ${JSON.stringify(data)}`);
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
        {!faceDetected && (
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg"
            onClick={startCamera}
            disabled={!modelsLoaded}
          >
            {modelsLoaded ? "Scan Face" : "Loading Model..."}
          </button>
        )}

        {/* Camera Preview */}
        {isCameraOpen && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-60 border border-gray-600 rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
            <button
              className="w-full bg-red-600 text-white py-2 rounded-lg mt-2 relative z-10"
              onClick={captureImage}
            >
              Capture Image
            </button>
          </div>
        )}
        {imageData && (
          <div className="text-center mt-4">
            <p className="text-gray-400">Captured Face:</p>
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
      </div>
    </div>
  );
}
