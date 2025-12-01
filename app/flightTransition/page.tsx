'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCountryById, getCountryByName } from '@/lib/data/destinations';
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
  const [travelData, setTravelData] = useState<{
    countryName: string;
    name: string;
    nationality: string;
  } | null>(null);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Get travel data from URL params or localStorage
    const destination = searchParams.get('destination');
    const name = searchParams.get('name');
    const departure = searchParams.get('departure'); // Where we're leaving from
    const nationality = searchParams.get('nationality'); // Original nationality (fallback)

    console.log('Flight params:', { departure, destination, name, nationality });

    if (destination) {
      // Use departure if available, otherwise use nationality (for first flight)
      const startCountry = departure || nationality || 'American';

      setTravelData({
        countryName: destination,
        name: name || 'Traveler',
        nationality: startCountry, // This will be used as the departure country
      });
    } else {
      // Try localStorage fallback
      const stored = localStorage.getItem('dreamData');
      if (stored) {
        const data = JSON.parse(stored);
        setTravelData({
          countryName: data.destinations?.[0] || 'India',
          name: data.name || 'Traveler',
          nationality: data.nationality || 'American',
        });
      } else {
        router.push('/dreamForm');
      }
    }
  }, [searchParams, router]);

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
