'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import EyeTransition from '../components/EyeTransition';

// Dynamically import to avoid SSR issues with Three.js
const FlightTransition = dynamic(() => import('../components/FlightTransition'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">✈️</div>
        <p className="text-white text-xl">Preparing your flight...</p>
      </div>
    </div>
  ),
});

const FlightTransitionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localTravelData, setLocalTravelData] = useState<{
    countryName: string;
    name: string;
    nationality: string;
  } | null>(null);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Derive travel data from URL params (primary) or local state (fallback)
  const destination = searchParams.get('destination');
  const name = searchParams.get('name');
  const departure = searchParams.get('departure');
  const nationality = searchParams.get('nationality');

  let travelData = null;

  if (destination) {
    const startCountry = departure || nationality || 'American';
    travelData = {
      countryName: destination,
      name: name || 'Traveler',
      nationality: startCountry,
    };
  } else {
    travelData = localTravelData;
  }

  useEffect(() => {
    // Only try localStorage if we don't have URL params and haven't loaded local data yet
    if (!destination && !localTravelData) {
      const stored = localStorage.getItem('dreamData');
      if (stored) {
        const data = JSON.parse(stored);
        // Use a functional update or check to ensure we don't trigger unnecessary re-renders
        // though here we are transitioning from null to object, so it will render.
        // We defer this slightly to avoid "synchronous" warning if strictly needed,
        // but checking if it's already set (which we did in the if) should be enough.
        // The linter might be complaining because it thinks this runs on every render.
        // But localTravelData dependency will cause a loop if we don't check.
        // We added !localTravelData to the check above.
        // Defer state update to next tick to avoid synchronous setState warning
        setTimeout(() => {
          setLocalTravelData({
            countryName: data.destinations?.[0] || 'India',
            name: data.name || 'Traveler',
            nationality: data.nationality || 'American',
          });
        }, 0);
      } else {
        router.push('/dreamForm');
      }
    }
  }, [destination, localTravelData, router]);

  const handleAnimationComplete = () => {
    console.log('Flight animation complete! Closing eyes before destination...');

    // Close eyes before navigation
    setIsNavigating(true);
    setEyesClosed(true);
  };

  const handleEyeTransitionComplete = () => {
    if (isNavigating && travelData) {
      router.push(
        `/planeInterior?destination=${encodeURIComponent(travelData.countryName)}&name=${encodeURIComponent(travelData.name)}&departure=${encodeURIComponent(travelData.nationality)}`
      );
    }
  };

  if (!travelData) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">✈️</div>
          <div className="text-white text-2xl animate-pulse">
            Preparing your journey...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <FlightTransition
        startCountry={travelData.nationality}
        endCountry={travelData.countryName}
        onComplete={handleAnimationComplete}
      />
      {/* Eye Transition */}
      <EyeTransition isClosing={eyesClosed} onTransitionComplete={handleEyeTransitionComplete} />
    </>
  );
};

// Wrap in Suspense to handle useSearchParams
export default function FlightTransitionPageWrapper() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">✈️</div>
          <div className="text-white text-2xl animate-pulse">
            Preparing your journey...
          </div>
        </div>
      </div>
    }>
      <FlightTransitionPage />
    </Suspense>
  );
}
