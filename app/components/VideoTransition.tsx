'use client';

import React, { useEffect, useRef, useState } from 'react';
import EyeTransition from './EyeTransition';

interface VideoTransitionProps {
  videoSrc: string;
  onComplete: () => void;
  destinationName?: string;
  showEyeTransition?: boolean;
}

const VideoTransition: React.FC<VideoTransitionProps> = ({
  videoSrc,
  onComplete,
  destinationName,
  showEyeTransition = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showEyeClosing, setShowEyeClosing] = useState(showEyeTransition);
  const [showEyeOpening, setShowEyeOpening] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('Video loaded:', videoSrc);
      setVideoLoaded(true);

      // Start with eye closing if enabled
      if (showEyeTransition) {
        setTimeout(() => {
          setShowEyeClosing(false);
          setIsVideoPlaying(true);
          video.play().catch(err => console.error('Video play error:', err));
        }, 700); // Eye closing duration
      } else {
        setIsVideoPlaying(true);
        video.play().catch(err => console.error('Video play error:', err));
      }
    };

    const handleEnded = () => {
      console.log('Video ended');
      setIsVideoPlaying(false);

      // Show eye opening before transition
      if (showEyeTransition) {
        setShowEyeOpening(true);
        setTimeout(() => {
          onComplete();
        }, 700); // Eye opening duration
      } else {
        onComplete();
      }
    };

    const handleError = (e: Event) => {
      console.error('Video loading error:', e);
      // Skip to next if video fails to load
      setTimeout(onComplete, 500);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Preload the video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.pause();
    };
  }, [videoSrc, onComplete, showEyeTransition]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Eye Closing Transition - Start */}
      {showEyeClosing && (
        <EyeTransition
          isClosing={true}
          onTransitionComplete={() => setShowEyeClosing(false)}
        />
      )}

      {/* POV Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted={false}
        preload="auto"
        style={{ opacity: isVideoPlaying ? 1 : 0 }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Loading indicator */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse">🚕</div>
            <p className="text-white text-xl">
              {destinationName ? `Traveling to ${destinationName}...` : 'Loading...'}
            </p>
          </div>
        </div>
      )}

      {/* Destination label */}
      {isVideoPlaying && destinationName && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <p className="text-white text-lg font-medium">
              Traveling to {destinationName}
            </p>
          </div>
        </div>
      )}

      {/* Eye Opening Transition - End */}
      {showEyeOpening && (
        <EyeTransition
          isClosing={false}
          onTransitionComplete={() => setShowEyeOpening(false)}
        />
      )}

      {/* Skip button */}
      {isVideoPlaying && (
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.pause();
            }
            if (showEyeTransition) {
              setShowEyeOpening(true);
              setTimeout(onComplete, 700);
            } else {
              onComplete();
            }
          }}
          className="absolute top-6 right-6 z-20 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 text-white text-sm font-medium transition-all duration-300 hover:scale-105"
        >
          Skip →
        </button>
      )}
    </div>
  );
};

export default VideoTransition;
