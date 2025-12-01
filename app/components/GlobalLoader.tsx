'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import DreamyParticles from './DreamyParticles';

export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-linear-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27] flex items-center justify-center z-50">
            <DreamyParticles />

            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
                <div className="relative inline-block">
                    <div className="absolute inset-0 animate-ping opacity-20">
                        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                        Dream Globe
                    </h2>

                    <div className="flex items-center justify-center space-x-3 text-blue-200/80">
                        <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                        <span className="text-lg tracking-wider font-light animate-pulse">
                            Materializing Dreamscape...
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
