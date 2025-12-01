"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PassportDisplay from '../components/passport/passport-display';
import EyeTransition from '../components/EyeTransition';
import { getMusicManager } from '@/lib/utils/musicManager';

const PlanePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const departure = searchParams.get("departure"); // Current country (where we're leaving from)
  const destination = searchParams.get("destination"); // New country (where we're going)
  const name = searchParams.get("name");
  const nationality = searchParams.get("nationality"); // Original nationality (for first flight)

  const [showPassport, setShowPassport] = useState(true); // Show passport immediately
  const [userData, setUserData] = useState<any>(null);
  const [eyesClosed, setEyesClosed] = useState(false); // Eye transition state
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const dreamData = localStorage.getItem('dreamData');
    if (dreamData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserData(JSON.parse(dreamData));
    }

    // Journey music is already playing from hero section
    // It will continue through form page and passport display
  }, []);


  const handlePassportComplete = async () => {
    // Fade out journey music smoothly when passport closes
    const musicManager = getMusicManager();
    await musicManager.fadeOut(2000); // 2 second fade out
    console.log('🎵 Journey music faded out - passport closed');

    // Close eyes before transitioning to flight animation
    setIsNavigatingAway(true);
    setEyesClosed(true);
  };

  // Handle eye transition complete
  const handleEyeTransitionComplete = () => {
    if (isNavigatingAway) {
      // Eyes closed, now navigate to flight transition
      // Use departure if available, otherwise use nationality for first flight
      const startCountry = departure || nationality || 'American';

      if (destination) {
        router.push(
          `/flightTransition?departure=${encodeURIComponent(
            startCountry
          )}&destination=${encodeURIComponent(
            destination
          )}&name=${encodeURIComponent(name || "Traveler")}`
        );
      } else {
        router.push("/dreamForm");
      }
    }
  };

  return (
    <main className="w-screen h-screen bg-black relative">
      {/* Passport Display - Shows First */}
      {showPassport && userData && (
        <PassportDisplay
          data={{
            fullName: userData.name,
            dateOfBirth: userData.dateOfBirth || '',
            nationality: userData.nationality,
            destination: destination || 'Unknown',
            photo: userData.selfieBase64,
            passportId: userData.passportId
          }}
          onComplete={handlePassportComplete}
        />
      )}

      {/* Eye Transition */}
      <EyeTransition isClosing={eyesClosed} onTransitionComplete={handleEyeTransitionComplete} />
    </main>
  );
};

// Wrap in Suspense to handle useSearchParams
export default function PlanePageWrapper() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">✈️</div>
          <div className="text-white text-xl">Preparing your passport...</div>
        </div>
      </div>
    }>
      <PlanePage />
    </Suspense>
  );
}