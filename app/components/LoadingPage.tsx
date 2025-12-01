'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [stars] = useState(() =>
    Array.from({ length: 50 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
    }))
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27] flex items-center justify-center z-50">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {isMounted && stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={star}
          />
        ))}
      </div>

      {/* Cosmic glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo */}
        <div className="relative inline-block animate-fade-in">
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
          </div>
          <div className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-1 shadow-2xl shadow-purple-500/50">
            <div className="w-full h-full rounded-full bg-[#0a0e27] flex items-center justify-center">
              <Sparkles className="w-20 h-20 text-blue-300 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Logo Text */}
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
          Dream Globe
        </h1>

        {/* Loading bar */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading text */}
        <p className="text-blue-200/80 text-lg animate-pulse">
          Preparing your dream journey...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
