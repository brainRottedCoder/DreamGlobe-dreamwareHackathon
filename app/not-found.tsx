'use client';

import React from 'react';
import Link from 'next/link';
import { Moon, CloudOff } from 'lucide-react';
import DreamyParticles from './components/DreamyParticles';

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27] flex items-center justify-center px-4">
            {/* Dreamy Particles Background */}
            <DreamyParticles />

            {/* Background ambient glow */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
                {/* Glitchy 404 Text */}
                <div className="relative inline-block">
                    <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 text-9xl font-bold text-white/10 blur-sm animate-pulse delay-75" aria-hidden="true">
                        404
                    </div>
                </div>

                {/* Surreal Message */}
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <CloudOff className="w-16 h-16 text-blue-300/50" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">
                        Dream Fragment Not Found
                    </h2>
                    <p className="text-lg text-blue-200/60 max-w-lg mx-auto leading-relaxed">
                        You&apos;ve wandered to the edge of the dreamscape. This memory doesn&apos;t exist, or perhaps it has faded into the waking world.
                    </p>
                </div>

                {/* Return Button */}
                <div className="pt-8 animate-fade-in delay-200">
                    <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />

                        <span className="relative flex items-center space-x-3 text-white">
                            <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span>Return to the Dream</span>
                        </span>
                    </Link>
                </div>
            </div>

            {/* Footer Quote */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white/20 text-sm font-light italic">
                    &quot;Not all those who wander are lost, but some dreams are elusive&quot;
                </p>
            </div>
        </div>
    );
}
