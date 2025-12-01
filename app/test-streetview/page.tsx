'use client';

import React, { useState } from 'react';
import StreetViewPanorama from '../components/StreetViewPanorama';
import { COUNTRIES } from '@/lib/data/destinations';

const TestStreetViewPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<'airport' | 'destination'>('destination');
  const [selectedCountry, setSelectedCountry] = useState(0); // India by default
  const [selectedDestination, setSelectedDestination] = useState(0);

  const country = COUNTRIES[selectedCountry];
  const location = selectedLocation === 'airport'
    ? country.airport.streetViewCoords
    : country.destinations[selectedDestination].streetViewCoords;

  const locationName = selectedLocation === 'airport'
    ? country.airport.name
    : country.destinations[selectedDestination].name;

  return (
    <div className="min-h-screen bg-linear-gradient-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27] text-white">
      {/* Header */}
      <div className="p-6 bg-black/30 backdrop-blur-md border-b border-white/10">
        <h1 className="text-3xl font-bold mb-2">🗺️ Google Street View Test</h1>
        <p className="text-white/70">Testing API integration with our destination data</p>
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4 bg-black/20">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Country:</label>
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(Number(e.target.value));
              setSelectedDestination(0);
            }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white w-full max-w-md"
          >
            {COUNTRIES.map((country, index) => (
              <option key={country.id} value={index} className="bg-[#1a1535] text-white">
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Location Type:</label>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedLocation('airport')}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedLocation === 'airport'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ✈️ Airport
            </button>
            <button
              onClick={() => setSelectedLocation('destination')}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedLocation === 'destination'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🏛️ Destination
            </button>
          </div>
        </div>

        {/* Destination Selection (if destination type is selected) */}
        {selectedLocation === 'destination' && (
          <div>
            <label className="block text-sm font-medium mb-2">Select Destination:</label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(Number(e.target.value))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white w-full max-w-md"
            >
              {country.destinations.map((dest, index) => (
                <option key={dest.id} value={index} className="bg-[#1a1535] text-white">
                  {dest.name} ({dest.city})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Current Location Info */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="font-semibold text-lg mb-2">{locationName}</h3>
          <div className="text-sm text-white/70 space-y-1">
            <p>📍 Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
            {location.heading !== undefined && <p>🧭 Heading: {location.heading}°</p>}
            {location.pitch !== undefined && <p>📐 Pitch: {location.pitch}°</p>}
            {location.zoom !== undefined && <p>🔍 Zoom: {location.zoom}</p>}
          </div>
        </div>
      </div>

      {/* Street View Display */}
      <div className="p-6">
        <div className="w-full h-[600px] rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
          <StreetViewPanorama
            coords={location}
            onLoad={() => console.log('Street View loaded successfully!')}
            onError={(error) => console.error('Street View error:', error)}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-300 mb-2">✨ How to Use:</h4>
          <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
            <li>Select a country from the dropdown</li>
            <li>Choose between Airport or Destination view</li>
            <li>If Destination is selected, pick which landmark to view</li>
            <li>Use mouse/touch to navigate the 360° Street View</li>
            <li>Check console for load/error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestStreetViewPage;
