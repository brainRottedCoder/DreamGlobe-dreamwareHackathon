"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Play } from 'lucide-react';
import { getMusicManager } from '@/lib/utils/musicManager';

const SplineScene = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

const HeroSectionPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create stars
    const stars: Array<{x: number, y: number, size: number, opacity: number, twinkleSpeed: number}> = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Create floating particles
    const particles: Array<{x: number, y: number, vx: number, vy: number, size: number, opacity: number, color: string}> = [];
    const colors = ['#60A5FA', '#A78BFA', '#F472B6', '#FBBF24', '#34D399', '#818CF8'];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationFrameId: number;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`;
        ctx.fill();

        // Add star glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw floating particles with glow
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStartJourney = () => {
    // Start journey music when user clicks "Start Your Journey"
    const musicManager = getMusicManager();
    musicManager.playJourneyMusic();
    console.log('🎵 Journey music started from hero section');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030617] text-white">
      {/* Dreamy star particles background */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      {/* Corner and edge glows */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {/* Top-left corner glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-blue-500/30 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />

        {/* Top-right corner glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-purple-500/30 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

        {/* Bottom-left corner glow */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-pink-500/30 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

        {/* Bottom-right corner glow */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-cyan-500/30 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />

        {/* Side glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-[600px] bg-linear-to-r from-indigo-500/20 to-transparent blur-2xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-[600px] bg-linear-to-l from-violet-500/20 to-transparent blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1.5s' }} />
      </div>

      {/* 3D background */}
      <div className="absolute inset-0 z-[2]">
        <SplineScene scene="https://prod.spline.design/56U995sNopkn6fWe/scene.splinecode" className="h-full w-full" />
      </div>

      {/* Overlay to ensure readability */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-linear-to-b from-black/70 via-[#050b24]/50 to-transparent" />

      {/* Content */}
      <div className="pointer-events-none relative z-[20] flex min-h-screen flex-col items-center justify-end px-4 sm:px-6 pb-16 sm:pb-20 pt-24 sm:pt-32 text-center">
        <div className="space-y-6 max-w-3xl w-full">
          <div className="pointer-events-auto flex flex-col items-center justify-center gap-4 sm:gap-6 sm:flex-row">
            <Link
              href="/dreamForm"
              onClick={handleStartJourney}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3 text-base sm:px-10 sm:py-4 sm:text-lg font-semibold"
              aria-label="Start your dream journey"
            >
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-500 via-purple-600 to-pink-500 transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 bg-linear-to-r from-blue-400 via-purple-500 to-pink-400" />
              <span className="relative flex items-center space-x-2 sm:space-x-3">
                <Play
                  className={`h-6 w-6 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                  fill="white"
                />
                <span>Start Your Journey</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionPage;