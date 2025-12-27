'use client';

import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  gradient?: CanvasGradient;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  top: number;
  left: number;
  delay: number;
}

const SHOOTING_STARS: ShootingStar[] = Array.from({ length: 3 }).map((_, i) => ({
  top: Math.random() * 50,
  left: Math.random() * 100,
  delay: i * 3,
}));

const DreamyParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initialize stars
    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < 100; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const colors = ['#60A5FA', '#A78BFA', '#F472B6', '#FBBF24', '#34D399'];

      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.5 + 0.2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Create cached gradient for this particle
        // We create it at (0,0) and will translate the context to draw it
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3);
        const alphaHex = Math.floor(opacity * 255).toString(16).padStart(2, '0');
        gradient.addColorStop(0, `${color}${alphaHex}`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size,
          opacity,
          color,
          gradient,
        });
      }
    };

    initStars();
    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkling effect
      starsRef.current.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Draw and update particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Optimization: Use cached gradient and context translation
        // This avoids creating new RadialGradient objects and parsing color strings every frame
        ctx.save();
        ctx.translate(particle.x, particle.y);

        // Draw particle with glow effect using cached gradient
        if (particle.gradient) {
            ctx.fillStyle = particle.gradient;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw core particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Canvas for particles and stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Floating globe in center with dream effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative animate-float" style={{ animationDuration: '20s' }}>
          {/* Outer glow rings */}
          <div className="absolute inset-0 animate-ping opacity-10" style={{ animationDuration: '3s' }}>
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
          </div>
          <div className="absolute inset-0 animate-ping opacity-10" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-400 to-pink-600"></div>
          </div>

          {/* Main globe */}
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-1 shadow-2xl shadow-purple-500/50">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27] flex items-center justify-center overflow-hidden">
              {/* Globe icon with sparkle effect */}
              <Sparkles className="w-32 h-32 text-blue-300 animate-pulse relative z-10" />

              {/* Rotating rings inside globe */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent transform -translate-y-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-purple-400/50 to-transparent transform -translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cosmic nebula effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>

      {/* Shooting stars */}
      {SHOOTING_STARS.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: '3s',
          }}
        >
          <div className="absolute inset-0 w-20 h-0.5 bg-gradient-to-r from-white to-transparent transform -translate-x-1"></div>
        </div>
      ))}
    </div>
  );
};

export default DreamyParticles;
