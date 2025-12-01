'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingPage from './components/LoadingPage';
import EyeTransition from './components/EyeTransition';
import DreamyParticles from './components/DreamyParticles';

const LandingPage = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleLoadingComplete = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLoading(false);
      setIsTransitioning(false);
    }, 1500);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/heroSection');
    }, 6000);

    return () => clearTimeout(timeout);
  }, [router]);
 
  if (showLoading) {
    return (
      <>
        <LoadingPage onLoadingComplete={handleLoadingComplete} />
        <EyeTransition isClosing={isTransitioning} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27]">
      {/* Dreamy Particles Background */}
      <DreamyParticles />

      {/* Beautiful animated background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-linear-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27]">
          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/4 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Center globe emoji with animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl sm:text-8xl md:text-9xl animate-bounce opacity-30">
            🌍
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

      {/* Eye transition */}
      <EyeTransition isClosing={isTransitioning} />
    </div>
  );
};

export default LandingPage;