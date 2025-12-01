'use client';

import React, { memo } from 'react';

interface EyeTransitionProps {
  isClosing: boolean;
  onTransitionComplete?: () => void;
}

const EyeTransition: React.FC<EyeTransitionProps> = memo(({ isClosing, onTransitionComplete }) => {
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // Only call onTransitionComplete on the first eyelid to prevent double calls
    if (e.currentTarget === e.target && onTransitionComplete) {
      onTransitionComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Top eyelid */}
      <div
        className={`absolute top-0 left-0 right-0 bg-black transition-all duration-600 ease-in-out ${
          isClosing ? 'h-1/2' : 'h-0'
        }`}
        style={{
          clipPath: isClosing
            ? 'ellipse(100% 100% at 50% 0%)'
            : 'ellipse(100% 0% at 50% 0%)',
          willChange: 'height, clip-path'
        }}
        onTransitionEnd={handleTransitionEnd}
      />

      {/* Bottom eyelid */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-black transition-all duration-600 ease-in-out ${
          isClosing ? 'h-1/2' : 'h-0'
        }`}
        style={{
          clipPath: isClosing
            ? 'ellipse(100% 100% at 50% 100%)'
            : 'ellipse(100% 0% at 50% 100%)',
          willChange: 'height, clip-path'
        }}
      />

      {/* Eyelashes effect - top - Hidden for smooth transition */}
      {isClosing && (
        <div className="absolute top-0 left-0 right-0 h-1/2 transition-opacity duration-500 opacity-0">
          {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`top-${i}`}
            className="absolute w-0.5 bg-gradient-to-b from-black/80 to-transparent"
            style={{
              left: `${3 + i * 3.2}%`,
              top: '50%',
              height: '40px',
              transform: `translateY(-50%) rotate(${-20 + i * 1.5}deg)`,
              transformOrigin: 'top center',
            }}
          />
          ))}
        </div>
      )}

      {/* Eyelashes effect - bottom - Hidden for smooth transition */}
      {isClosing && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 transition-opacity duration-500 opacity-0">
          {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`bottom-${i}`}
            className="absolute w-0.5 bg-gradient-to-t from-black/80 to-transparent"
            style={{
              left: `${3 + i * 3.2}%`,
              bottom: '50%',
              height: '40px',
              transform: `translateY(50%) rotate(${20 - i * 1.5}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
          ))}
        </div>
      )}
    </div>
  );
});

EyeTransition.displayName = 'EyeTransition';

export default EyeTransition;
