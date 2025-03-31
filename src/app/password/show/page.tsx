"use client";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import * as faceapi from "face-api.js";

interface PasswordEntry {
  domain_name: string;
  link: string;
  password: string;
}

export default function ShowPasswordPage() {
  const token = localStorage.getItem("access_token");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isVerified, setIsVerified] = useState(false); // For face verification status
  const [imageData, setImageData] = useState<string | null>(null);
  const [faceIdVerified, setFaceIdVerified] = useState<boolean>(false);
  const [faceCaptured, setFaceCaptured] = useState(false);

  // Camera references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("⏳ Loading face detection models...");
        await faceapi.nets.ssdMobilenetv1.loadFromUri(
          "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/"
        );
        await faceapi.nets.tinyFaceDetector.loadFromUri(
          "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/"
        );
        await faceapi.nets.faceLandmark68Net.loadFromUri(
          "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/"
        );
        await faceapi.nets.faceRecognitionNet.loadFromUri(
          "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/"
        );
        setModelsLoaded(true);
        console.log("Face detection models loaded!");
      } catch (error) {
        console.error("Error loading face detection model:", error);
      }
    };
    loadModels();
  }, []);

  // Fetch user data and face image from backend
  useEffect(() => {
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
  }, []);

  // Start the camera and begin face detection
  const startCamera = async () => {
    if (!modelsLoaded) {
      alert("Face detection model is still loading. Please wait...");
      return;
    }

    setIsCameraOpen(true);
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
    }
  };

  // Capture image and show the captured image instead of the camera feed
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

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

  // Handle sending OTP request
  const handleSendOTP = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("You must be logged in to send OTP.");
        return;
      }
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/send-otp-email/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true); // Mark OTP as sent
        const userEmail = data.user.email;
        toast.success(`OTP has been sent to your email: ${userEmail}`);
      } else {
        toast.error(data.error || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP.");
    }
  };

  // Handle OTP submission and fetch passwords from backend
  const handleOTPSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("You must be logged in to view passwords.");
        return;
      }
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/verify-otp/?otp=${otp}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPasswords(data); // Set the passwords if OTP is verified successfully
        setIsVerified(true);
        toast.success("Passwords fetched successfully!");
      } else {
        toast.error(data.error || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error submitting OTP:", error);
      toast.error("An error occurred while submitting the OTP.");
    }
  };
  const uploadFaceId = async () => {
    try {
      const formData = new FormData();
      // imageData is an object URL; fetch it to get the Blob
      const responseBlob = await fetch(imageData!);
      const imageBlob = await responseBlob.blob();
      formData.append("image", imageBlob, "face.png");

      const response = await fetch(
        "http://127.0.0.1:8000/api/users/verify-face-id/",
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
        toast.success("Face ID Matches");
        setFaceIdVerified(true);
      } else {
        const errorData = await response.json();
        toast.error("Face doesn't match. Please try again");
      }
    } catch (error) {
      console.error("⚠️ Error uploading Face. Please try again.", error);
      toast.error("Error uploading Face. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col items-center justify-center space-y-6 min-h-[400px]">
        <h2 className="text-3xl font-bold text-center">Show Passwords</h2>

        {/* Face ID Verification */}

        <div className="space-y-4 w-full flex flex-col items-center">
          {!faceIdVerified && (
            <button
              className="mx-auto w-42 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              onClick={startCamera}
              disabled={!modelsLoaded}
            >
              {isCameraOpen ? "Verifying Face ID..." : "Verify Face ID"}
            </button>
          )}
          {!faceIdVerified && isCameraOpen && (
            <div className="relative w-full flex flex-col items-center">
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
                className="w-32 bg-red-600 text-white py-2 rounded-lg mt-2 mx-auto"
                onClick={captureImage}
              >
                Capture Image
              </button>
            </div>
          )}
        </div>

        {!faceIdVerified && faceCaptured && imageData && (
          <div className="text-center mt-4">
            <p className="text-gray-400">Captured Face:</p>
            <img
              src={imageData}
              alt="Captured Face"
              className="w-32 h-32 mx-auto border border-gray-600 rounded-lg"
            />
            <button
              className="w-32 bg-blue-600 text-white py-2 rounded-lg mt-2 mx-auto"
              onClick={uploadFaceId}
            >
              Scan Face Id
            </button>
          </div>
        )}

        {/* OTP Verify */}
        {faceIdVerified && (
          <div className="space-y-4 w-full flex flex-col items-center">
            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                className="mx-auto w-32 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Send OTP
              </button>
            ) : (
              !isVerified && (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
                  />
                  <button
                    onClick={handleOTPSubmit}
                    className="mx-auto w-42 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Submit OTP
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* Display passwords if OTP and face verification are done */}
        {isVerified && (
          <div className="mt-6 w-full overflow-x-auto">
            <table className="table-auto border-collapse w-full bg-gray-800 rounded-lg shadow">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-700">Domain</th>
                  <th className="px-4 py-2 border-b border-gray-700">Link</th>
                  <th className="px-4 py-2 border-b border-gray-700">
                    Password
                  </th>
                </tr>
              </thead>
              <tbody>
                {passwords.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-4 py-2 border-b border-gray-700 text-gray-200">
                      {entry.domain_name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700 text-gray-200 break-words">
                      {entry.link}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700 text-gray-200 break-words">
                      {entry.password}
                    </td>
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
