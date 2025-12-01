'use client';

import { useState, useEffect, useCallback } from 'react';
import { Camera, Download, X, Loader2 } from 'lucide-react';
import { compositePhoto } from '@/lib/utils/photoComposite';
import { getPhotoBackgrounds, type PhotoBackground } from '@/lib/data/photoBackgrounds';

interface PhotoGalleryProps {
  /** Destination ID to get backgrounds */
  destinationId: string;
  /** Destination name for display */
  destinationName: string;
}

interface CompositeResult {
  id: string;
  url: string;
  blob: Blob;
  variant: number;
  position: string;
}

type ProcessingStage = 'idle' | 'loading-selfie' | 'removing-bg' | 'compositing' | 'complete';

type PositionType = 'bottom-left' | 'bottom-right';

export default function PhotoGallery({
  destinationId,
  destinationName,
}: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState<CompositeResult | null>(null);
  const [photoHistory, setPhotoHistory] = useState<CompositeResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<CompositeResult | null>(null);
  const [selfieImageCache, setSelfieImageCache] = useState<HTMLImageElement | null>(null);
  const [lastUsedVariant, setLastUsedVariant] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<PositionType>('bottom-left');

  // Get the 3 backgrounds for this destination
  const backgrounds = getPhotoBackgrounds(destinationId);

  // Generate one random photo with corner positioning
  const generatePhoto = useCallback(async () => {
    try {
      setError(null);
      setProgress(0);

      // Get stored data from localStorage
      const dreamData = localStorage.getItem('dreamData');
      if (!dreamData) {
        throw new Error('No user data found. Please complete the form first.');
      }

      const data = JSON.parse(dreamData);
      const hasUserPhoto = data.hasPhoto && data.selfieBase64;

      // Pick random background from the 3 available, excluding the last used one
      let availableBackgrounds = backgrounds;
      if (lastUsedVariant !== null && backgrounds.length > 1) {
        // Filter out the last used background to avoid repetition
        availableBackgrounds = backgrounds.filter(bg => bg.variant !== lastUsedVariant);
      }
      const randomBackground = availableBackgrounds[Math.floor(Math.random() * availableBackgrounds.length)];

      if (!hasUserPhoto) {
        // No user photo - just show the background image
        setStage('loading-selfie');
        setProgress(50);

        // Dynamically import the loadImage function
        const { loadImage } = await import('@/lib/utils/backgroundRemoval');

        // Load background image
        const backgroundImage = await loadImage(randomBackground.path);

        // Convert to blob for download
        const canvas = document.createElement('canvas');
        canvas.width = backgroundImage.width;
        canvas.height = backgroundImage.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(backgroundImage, 0, 0);

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/webp', 0.95);
        });

        const url = URL.createObjectURL(blob);

        const result: CompositeResult = {
          id: `${randomBackground.id}-${Date.now()}`,
          url,
          blob,
          variant: randomBackground.variant,
          position: 'background-only',
        };

        setCurrentPhoto(result);
        setPhotoHistory(prev => [result, ...prev]);
        setLastUsedVariant(randomBackground.variant); // Track the variant used
        setProgress(100);
        setStage('complete');
        return;
      }

      // User has a photo - create composite
      let selfieImage = selfieImageCache;

      // Load the already-processed selfie (background removed at form page)
      if (!selfieImage) {
        setStage('loading-selfie');

        const selfieBase64 = data.selfieBase64;
        setProgress(30);

        // Dynamically import the loadImage function
        const { loadImage } = await import('@/lib/utils/backgroundRemoval');

        // Load the image directly (background already removed!)
        selfieImage = await loadImage(selfieBase64);
        setSelfieImageCache(selfieImage);

        setProgress(70);
      } else {
        // Using cached selfie
        setProgress(70);
      }

      setProgress(80);
      setStage('compositing');

      // Use selected position
      const position = selectedPosition;

      // Dynamically import the loadImage function
      const { loadImage: loadImageFn } = await import('@/lib/utils/backgroundRemoval');

      // Load background image
      const backgroundImage = await loadImageFn(randomBackground.path);

      // Create composite with selected position
      const compositeBlob = await compositePhoto(selfieImage, backgroundImage, {
        scale: 0.9, // Much larger size - 90% of image height
        position: position,
      });

      // Create preview URL
      const url = URL.createObjectURL(compositeBlob);

      const result: CompositeResult = {
        id: `${randomBackground.id}-${Date.now()}`,
        url,
        blob: compositeBlob,
        variant: randomBackground.variant,
        position: position,
      };

      setCurrentPhoto(result);
      setPhotoHistory(prev => [result, ...prev]); // Add to history
      setLastUsedVariant(randomBackground.variant); // Track the variant used
      setProgress(100);
      setStage('complete');
    } catch (err) {
      console.error('Photo processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process photo. Please try again.');
      setStage('idle');
    }
  }, [backgrounds, selfieImageCache, lastUsedVariant, selectedPosition]);

  // Auto-generate first photo when modal opens
  useEffect(() => {
    if (isOpen && stage === 'idle' && !currentPhoto) {
      generatePhoto();
    }
  }, [isOpen, stage, currentPhoto, generatePhoto]);

  // Download a photo
  const downloadPhoto = useCallback((result: CompositeResult) => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `dream-globe-${destinationId}-variant-${result.variant}-${Date.now()}.webp`;
    a.click();
  }, [destinationId]);

  // Close modal
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Don't reset state so photos are cached
  }, []);

  // Open modal
  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (currentPhoto) URL.revokeObjectURL(currentPhoto.url);
      photoHistory.forEach(result => URL.revokeObjectURL(result.url));
    };
  }, [currentPhoto, photoHistory]);

  // Don't show button if no backgrounds available
  if (backgrounds.length === 0) {
    return null;
  }

  return (
    <>
      {/* Trigger Button - Compact */}
      <button
        onClick={handleOpen}
        className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                   text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105
                   shadow-lg hover:shadow-xl flex items-center gap-1.5 whitespace-nowrap"
      >
        <Camera className="w-3 h-3" />
        <span className="text-xs">Photos</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-7xl bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900
                          rounded-2xl shadow-2xl overflow-hidden border border-purple-500/30 my-4 max-h-[90vh] flex flex-col">

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full
                         text-white transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="px-5 py-4 sm:px-6 sm:py-6 border-b border-purple-500/30 shrink-0">
              <h2 className="text-2xl font-bold text-white">
                {(() => {
                  const dreamData = localStorage.getItem('dreamData');
                  const hasPhoto = dreamData ? JSON.parse(dreamData).hasPhoto : false;
                  return hasPhoto ? 'Your Memories' : 'Destination Views';
                })()}
              </h2>
              <p className="text-gray-300 mt-1">at {destinationName}</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {/* Position Selector - Only show if user has a photo */}
              {(() => {
                const dreamData = localStorage.getItem('dreamData');
                const hasPhoto = dreamData ? JSON.parse(dreamData).hasPhoto : false;
                return hasPhoto && stage === 'complete' && (
                  <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <h3 className="text-white font-semibold mb-3 text-center">Choose Your Position</h3>
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => {
                          setSelectedPosition('bottom-left');
                          setStage('idle');
                          setTimeout(() => generatePhoto(), 100);
                        }}
                        className={`flex flex-col items-center gap-2 px-8 py-4 rounded-xl transition-all ${
                          selectedPosition === 'bottom-left'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 bg-current rounded-full"></div>
                          <div className="w-10 h-5 bg-current/20 rounded"></div>
                        </div>
                        <span className="text-sm font-semibold">Bottom Left</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPosition('bottom-right');
                          setStage('idle');
                          setTimeout(() => generatePhoto(), 100);
                        }}
                        className={`flex flex-col items-center gap-2 px-8 py-4 rounded-xl transition-all ${
                          selectedPosition === 'bottom-right'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-10 h-5 bg-current/20 rounded"></div>
                          <div className="w-5 h-5 bg-current rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold">Bottom Right</span>
                      </button>
                    </div>
                    <p className="text-center text-gray-400 text-sm mt-3">
                      Click a position to regenerate your photo
                    </p>
                  </div>
                );
              })()}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              {/* Processing States */}
              {(stage === 'loading-selfie' || stage === 'removing-bg' || stage === 'compositing') && (
                <div className="flex flex-col items-center gap-6 py-12 px-2">
                  <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />

                  <div className="text-center max-w-lg">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {stage === 'loading-selfie' && 'Loading Photo...'}
                      {stage === 'compositing' && 'Creating Your Memory...'}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {stage === 'loading-selfie' && 'Preparing your destination photo'}
                      {stage === 'compositing' && `Placing you at the ${selectedPosition.replace('-', ' ')}`}
                    </p>
                    {stage === 'compositing' && (
                      <p className="text-sm text-green-300">
                        ⚡ Super fast! Background already removed
                      </p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-md">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-center text-gray-400 mt-2">{progress}%</p>
                  </div>
                </div>
              )}

              {/* Current Photo - Complete State */}
              {stage === 'complete' && currentPhoto && (
                <div className="space-y-6 w-full">
                  {/* Photo Display */}
                  <div className="flex flex-col items-center gap-6">
                    <div
                      className="relative w-full max-w-3xl rounded-xl overflow-hidden border-2 border-purple-500/30 cursor-pointer
                                 hover:border-purple-500/60 transition-all duration-300 shadow-2xl bg-black/40"
                       onClick={() => setSelectedImage(currentPhoto)}
                    >
                      <img
                        src={currentPhoto.url}
                        alt="Your memory"
                        className="w-full h-full object-contain"
                        style={{ maxHeight: '55vh' }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center w-full max-w-xl">
                      <button
                        onClick={() => downloadPhoto(currentPhoto)}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                                   text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
                                   shadow-lg flex items-center gap-3"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download This Photo</span>
                      </button>

                      <div className="flex flex-col gap-3 w-full">
                        <button
                          onClick={() => {
                            setStage('idle');
                            generatePhoto();
                          }}
                          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                                     text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
                                     shadow-lg flex items-center gap-3 justify-center"
                          disabled={stage !== 'complete'}
                        >
                          <Camera className="w-5 h-5" />
                          <span>Generate Another</span>
                        </button>

                        {/* <button
                          onClick={handleClose}
                          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"
                        >
                          Close
                        </button> */}
                      </div>
                    </div>

                    {/* Photo History Count */}
                    {photoHistory.length > 1 && (
                      <p className="text-gray-400 text-sm">
                        You&apos;ve generated {photoHistory.length} photo{photoHistory.length > 1 ? 's' : ''} at {destinationName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lightbox for selected image */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative max-w-6xl max-h-[90vh]">
                <img
                  src={selectedImage.url}
                  alt={`Memory ${selectedImage.variant}`}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Download button in lightbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadPhoto(selectedImage);
                  }}
                  className="absolute bottom-4 right-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                             text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
                             shadow-lg flex items-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
