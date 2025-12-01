'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Initialize camera
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsLoading(false);
          };
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError('Failed to access camera. Please allow camera permissions and try again.');
        setIsLoading(false);
      }
    };

    startCamera();

    // Cleanup
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Capture photo - Only capture the center cropped portion
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Calculate center crop dimensions (portrait orientation)
    // We want a 3:4 aspect ratio centered crop
    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;

    // Calculate crop dimensions to get center portion
    const targetAspectRatio = 3 / 4; // Portrait aspect ratio
    let cropWidth, cropHeight, cropX, cropY;

    if (sourceWidth / sourceHeight > targetAspectRatio) {
      // Video is wider than target, crop the sides
      cropHeight = sourceHeight;
      cropWidth = sourceHeight * targetAspectRatio;
      cropX = (sourceWidth - cropWidth) / 2;
      cropY = 0;
    } else {
      // Video is taller than target, crop top and bottom
      cropWidth = sourceWidth;
      cropHeight = sourceWidth / targetAspectRatio;
      cropX = 0;
      cropY = (sourceHeight - cropHeight) / 2;
    }

    // Set canvas to cropped size
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Draw only the center cropped portion
    context.drawImage(
      video,
      cropX, cropY, cropWidth, cropHeight, // Source crop
      0, 0, cropWidth, cropHeight          // Destination
    );

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a File object from the blob
        const file = new File([blob], `camera-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        // Stop camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        // Send captured photo to parent
        onCapture(file);
        onClose();
      }
    }, 'image/jpeg', 0.95);
  };

  // Toggle camera (front/back)
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Close and cleanup
  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="relative p-4 bg-gradient-to-b from-black via-black/90 to-transparent">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white transition-all border border-red-500/50"
          aria-label="Close camera"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-1">📸 Take Your Photo</h2>
          <p className="text-white/70 text-sm">Center yourself in the frame</p>
        </div>
      </div>

      {/* Camera View with Side Controls */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-white text-lg">Starting camera...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <div className="text-center space-y-4 max-w-md px-6">
              <div className="text-6xl">📷</div>
              <h3 className="text-xl font-bold text-white">Camera Access Denied</h3>
              <p className="text-white/80">{error}</p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Video Container - Shows only center cropped portion */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Cropping wrapper with fixed aspect ratio */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 'min(75vh, 90vw)',
              height: 'min(100vh, 120vw)',
              aspectRatio: '3/4'
            }}
          >
            {/* Video Element - Scaled to fill and centered */}
            <video
              ref={videoRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
              playsInline
              muted
            />
          </div>
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Overlay Guide - Centered */}
        {!isLoading && !error && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Circle guide centered */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 md:w-72 md:h-96 border-4 border-purple-400/50 rounded-full shadow-lg shadow-purple-500/30">
              {/* Inner circle for better guidance */}
              <div className="absolute inset-4 border-2 border-purple-300/30 rounded-full"></div>
            </div>

            {/* Instructions positioned at top */}
            <div className="absolute top-8 left-0 right-0 px-4">
              <div className="bg-black/70 backdrop-blur-md mx-auto max-w-md rounded-2xl p-4 border border-purple-500/30">
                <p className="text-white text-lg font-semibold text-center mb-2">
                  📸 Center Yourself
                </p>
                <p className="text-white/80 text-sm text-center">
                  Position your face within the purple circle
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Side Controls - RIGHT SIDE */}
        {!isLoading && !error && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto flex flex-col items-center gap-6">
            {/* Main Capture Button - Vertical on Side */}
            <button
              onClick={capturePhoto}
              className="group relative flex flex-col items-center gap-3 px-6 py-8 bg-gradient-to-b from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 rounded-3xl text-white font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-purple-500/50"
            >
              <Camera className="w-10 h-10" />
              <span className="writing-mode-vertical text-sm tracking-wider">CAPTURE</span>
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
            </button>

            {/* Toggle Camera Button */}
            <button
              onClick={toggleCamera}
              className="flex flex-col items-center gap-2 px-4 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all border border-white/20"
              title="Switch Camera"
            >
              <RotateCw className="w-6 h-6" />
              <span className="text-xs">Flip</span>
            </button>

            {/* Tip */}
            <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-purple-500/30 max-w-[100px]">
              <p className="text-white/80 text-[10px] text-center leading-tight">
                Center yourself, then tap CAPTURE
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
