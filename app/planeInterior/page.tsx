"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spline from '@splinetool/react-spline';
import EyeTransition from '../components/EyeTransition';
import GlobalLoader from '../components/GlobalLoader';

const PlaneInteriorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const name = searchParams.get("name");
  const departure = searchParams.get("departure");
  const nationality = searchParams.get("nationality");

  const [audioDuration, setAudioDuration] = useState<number>(10);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const pilotSoundRef = useRef<HTMLAudioElement | null>(null);
  const engineSoundRef = useRef<HTMLAudioElement | null>(null);

  // Map country names to pilot sound files
  const getPilotSound = (country: string): string | null => {
    const soundMap: Record<string, string> = {
      'France': '/planesounds/PlaneSound_France.mp3',
      'India': '/planesounds/PlaneSound_India.mp3',
      'United Kingdom': '/planesounds/PlaneSound_UK.mp3',
      'United States': '/planesounds/PlaneSound_USA.mp3',
      'Russia': '/planesounds/PLaneSounds_Russia.mp3',
    };
    return soundMap[country] || null;
  };

  // Play pilot sound and engine sound when page loads
  useEffect(() => {
    if (destination) {
      const pilotSoundPath = getPilotSound(destination);

      // Initialize and play engine sound in background
      engineSoundRef.current = new Audio('/planesounds/planeenginesound.ogg');
      engineSoundRef.current.loop = true;
      engineSoundRef.current.volume = 0.3;
      engineSoundRef.current.play().catch(err => console.log('Engine sound play failed:', err));

      if (pilotSoundPath) {
        pilotSoundRef.current = new Audio(pilotSoundPath);
        pilotSoundRef.current.volume = 0.8;

        // Get audio duration once metadata is loaded
        pilotSoundRef.current.addEventListener('loadedmetadata', () => {
          if (pilotSoundRef.current) {
            const duration = pilotSoundRef.current.duration;
            setAudioDuration(duration);
            console.log(`Pilot voice duration: ${duration} seconds`);
          }
        });

        pilotSoundRef.current.play().catch(err => console.log('Pilot sound play failed:', err));
      }
    }

    // Cleanup audio on unmount
    return () => {
      if (pilotSoundRef.current) {
        pilotSoundRef.current.pause();
        pilotSoundRef.current = null;
      }
      if (engineSoundRef.current) {
        engineSoundRef.current.pause();
        engineSoundRef.current = null;
      }
    };
  }, [destination]);

  // Handle eye transition complete
  const handleEyeTransitionComplete = () => {
    if (isNavigatingAway && destination) {
      router.push(
        `/destination?destination=${encodeURIComponent(destination)}&name=${encodeURIComponent(name || "Traveler")}`
      );
    }
  };

  // Handle navigation after audio completes
  useEffect(() => {
    if (audioDuration > 0) {
      // Navigate after the pilot voice audio completes (add 1 second buffer)
      const navigationTimeout = setTimeout(() => {
        // Stop all sounds before navigation
        if (pilotSoundRef.current) {
          pilotSoundRef.current.pause();
          pilotSoundRef.current = null;
        }
        if (engineSoundRef.current) {
          engineSoundRef.current.pause();
          engineSoundRef.current = null;
        }

        // Close eyes before navigation
        setIsNavigatingAway(true);
        setEyesClosed(true);
      }, (audioDuration + 1) * 1000);

      return () => clearTimeout(navigationTimeout);
    }
  }, [audioDuration, destination, name, router]);

  return (
    <main className="w-screen h-screen bg-black relative">
      {/* Loading Screen */}
      {!isModelLoaded && <GlobalLoader />}

      {/* Spline Model */}
      <Spline
        scene="https://prod.spline.design/9oqyRFPyEEziBwU1/scene.splinecode"
        onLoad={() => setIsModelLoaded(true)}
      />

      {/* Eye Transition */}
      <EyeTransition isClosing={eyesClosed} onTransitionComplete={handleEyeTransitionComplete} />
    </main>
  );
};

// Wrap in Suspense to handle useSearchParams
export default function PlaneInteriorPageWrapper() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <PlaneInteriorPage />
    </Suspense>
  );
}
