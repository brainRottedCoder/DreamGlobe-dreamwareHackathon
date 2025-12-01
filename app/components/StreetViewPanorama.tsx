'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StreetViewCoords {
  lat: number;
  lng: number;
  heading?: number;
  pitch?: number;
  zoom?: number;
  fallbackCoords?: Array<{ lat: number; lng: number }>; // Backup locations within 1km
}

interface StreetViewPanoramaProps {
  coords: StreetViewCoords;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

// Declare google maps types
declare global {
  interface Window {
    google?: any;
    initGoogleMaps?: () => void;
  }
}

const StreetViewPanorama: React.FC<StreetViewPanoramaProps> = ({
  coords,
  className = 'w-full h-full',
  onLoad,
  onError,
}) => {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const panoramaInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps API and create panorama (once)
  useEffect(() => {
    const initStreetView = async () => {
      try {
        console.log('Initializing Street View...');
        setIsLoading(true);
        setError(null);

        // Get API key from environment
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          throw new Error('Google Maps API key not found. Please check your .env.local file.');
        }

        if (!panoramaRef.current) {
          throw new Error('Panorama container not found');
        }

        // Load Google Maps script dynamically if not already loaded
        if (!window.google?.maps) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
              console.log('Google Maps API loaded successfully');
              resolve();
            };
            script.onerror = () => {
              reject(new Error('Failed to load Google Maps script'));
            };

            // Check if script already exists
            const existingScript = document.querySelector(
              `script[src^="https://maps.googleapis.com/maps/api/js"]`
            );
            if (existingScript) {
              console.log('Google Maps API already loaded');
              resolve();
            } else {
              document.head.appendChild(script);
            }
          });
        }

        // Wait a bit to ensure google.maps is fully initialized
        await new Promise(resolve => setTimeout(resolve, 200));

        if (!window.google?.maps) {
          throw new Error('Google Maps API failed to initialize');
        }

        // Create Street View panorama (only once)
        if (!panoramaInstanceRef.current && panoramaRef.current) {
          console.log('Creating new Street View panorama instance');
          panoramaInstanceRef.current = new window.google.maps.StreetViewPanorama(
            panoramaRef.current,
            {
              position: { lat: coords.lat, lng: coords.lng },
              pov: {
                heading: coords.heading || 0,
                pitch: coords.pitch || 0,
              },
              zoom: coords.zoom || 1,
              addressControl: false,
              linksControl: true,
              panControl: true,
              enableCloseButton: false,
              showRoadLabels: false,
              motionTracking: true,
              motionTrackingControl: true,
            }
          );

          // Try to find Street View with fallback mechanism
          const tryStreetViewWithFallback = async () => {
            const streetViewService = new window.google.maps.StreetViewService();

            // Try primary location first (within 1km radius)
            const tryLocation = (location: { lat: number; lng: number }, radius: number = 1000): Promise<any> => {
              return new Promise((resolve, reject) => {
                streetViewService.getPanorama(
                  { location, radius },
                  (data: any, status: any) => {
                    if (status === window.google.maps.StreetViewStatus.OK) {
                      resolve(data);
                    } else {
                      reject(status);
                    }
                  }
                );
              });
            };

            try {
              // Try primary coordinates
              const data = await tryLocation({ lat: coords.lat, lng: coords.lng });
              console.log('Street View available at primary location:', data.location.latLng.toString());
              setIsLoading(false);
              onLoad?.();
            } catch (primaryError) {
              console.warn('Primary location failed, trying fallbacks...');

              // Try fallback coordinates if available
              if (coords.fallbackCoords && coords.fallbackCoords.length > 0) {
                for (const fallback of coords.fallbackCoords) {
                  try {
                    const data = await tryLocation(fallback);
                    console.log('Street View available at fallback location:', data.location.latLng.toString());
                    panoramaInstanceRef.current.setPosition(data.location.latLng);
                    setIsLoading(false);
                    onLoad?.();
                    return; // Success, exit
                  } catch (fallbackError) {
                    console.warn(`Fallback at ${fallback.lat}, ${fallback.lng} failed`);
                  }
                }
              }

              // All attempts failed
              const errorMsg = `Street View not available at this location or nearby fallbacks (within 1km)`;
              console.error(errorMsg);
              setError(errorMsg);
              setIsLoading(false);
              onError?.(errorMsg);
            }
          };

          tryStreetViewWithFallback();
        }

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load Street View';
        setError(errorMsg);
        setIsLoading(false);
        onError?.(errorMsg);
        console.error('Street View error:', err);
      }
    };

    initStreetView();

    // Cleanup on unmount
    return () => {
      panoramaInstanceRef.current = null;
    };
  }, []);

  // Update panorama position when coords change
  useEffect(() => {
    if (panoramaInstanceRef.current && window.google?.maps) {
      console.log('Updating Street View to:', coords.lat, coords.lng);
      setIsLoading(true);
      setError(null);

      // Try to find Street View at new location with fallback
      const tryNewLocationWithFallback = async () => {
        const streetViewService = new window.google.maps.StreetViewService();

        const tryLocation = (location: { lat: number; lng: number }, radius: number = 1000): Promise<any> => {
          return new Promise((resolve, reject) => {
            streetViewService.getPanorama(
              { location, radius },
              (data: any, status: any) => {
                if (status === window.google.maps.StreetViewStatus.OK) {
                  resolve(data);
                } else {
                  reject(status);
                }
              }
            );
          });
        };

        try {
          // Try primary coordinates
          const data = await tryLocation({ lat: coords.lat, lng: coords.lng });
          console.log('Street View available at new location:', data.location.latLng.toString());

          panoramaInstanceRef.current.setPosition(data.location.latLng);
          panoramaInstanceRef.current.setPov({
            heading: coords.heading || 0,
            pitch: coords.pitch || 0,
          });
          panoramaInstanceRef.current.setZoom(coords.zoom || 1);

          setIsLoading(false);
          onLoad?.();
        } catch (primaryError) {
          // Try fallbacks
          if (coords.fallbackCoords && coords.fallbackCoords.length > 0) {
            for (const fallback of coords.fallbackCoords) {
              try {
                const data = await tryLocation(fallback);
                console.log('Using fallback location:', data.location.latLng.toString());

                panoramaInstanceRef.current.setPosition(data.location.latLng);
                panoramaInstanceRef.current.setPov({
                  heading: coords.heading || 0,
                  pitch: coords.pitch || 0,
                });
                panoramaInstanceRef.current.setZoom(coords.zoom || 1);

                setIsLoading(false);
                onLoad?.();
                return;
              } catch (fallbackError) {
                continue;
              }
            }
          }

          const errorMsg = `Street View not available at this location or nearby (within 1km)`;
          setError(errorMsg);
          setIsLoading(false);
          onError?.(errorMsg);
        }
      };

      tryNewLocationWithFallback();
    }
  }, [coords.lat, coords.lng, coords.heading, coords.pitch, coords.zoom]);

  return (
    <div className={`relative ${className}`}>
      {/* Street View Container */}
      <div ref={panoramaRef} className="w-full h-full" />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
          <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-white text-lg">Loading Street View...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10">
          <div className="text-center space-y-4 max-w-md px-6">
            <div className="text-6xl">⚠️</div>
            <h3 className="text-xl font-bold text-white">Street View Unavailable</h3>
            <p className="text-white/80">{error}</p>
            <p className="text-sm text-white/60">
              Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </p>
            <div className="mt-4 text-xs text-white/50">
              <p>Possible reasons:</p>
              <ul className="list-disc list-inside mt-2">
                <li>No Street View imagery available at this exact location</li>
                <li>Try adjusting coordinates slightly</li>
                <li>Check API key restrictions</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreetViewPanorama;
