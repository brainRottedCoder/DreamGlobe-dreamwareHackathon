'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, MapPin } from 'lucide-react';
import { COUNTRIES, Country } from '@/lib/data/destinations';
import EyeTransition from '../components/EyeTransition';

const NextCountryPage = () => {
  const router = useRouter();
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [remainingCountries, setRemainingCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showEyeTransition, setShowEyeTransition] = useState(false);

  useEffect(() => {
    // Get visited countries from localStorage
    const visited = localStorage.getItem('visitedCountries');
    const visitedList = visited ? JSON.parse(visited) : [];
    setVisitedCountries(visitedList);

    // Filter out visited countries
    const remaining = COUNTRIES.filter(country => !visitedList.includes(country.id));
    setRemainingCountries(remaining);

    // If no countries left, go to journey summary
    if (remaining.length === 0) {
      router.push('/');
    }
  }, [router]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country.id);
    setShowEyeTransition(true);

    // After eye transition, navigate to plane scene with country
    setTimeout(() => {
      // Store selected country in localStorage
      localStorage.setItem('selectedCountry', country.name);

      // Get current country (where we're departing from)
      const currentCountry = localStorage.getItem('currentCountry') || 'India';

      // Navigate to plane with departure and arrival
      router.push(`/plane?departure=${encodeURIComponent(currentCountry)}&destination=${encodeURIComponent(country.name)}`);
    }, 1500);
  };

  const getCountryTeaser = (countryId: string): string => {
    const teasers: { [key: string]: string } = {
      'india': 'Explore the majestic Taj Mahal, historic Red Fort, and towering Qutub Minar',
      'usa': 'Discover the iconic Statue of Liberty, vibrant Times Square, and world-class Metropolitan Museum',
      'france': 'Experience the romantic Eiffel Tower, magnificent Fontainebleau, and stunning Chambord',
      'russia': 'Visit the historic Red Square, grand Hermitage Museum, and iconic Peter and Paul Fortress',
      'uk': 'Discover breathtaking Snowdonia, royal Buckingham Palace, and ancient city of Bath'
    };
    return teasers[countryId] || 'Embark on an unforgettable journey';
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 overflow-hidden">
      {/* Eye Transition */}
      {showEyeTransition && (
        <EyeTransition
          isClosing={true}
          onTransitionComplete={() => {}}
        />
      )}

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 sm:py-12 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-5 sm:space-y-6 animate-fade-in">
          <div className="text-4xl sm:text-6xl md:text-7xl mb-3 sm:mb-4">✈️</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Choose Your Next Adventure
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-white/80 max-w-2xl mx-auto">
            Where would you like to explore next?
          </p>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-blue-200">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base lg:text-lg">
              {visitedCountries.length} {visitedCountries.length === 1 ? 'country' : 'countries'} visited • {remainingCountries.length} remaining
            </span>
          </div>
        </div>

        {/* Country Cards Grid */}
        <div className="flex-1 flex items-stretch justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl w-full">
            {remainingCountries.map((country, index) => (
              <button
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-blue-500/50"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500 pointer-events-none"></div>

                {/* Country Flag */}
                <div className="text-5xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  {country.emoji}
                </div>

                {/* Country Info */}
                <div className="space-y-4 text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {country.name}
                  </h2>

                  {/* Airport Info */}
                  <div className="flex items-start space-x-2 text-blue-200/80">
                    <Plane className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" />
                    <p className="text-xs sm:text-sm">
                      {country.airport.name}
                    </p>
                  </div>

                  {/* Destinations Count */}
                  <div className="flex items-center space-x-2 text-purple-200/80">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm">
                      {country.destinations.length} iconic destinations
                    </p>
                  </div>

                  {/* Teaser Text */}
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {getCountryTeaser(country.id)}
                  </p>

                  {/* CTA */}
                  <div className="pt-4 flex items-center justify-between gap-3">
                    <span className="text-sm sm:text-base text-blue-300 font-semibold group-hover:text-blue-200 transition-colors">
                      Explore Now →
                    </span>
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer - Option to End Journey */}
        <div className="text-center mt-12 space-y-4">
          <button
            onClick={() => router.push('/')}
            className="text-white/60 hover:text-white transition-colors text-sm flex items-center justify-center mx-auto space-x-2 px-6 py-3 rounded-full hover:bg-white/10"
          >
            <span>End Journey & Go Home</span>
          </button>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default NextCountryPage;
