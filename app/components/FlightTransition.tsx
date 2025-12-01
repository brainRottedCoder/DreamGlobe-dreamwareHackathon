'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Plane, Volume2, VolumeX } from 'lucide-react';

// Country data with map images and info
// This maps country names to their display info for the flight animation
const COUNTRIES = {
  destinations: {
    "India": { name: "Delhi, India", mapUrl: "https://flagcdn.com/w320/in.png", code: "DEL" },
    "United Kingdom": { name: "London, UK", mapUrl: "https://flagcdn.com/w320/gb.png", code: "LHR" },
    "Russia": { name: "Moscow, Russia", mapUrl: "https://flagcdn.com/w320/ru.png", code: "SVO" },
    "United States": { name: "New York, USA", mapUrl: "https://flagcdn.com/w320/us.png", code: "JFK" },
    "France": { name: "Paris, France", mapUrl: "https://flagcdn.com/w320/fr.png", code: "CDG" },
    "Japan": { name: "Tokyo, Japan", mapUrl: "https://flagcdn.com/w320/jp.png", code: "NRT" },
    "Egypt": { name: "Cairo, Egypt", mapUrl: "https://flagcdn.com/w320/eg.png", code: "CAI" },
    "Brazil": { name: "Rio, Brazil", mapUrl: "https://flagcdn.com/w320/br.png", code: "GIG" },
    "Italy": { name: "Rome, Italy", mapUrl: "https://flagcdn.com/w320/it.png", code: "FCO" },
    "Spain": { name: "Madrid, Spain", mapUrl: "https://flagcdn.com/w320/es.png", code: "MAD" },
    "Germany": { name: "Berlin, Germany", mapUrl: "https://flagcdn.com/w320/de.png", code: "TXL" },
    "Australia": { name: "Sydney, Australia", mapUrl: "https://flagcdn.com/w320/au.png", code: "SYD" },
    "Canada": { name: "Toronto, Canada", mapUrl: "https://flagcdn.com/w320/ca.png", code: "YYZ" },
  },
  origins: {
    "Indian": { name: "India", mapUrl: "https://flagcdn.com/w320/in.png", code: "IND" },
    "British": { name: "United Kingdom", mapUrl: "https://flagcdn.com/w320/gb.png", code: "GBR" },
    "Russian": { name: "Russia", mapUrl: "https://flagcdn.com/w320/ru.png", code: "RUS" },
    "American": { name: "United States", mapUrl: "https://flagcdn.com/w320/us.png", code: "USA" },
    "French": { name: "France", mapUrl: "https://flagcdn.com/w320/fr.png", code: "FRA" },
    "Japanese": { name: "Japan", mapUrl: "https://flagcdn.com/w320/jp.png", code: "JPN" },
    "Italian": { name: "Italy", mapUrl: "https://flagcdn.com/w320/it.png", code: "ITA" },
    "Spanish": { name: "Spain", mapUrl: "https://flagcdn.com/w320/es.png", code: "ESP" },
    "German": { name: "Germany", mapUrl: "https://flagcdn.com/w320/de.png", code: "DEU" },
    "Australian": { name: "Australia", mapUrl: "https://flagcdn.com/w320/au.png", code: "AUS" },
    "Canadian": { name: "Canada", mapUrl: "https://flagcdn.com/w320/ca.png", code: "CAN" },
    "Brazilian": { name: "Brazil", mapUrl: "https://flagcdn.com/w320/br.png", code: "BRA" },
  }
};

interface FlightTransitionProps {
  startCountry?: string;
  endCountry?: string;
  onComplete?: () => void;
}

const FlightTransition: React.FC<FlightTransitionProps> = ({
  startCountry = "Indian",
  endCountry = "France",
  onComplete = () => console.log('Animation complete')
}) => {
  const [phase, setPhase] = useState<'departure' | 'flying' | 'arrival'>('flying');
  const [planeProgress, setPlaneProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineSoundRef = useRef<HTMLAudioElement | null>(null);
  const pilotSoundRef = useRef<HTMLAudioElement | null>(null);

  // Helper to get country info - tries both origins and destinations
  const getCountryInfo = (countryName: string, type: 'start' | 'end') => {
    if (type === 'start') {
      // For start country, try origins first, then destinations
      return COUNTRIES.origins[countryName as keyof typeof COUNTRIES.origins] ||
             COUNTRIES.destinations[countryName as keyof typeof COUNTRIES.destinations] ||
             COUNTRIES.origins.American;
    } else {
      // For end country, try destinations first, then origins
      return COUNTRIES.destinations[countryName as keyof typeof COUNTRIES.destinations] ||
             COUNTRIES.origins[countryName as keyof typeof COUNTRIES.origins] ||
             COUNTRIES.destinations.France;
    }
  };

  const startInfo = getCountryInfo(startCountry, 'start');
  const endInfo = getCountryInfo(endCountry, 'end');

  // Calculate airplane rotation based on flight progress
  const getPlaneRotation = (progress: number): number => {
    if (progress < 0.3) {
      // Tilting up phase (takeoff): from -30° to 0°
      return -30 + (progress / 0.3) * 30;
    } else if (progress < 0.7) {
      // Horizontal phase (cruising): 0°
      return 0;
    } else {
      // Tilting down phase (landing): from 0° to 30°
      return ((progress - 0.7) / 0.3) * 30;
    }
  };

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

  // Audio management effect
  useEffect(() => {
    // Initialize audio elements
    engineSoundRef.current = new Audio('/planesounds/planeenginesound.ogg');
    engineSoundRef.current.loop = true;
    engineSoundRef.current.volume = 0.4; // Adjust volume as needed

    const pilotSoundPath = getPilotSound(endInfo.name.split(',')[0]);
    if (pilotSoundPath) {
      pilotSoundRef.current = new Audio(pilotSoundPath);
      pilotSoundRef.current.volume = 0.7; // Adjust volume as needed
    }

    // Cleanup function
    return () => {
      if (engineSoundRef.current) {
        engineSoundRef.current.pause();
        engineSoundRef.current = null;
      }
      if (pilotSoundRef.current) {
        pilotSoundRef.current.pause();
        pilotSoundRef.current = null;
      }
    };
  }, [endInfo.name]);

  // Handle mute/unmute
  useEffect(() => {
    if (engineSoundRef.current) {
      engineSoundRef.current.muted = isMuted;
    }
    if (pilotSoundRef.current) {
      pilotSoundRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle audio playback - start immediately
  useEffect(() => {
    // Start engine sound immediately
    engineSoundRef.current?.play().catch(err => console.log('Engine sound play failed:', err));

    // Play pilot sound after a short delay (1 second into the flight)
    const pilotTimeout = setTimeout(() => {
      pilotSoundRef.current?.play().catch(err => console.log('Pilot sound play failed:', err));
    }, 1000);

    return () => clearTimeout(pilotTimeout);
  }, []);

  // Animated star field background - optimized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create stars - reduced count for better performance
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      twinkleSpeed: number;
    }> = [];

    for (let i = 0; i < 150; i++) { // Reduced from 200 to 150
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Animation loop - optimized with requestAnimationFrame
    let animationId: number;
    let lastTime = performance.now();
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      // Throttle to target FPS
      if (deltaTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      lastTime = currentTime - (deltaTime % frameInterval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      stars.forEach((star) => {
        // Twinkling effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // Move stars (parallax effect)
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`;
        ctx.fill();

        // Add glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Animation timeline
  useEffect(() => {
    const timeline = [
      // Start flying immediately
      { delay: 0, action: () => setPhase('flying') },

      // Animate plane across screen (0-6s)
      { delay: 0, action: () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 0.01;
          setPlaneProgress(progress);
          if (progress >= 1) {
            clearInterval(interval);
          }
        }, 60); // 60ms for smooth animation
      }},

      // Complete (6s)
      { delay: 6000, action: onComplete },
    ];

    const timeouts = timeline.map(({ delay, action }) =>
      setTimeout(action, delay)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  // Handle skip with audio cleanup
  const handleSkip = () => {
    // Stop all audio
    if (engineSoundRef.current) {
      engineSoundRef.current.pause();
      engineSoundRef.current.currentTime = 0;
    }
    if (pilotSoundRef.current) {
      pilotSoundRef.current.pause();
      pilotSoundRef.current.currentTime = 0;
    }
    onComplete();
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-[#000814] via-[#001d3d] to-[#000814] overflow-hidden">
      {/* Control Buttons */}
      <div className="absolute top-6 right-6 z-50 flex gap-3">
        {/* Mute/Unmute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 text-white transition-all duration-300 hover:scale-105 shadow-lg"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 text-white text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Skip Animation →
        </button>
      </div>

      {/* Animated star field */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Enhanced Nebula glows with aurora effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main nebulas */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

        {/* Aurora effect - top */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-cyan-500/5 via-blue-500/5 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />

        {/* Aurora effect - bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-purple-500/5 via-pink-500/5 to-transparent animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />

        {/* Floating light orbs */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/60 rounded-full animate-float"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          >
            <div className="absolute inset-0 animate-ping">
              <div className="w-2 h-2 bg-cyan-400/40 rounded-full" />
            </div>
          </div>
        ))}

        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute animate-shooting-star"
            style={{
              top: `${10 + i * 30}%`,
              left: `${20 + i * 20}%`,
              animationDelay: `${i * 3 + 2}s`,
              animationDuration: '2s',
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              <div className="absolute top-0 right-0 w-20 h-0.5 bg-gradient-to-l from-white via-cyan-400/50 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">

        {/* Flying Phase - Always visible */}
        {(
          <div className="w-full max-w-5xl space-y-16">
            {/* Flight info header - Enhanced */}
            <div className="text-center space-y-8 animate-fade-in">
              <div className="flex items-center justify-center gap-16 text-white">
                {/* Departure Side - Enhanced with Country Map */}
                <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="relative inline-block">
                    <div className="w-24 h-16 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.5)] border-2 border-green-400/50">
                      <img src={startInfo.mapUrl} alt={startInfo.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Pulsing rings around map */}
                    <div className="absolute inset-0 animate-ping opacity-20">
                      <div className="w-full h-full rounded-lg bg-green-400/50" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {startInfo.name}
                    </p>
                    <p className="text-sm text-green-300 font-medium">{startInfo.code}</p>
                  </div>
                </div>

                {/* Center Animation - Enhanced */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-400 animate-pulse" />
                    <div className="relative">
                      <Plane className="w-12 h-12 text-cyan-400 animate-pulse drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                      {/* Glowing circle behind plane */}
                      <div className="absolute inset-0 -z-10 animate-spin" style={{ animationDuration: '3s' }}>
                        <div className="w-16 h-16 -mt-2 -ml-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl" />
                      </div>
                    </div>
                    <div className="w-32 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-400 to-transparent animate-pulse" />
                  </div>
                  {/* Distance indicator */}
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 backdrop-blur-sm rounded-full border border-cyan-400/30">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-xs text-cyan-400 font-medium">12,847 km</span>
                  </div>
                </div>

                {/* Arrival Side - Enhanced with Country Map */}
                <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="relative inline-block">
                    <div className="w-24 h-16 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(244,63,94,0.5)] border-2 border-rose-400/50">
                      <img src={endInfo.mapUrl} alt={endInfo.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Pulsing rings around map */}
                    <div className="absolute inset-0 animate-ping opacity-20" style={{ animationDelay: '1s' }}>
                      <div className="w-full h-full rounded-lg bg-rose-400/50" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                      {endInfo.name}
                    </p>
                    <p className="text-sm text-rose-300 font-medium">{endInfo.code}</p>
                  </div>
                </div>
              </div>

              {/* Title with enhanced styling */}
              <div className="relative">
                <h2 className="text-5xl md:text-6xl font-light bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                  Your Dream Journey
                </h2>
                {/* Decorative lines */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              </div>
            </div>

            {/* Animated flight path - CURVED ARC */}
            <div className="relative h-48 flex items-center px-8">
              {/* Background glow effect */}
              <div className="absolute inset-0 flex items-center pointer-events-none">
                <div className="w-full h-32 bg-gradient-to-r from-green-500/5 via-cyan-500/10 to-rose-500/5 blur-2xl" />
              </div>

              {/* SVG Curved Path */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                <defs>
                  {/* Gradient for the path */}
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
                    <stop offset="50%" stopColor="rgba(34, 211, 238, 0.8)" />
                    <stop offset="100%" stopColor="rgba(168, 85, 247, 0.6)" />
                  </linearGradient>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(34, 211, 238, 1)" />
                    <stop offset="50%" stopColor="rgba(59, 130, 246, 1)" />
                    <stop offset="100%" stopColor="rgba(34, 211, 238, 1)" />
                  </linearGradient>
                </defs>

                {/* Base curved path with blur effect */}
                <path
                  d={`M 0 100 Q 250 ${100 - 60} 500 ${100 - 80} T 1000 100`}
                  stroke="url(#pathGradient)"
                  strokeWidth="6"
                  fill="none"
                  opacity="0.4"
                  filter="blur(2px)"
                />

                {/* Sharp curved path */}
                <path
                  d={`M 0 100 Q 250 ${100 - 60} 500 ${100 - 80} T 1000 100`}
                  stroke="url(#pathGradient)"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.6"
                />

                {/* Progress path - animated */}
                <path
                  d={`M 0 100 Q 250 ${100 - 60} 500 ${100 - 80} T 1000 100`}
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 - (planeProgress * 1000)}
                  className="transition-all duration-100"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))' }}
                />
              </svg>

              {/* Departure marker - Enhanced with Country Map */}
              <div className="absolute left-0 z-10">
                <div className="relative">
                  {/* Outer pulsing ring */}
                  <div className="absolute inset-0 -m-4 animate-ping opacity-30">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400/50 to-emerald-500/50" />
                  </div>

                  {/* Main marker with country map */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] border-4 border-green-300/30 p-1">
                    <div className="w-16 h-12 rounded-md overflow-hidden">
                      <img src={startInfo.mapUrl} alt={startInfo.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Animated pulse rings */}
                  <div className="absolute inset-0 animate-ping opacity-20" style={{ animationDuration: '2s' }}>
                    <div className="w-20 h-20 rounded-full border-2 border-green-400" />
                  </div>
                </div>

                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/40">
                      <p className="text-green-400 text-xs font-bold tracking-wider">DEPARTURE</p>
                    </div>
                    <p className="text-xs text-green-300">{startInfo.code}</p>
                  </div>
                </div>
              </div>

              {/* Arrival marker - Enhanced with Country Map */}
              <div className="absolute right-0 z-10">
                <div className="relative">
                  {/* Outer pulsing ring */}
                  <div className="absolute inset-0 -m-4 animate-ping opacity-30" style={{ animationDelay: '0.5s' }}>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400/50 to-pink-500/50" />
                  </div>

                  {/* Main marker with country map */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.6)] border-4 border-rose-300/30 p-1">
                    <div className="w-16 h-12 rounded-md overflow-hidden">
                      <img src={endInfo.mapUrl} alt={endInfo.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Animated pulse rings */}
                  <div className="absolute inset-0 animate-ping opacity-20" style={{ animationDuration: '2s', animationDelay: '1s' }}>
                    <div className="w-20 h-20 rounded-full border-2 border-rose-400" />
                  </div>
                </div>

                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-3 py-1 bg-rose-500/20 backdrop-blur-sm rounded-full border border-rose-400/40">
                      <p className="text-rose-400 text-xs font-bold tracking-wider">ARRIVAL</p>
                    </div>
                    <p className="text-xs text-rose-300">{endInfo.code}</p>
                  </div>
                </div>
              </div>

              {/* Animated plane - PROJECTILE MOTION */}
              <div
                className="absolute z-20 transition-all duration-100 ease-linear"
                style={{
                  left: `calc(${planeProgress * 100}% - 2.5rem)`,
                  // Projectile motion: parabolic arc (higher peak in middle)
                  top: `calc(50% - ${Math.sin(planeProgress * Math.PI) * 80 * (1 - Math.abs(planeProgress - 0.5) * 0.5)}px)`
                }}
              >
                <div className="relative">
                  {/* Outer glow sphere */}
                  <div className="absolute inset-0 -m-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-radial from-cyan-400/30 via-blue-400/10 to-transparent animate-pulse" />
                  </div>

                  {/* Multiple pulsing rings */}
                  <div className="absolute inset-0 -m-4 animate-ping opacity-30">
                    <div className="w-24 h-24 rounded-full bg-cyan-400/40" />
                  </div>
                  <div className="absolute inset-0 -m-6 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}>
                    <div className="w-28 h-28 rounded-full bg-blue-400/30" />
                  </div>

                  {/* Plane icon with enhanced glow and dynamic rotation */}
                  <div className="relative">
                    <Plane
                      className="w-20 h-20 text-white drop-shadow-[0_0_25px_rgba(0,212,255,1)] transition-transform duration-300"
                      fill="currentColor"
                      style={{ transform: `rotate(${getPlaneRotation(planeProgress)}deg)` }}
                    />

                    {/* Rotating glow behind plane */}
                    <div className="absolute inset-0 -z-10 animate-spin" style={{ animationDuration: '2s' }}>
                      <div className="w-20 h-20 bg-gradient-to-r from-cyan-400/40 via-transparent to-blue-500/40 rounded-full blur-xl" />
                    </div>

                    {/* Secondary pulse */}
                    <div className="absolute inset-0 animate-ping opacity-50" style={{ animationDuration: '1.5s' }}>
                      <Plane className="w-20 h-20 text-cyan-400" />
                    </div>
                  </div>

                  {/* Enhanced contrail effect with multiple layers */}
                  <div className="absolute top-1/2 right-full">
                    <div className="w-32 h-1 bg-gradient-to-l from-white/80 via-cyan-400/60 to-transparent blur-sm" />
                    <div className="w-40 h-2 -mt-1 bg-gradient-to-l from-white/40 via-cyan-400/30 to-transparent blur-md" />
                    <div className="w-48 h-3 -mt-2 bg-gradient-to-l from-white/20 via-cyan-400/10 to-transparent blur-lg" />
                  </div>

                  {/* Speed lines */}
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 right-full animate-pulse"
                      style={{
                        marginTop: `${(i - 1) * 8}px`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '0.8s'
                      }}
                    >
                      <div className={`w-${16 + i * 8} h-0.5 bg-gradient-to-l from-cyan-400/60 to-transparent`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced flight status */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-full border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <div className="relative">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  </div>
                </div>
                <span className="text-cyan-400 text-sm font-medium">✈️ In Flight</span>
                <div className="h-4 w-px bg-cyan-400/30" />
                <span className="text-white/60 text-xs">Cruising at dream speed</span>
              </div>

              {/* Progress percentage */}
              <p className="text-white/40 text-xs font-mono">
                {Math.round(planeProgress * 100)}% complete
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black/60" />
    </div>
  );
};

export default FlightTransition;
