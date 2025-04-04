"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import * as faceapi from "face-api.js";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [username, setUsername] = useState("Loading...");
  const [faceIdExists, setFaceIdExists] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  // imageData will store an object URL for the captured face image
  const [imageData, setImageData] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);

  // Camera references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const checkIfFaceIdExists = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/image/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // If the face image exists, the backend should return 200
        if (response.status === 200) {
          setFaceIdExists(true);
        }
      } catch (error) {
        console.error("⚠️ Error fetching face ID status:", error);
      }
    };

    const fetchUserData = async () => {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!token) {
        setUsername("Guest");
        console.error("❌ No access token found in localStorage");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        } else if (response.status === 401 && refreshToken) {
          // Attempt to refresh token
          const refreshResponse = await fetch(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          );

          if (refreshResponse.ok) {
            const { access, refresh } = await refreshResponse.json();
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // Retry fetching user data with the new access token
            const retryResponse = await fetch(
              "http://127.0.0.1:8000/api/users/me/",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${access}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (retryResponse.ok) {
              const data = await retryResponse.json();
              setUsername(data.username);
            } else {
              setUsername("Guest");
            }
          } else {
            setUsername("Guest");
            console.error(
              "❌ Failed to refresh token:",
              await refreshResponse.text()
            );
          }
        } else {
          setUsername("Guest");
        }
      } catch (error) {
        setUsername("Guest");
        console.error("⚠️ Error fetching user data:", error);
      }
    };

    const loadModels = async () => {
      try {
        console.log("⏳ Loading face detection models...");
        // Ensure the /models path is correctly served (e.g., in public folder)
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        setModelsLoaded(true);
        console.log("✅ Face detection model loaded!");
      } catch (error) {
        console.error("⚠️ Error loading face detection model:", error);
      }
    };

    loadModels();
    fetchUserData();
    checkIfFaceIdExists();
  }, []);

  // Start the camera and begin face detection
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
      detectFace();
    } catch (error) {
      alert("Failed to access the camera.");
    }
  };

  // Detect face in real-time and draw bounding box
  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

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

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const { x, y, width, height } = detections.box;
        context.strokeStyle = "blue";
        context.lineWidth = 2;
        context.strokeRect(x, y, width, height);
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

  // Capture image and show the captured image instead of the camera feed
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setFaceDetected(false);
    const video = videoRef.current;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    const detections = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (!detections) {
      alert("No face detected! Try again.");
      return;
    }

    console.log("✅ Face detected! Attempting to capture...");
    const { x, y, width, height } = detections.box;

    // Create a temporary canvas to crop the face region
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
        height, // Crop area from the video
        0,
        0,
        width,
        height // Draw onto temporary canvas
      );

      // Convert the cropped face to a Blob and create an object URL for display
      faceCanvas.toBlob(
        (blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setImageData(imageUrl);
            setFaceCaptured(true);
            console.log("✅ Image Captured!");

            // Stop the camera after capturing
            setIsCameraOpen(false);
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
          }
        },
        "image/png",
        0.8
      );
    }
  };

  // Keep face detection running while the camera is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCameraOpen) {
      interval = setInterval(detectFace, 500);
    }
    return () => clearInterval(interval);
  }, [isCameraOpen]);

  const uploadFaceId = async () => {
    try {
      const formData = new FormData();
      // imageData is an object URL; fetch it to get the Blob
      const responseBlob = await fetch(imageData!);
      const imageBlob = await responseBlob.blob();
      formData.append("image", imageBlob, "face.png");

      console.log("Uploading image with FormData:", formData);

      const response = await fetch(
        "http://127.0.0.1:8000/api/users/image-upload/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Do not set Content-Type manually; FormData does that automatically.
          },
          body: formData,
        }
      );

      // Use response.ok to check if the response status is in the 2xx range
      if (response.ok) {
        toast.success("Face uploaded successfully! Face ID setup complete.");
        setFaceIdExists(true);
        setImageData(null);
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        toast.error("Failed to upload face.");
      }
    } catch (error) {
      console.error("⚠️ Error uploading Face. Please try again.", error);
      toast.error("Error uploading Face. Please try again.");
    }
  };

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    toast.success("Successfully logged out!");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
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
        <h1 className="text-3xl font-bold text-center">
          Welcome, <span className="text-blue-400">{username}</span>! 🎉
        </h1>

        {!faceIdExists ? (
          <>
            {/* If no face ID exists, show the camera and capture/upload flow */}
            {!faceDetected && (
              <button
                className="w-full bg-green-600 text-white py-2 rounded-lg"
                onClick={startCamera}
                disabled={!modelsLoaded}
              >
                {modelsLoaded ? "Scan Face" : "Loading Model..."}
              </button>
            )}

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

            {faceCaptured && imageData && (
              <div className="text-center mt-4">
                <p className="text-gray-400">Captured Face:</p>
                <img
                  src={imageData}
                  alt="Captured Face"
                  className="w-32 h-32 mx-auto border border-gray-600 rounded-lg"
                />
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2"
                  onClick={uploadFaceId}
                >
                  Upload Face Id
                </button>
              </div>
            )}
          </>
        ) : (
          // If face ID exists, show password options
          <div className="space-y-4">
            <button
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              onClick={() => router.push("/password/add")}
            >
              Add Password
            </button>
            <button
              className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              onClick={() => router.push("/password/show")}
            >
              Show Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
