"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import * as faceapi from "face-api.js";

interface PasswordEntry {
  domain: string;
  password: string;
}

export default function ShowPasswordPage() {
  const token = localStorage.getItem("access_token");

  const { setIsFaceVerified, isOTPVerified, setIsOTPVerified } = useAuth();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);

  const [faceIdImage, setFaceIdImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  // Simulated password data (replace with real data from backend)
  const storedPasswords: PasswordEntry[] = [
    { domain: "google.com", password: "Google@123" },
    { domain: "facebook.com", password: "FbSecure#456" },
    { domain: "github.com", password: "GitHub$789" },
  ];

  // Camera references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function base64ToImage(base64String: string) {
    const buffer = Buffer.from(base64String.split(",")[1], "base64");
    const image = await faceapi.bufferToImage(buffer as unknown as Blob);
    return image;
  }

  // ✅ Load Face Detection Models Before Using
  useEffect(() => {
    const matchFaceId = async () => {
      console.log(imageData === faceIdImage, imageData, faceIdImage);

      base64ToImage(imageData as string)
        .then(async (image) => {
          // Perform face detection
          const detections = await faceapi
            .detectAllFaces(image)
            .withFaceLandmarks()
            .withFaceDescriptors();
          console.log("detections", detections);
        })
        .catch((error) => {
          console.error("Error converting base64 to image:", error);
        });

      // Load images
      // const image1 = await faceapi.fetchImage(base64ToImage(imageData)); // Replace with your first image data
      // const image2 = await faceapi.fetchImage(faceIdImage as string); // Replace with your second image data

      // // Detect faces and extract descriptors
      // const detections1 = await faceapi.detectAllFaces(image1);

      // const detections2 = await faceapi.detectAllFaces(image2);

      // console.log(detections1, detections2);
    };
    if (imageData && !isVerified) {
      matchFaceId();
    }
  }, [isVerified, imageData]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response: any = await fetch("http://127.0.0.1:8000/api/users/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const json = await response.json();
        setFaceIdImage(json.face_image);
      }
    };
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
    fetchUserData();
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

  // Simulate Face ID Verification

  // Verify OTP
  const handleOTPSubmit = async () => {
    if (otp === "123456") {
      setIsOTPVerified(true);
      toast.success("OTP Verified ✅");
      // Fetch passwords from backend after successful OTP verification
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("You must be logged in to view passwords.");
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/api/users/passwords/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPasswords(data); // Update state with the fetched passwords
          setIsVerified(true); // Show passwords after verification
          toast.success("Passwords fetched successfully!");
        } else {
          toast.error("Failed to fetch passwords.");
        }
      } catch (error) {
        toast.error("Error fetching passwords: " + error);
      }
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
              onClick={startCamera}
            >
              {isCameraOpen ? "Verifying Face ID..." : "Verify Face ID"}
            </button>

            {/* Loading Animation */}
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
