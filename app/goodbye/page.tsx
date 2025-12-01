'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Home, Sparkles, Plane } from 'lucide-react';
import EyeTransition from '../components/EyeTransition';
import DreamyParticles from '../components/DreamyParticles';
import { getMusicManager } from '@/lib/utils/musicManager';

const GoodbyePage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Traveler');
  const [showContent, setShowContent] = useState(false);
  const [eyesClosed, setEyesClosed] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Get user data
    const dreamData = localStorage.getItem('dreamData');
    if (dreamData) {
      const data = JSON.parse(dreamData);
      setUserName(data.name || 'Traveler');
    }

    // Play ending music
    const musicManager = getMusicManager();
    musicManager.playEndingMusic();

    // Open eyes after a brief moment
    const eyeTimer = setTimeout(() => {
      setEyesClosed(false);
    }, 500);

    // Show content after eyes open
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => {
      clearTimeout(eyeTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const handleGoHome = () => {
    // Close eyes and navigate
    setIsNavigating(true);
    setEyesClosed(true);
  };

  const handleEyeTransitionComplete = () => {
    if (isNavigating) {
      // Stop music and clear localStorage
      const musicManager = getMusicManager();
      musicManager.fadeOut(1000);
      localStorage.removeItem('dreamData');
      router.push('/');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27] flex items-center justify-center">
      {/* Dreamy particle effect background */}
      <DreamyParticles />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>

      {/* Main content */}
      <div
        className={`relative z-10 text-center space-y-6 sm:space-y-8 px-4 sm:px-8 transition-all duration-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated farewell icon */}
        <div className="flex justify-center">
          <div className="relative">
            <Plane className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 text-blue-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-pink-400 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Goodbye message */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Safe Travels, {userName}!
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-blue-200/80 max-w-2xl mx-auto">
            Thank you for joining us on this incredible dream journey around the world
          </p>
        </div>

        {/* Inspirational message */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-purple-500/20 max-w-xl mx-auto">
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <p className="text-lg text-blue-100/90 leading-relaxed">
            &ldquo;The world is a book, and those who do not travel read only one page.&rdquo;
          </p>
          <p className="text-sm text-blue-200/60 mt-2">- Saint Augustine</p>
        </div>

        {/* Developers Section */}
        {/* <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl shadow-blue-500/20 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4 sm:mb-6">
            Meet the Developers
          </h2>

          
          <div className="mb-4 sm:mb-6 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
            <img
              src="/team-photo.jpg"
              alt="Dream Globe Development Team"
              className="w-full h-auto object-cover"
            />
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
           
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-green-400/50 transition-all hover:scale-105">
              <div className="text-center space-y-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-green-300">Shubh Varshney</h3>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-green-200/80">Deployment</p>
                  <p className="text-xs sm:text-sm text-green-200/80">Debugger</p>
                </div>
              </div>
            </div>

            
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-400/50 hover:border-blue-400/80 transition-all hover:scale-105 shadow-lg shadow-blue-500/30">
              <div className="text-center space-y-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-300">Vedant Gupta</h3>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-blue-200/90">Ideator</p>
                  <p className="text-xs sm:text-sm text-blue-200/90">Lead Developer</p>
                  <p className="text-xs sm:text-sm text-blue-200/90">Frontend</p>
                </div>
              </div>
            </div>

            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-pink-400/50 transition-all hover:scale-105">
              <div className="text-center space-y-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-pink-300">Yanshu Varshney</h3>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-pink-200/80">Research</p>
                  <p className="text-xs sm:text-sm text-pink-200/80">Assets Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Call to action */}
        <div className="space-y-4 pt-6 sm:pt-8">
          <button
            onClick={handleGoHome}
            className="group relative px-8 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl shadow-xl shadow-purple-500/30 hover:shadow-purple-400/50 transition-all duration-500 transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-center space-x-3">
              <Home className="w-6 h-6 text-white" />
              <span className="text-lg sm:text-xl font-semibold text-white tracking-wide">
                Return Home
              </span>
            </div>
          </button>

          <p className="text-sm text-blue-200/50">
            See you on your next adventure!
          </p>
        </div>
      </div>

      {/* Eye transition effect */}
      <EyeTransition isClosing={eyesClosed} onTransitionComplete={handleEyeTransitionComplete} />
    </div>
  );
};

export default GoodbyePage;
