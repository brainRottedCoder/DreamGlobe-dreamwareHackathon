// 'use client';

// import { useState, useRef, useCallback } from 'react';
// import { Camera, Download, X, Upload, Loader2 } from 'lucide-react';
// import { compositePhoto } from '@/lib/utils/photoComposite';

// interface PhotoCaptureProps {
//   /** Destination ID to map to correct background image */
//   destinationId: string;
//   /** Destination name for display */
//   destinationName: string;
//   /** Path to background image for this destination */
//   backgroundImagePath: string;
// }

// type ProcessingStage = 'idle' | 'capturing' | 'removing-bg' | 'compositing' | 'complete';

// export default function PhotoCapture({
//   destinationId,
//   destinationName,
//   backgroundImagePath,
// }: PhotoCaptureProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [stage, setStage] = useState<ProcessingStage>('idle');
//   const [progress, setProgress] = useState(0);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [finalBlob, setFinalBlob] = useState<Blob | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   // Start camera
//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'user', width: 1280, height: 720 },
//       });
//       streamRef.current = stream;
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//       setStage('capturing');
//     } catch (err) {
//       setError('Camera access denied. Please use file upload instead.');
//       console.error('Camera error:', err);
//     }
//   }, []);

//   // Stop camera
//   const stopCamera = useCallback(() => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//       streamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//   }, []);

//   // Capture photo from camera
//   const capturePhoto = useCallback(() => {
//     if (!videoRef.current) return;

//     const canvas = document.createElement('canvas');
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext('2d')!;
//     ctx.drawImage(videoRef.current, 0, 0);

//     canvas.toBlob((blob) => {
//       if (blob) {
//         processPhoto(blob);
//       }
//     }, 'image/jpeg', 0.95);

//     stopCamera();
//   }, [stopCamera]);

//   // Process photo (remove background + composite)
//   const processPhoto = useCallback(async (photoBlob: Blob) => {
//     try {
//       setError(null);
//       setProgress(0);

//       // Dynamically import the background removal functions
//       const { removeSelfieBackground, loadImage } = await import('@/lib/utils/backgroundRemoval');

//       // Stage 1: Remove background
//       setStage('removing-bg');
//       const noBgBlob = await removeSelfieBackground(photoBlob, {
//         quality: 'medium',
//         progress: (p) => setProgress(Math.floor(p * 50)), // 0-50%
//       });

//       setProgress(60);

//       // Load images
//       const selfieImage = await loadImage(noBgBlob);
//       const backgroundImage = await loadImage(backgroundImagePath);

//       setProgress(70);

//       // Stage 2: Composite
//       setStage('compositing');
//       const compositeBlob = await compositePhoto(selfieImage, backgroundImage, {
//         scale: 0.35,
//         position: 'bottom-left',
//       });

//       setProgress(90);

//       // Create preview URL
//       const previewUrl = URL.createObjectURL(compositeBlob);
//       setPreviewUrl(previewUrl);
//       setFinalBlob(compositeBlob);

//       setProgress(100);
//       setStage('complete');
//     } catch (err) {
//       console.error('Photo processing error:', err);
//       setError('Failed to process photo. Please try again.');
//       setStage('idle');
//     }
//   }, [backgroundImagePath]);

//   // Handle file upload
//   const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setError('Please upload an image file');
//       return;
//     }

//     processPhoto(file);
//   }, [processPhoto]);

//   // Download photo
//   const downloadPhoto = useCallback(() => {
//     if (!finalBlob) return;

//     const url = URL.createObjectURL(finalBlob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `dream-globe-${destinationId}-${Date.now()}.webp`;
//     a.click();
//     URL.revokeObjectURL(url);
//   }, [finalBlob, destinationId]);

//   // Close modal
//   const handleClose = useCallback(() => {
//     stopCamera();
//     setIsOpen(false);
//     setStage('idle');
//     setProgress(0);
//     setError(null);
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//       setPreviewUrl(null);
//     }
//     setFinalBlob(null);
//   }, [stopCamera, previewUrl]);

//   // Open modal
//   const handleOpen = useCallback(() => {
//     setIsOpen(true);
//     setStage('idle');
//   }, []);

//   return (
//     <>
//       {/* Trigger Button */}
//       <button
//         onClick={handleOpen}
//         className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
//                    text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
//                    shadow-lg hover:shadow-xl flex items-center gap-2"
//       >
//         <Camera className="w-5 h-5" />
//         <span>Take a Photo</span>
//       </button>

//       {/* Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
//           <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900
//                           rounded-2xl shadow-2xl overflow-hidden border border-purple-500/30">

//             {/* Close Button */}
//             <button
//               onClick={handleClose}
//               className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full
//                          text-white transition-all duration-200"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             {/* Header */}
//             <div className="p-6 border-b border-purple-500/30">
//               <h2 className="text-2xl font-bold text-white">Capture Your Memory</h2>
//               <p className="text-gray-300 mt-1">at {destinationName}</p>
//             </div>

//             {/* Content */}
//             <div className="p-6">
//               {/* Error Message */}
//               {error && (
//                 <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
//                   {error}
//                 </div>
//               )}

//               {/* Stage: Idle - Show options */}
//               {stage === 'idle' && (
//                 <div className="flex flex-col items-center gap-6 py-12">
//                   <p className="text-gray-300 text-center mb-4">
//                     Take a selfie or upload a photo to create your memory at {destinationName}
//                   </p>

//                   <div className="flex gap-4">
//                     <button
//                       onClick={startCamera}
//                       className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700
//                                  text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
//                                  shadow-lg flex items-center gap-3"
//                     >
//                       <Camera className="w-6 h-6" />
//                       <span>Use Camera</span>
//                     </button>

//                     <button
//                       onClick={() => fileInputRef.current?.click()}
//                       className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
//                                  text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
//                                  shadow-lg flex items-center gap-3"
//                     >
//                       <Upload className="w-6 h-6" />
//                       <span>Upload Photo</span>
//                     </button>
//                   </div>

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                 </div>
//               )}

//               {/* Stage: Capturing - Show camera */}
//               {stage === 'capturing' && (
//                 <div className="flex flex-col items-center gap-4">
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     className="w-full max-w-2xl rounded-xl"
//                   />

//                   <div className="flex gap-4">
//                     <button
//                       onClick={capturePhoto}
//                       className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
//                                  text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
//                                  shadow-lg flex items-center gap-3"
//                     >
//                       <Camera className="w-6 h-6" />
//                       <span>Capture</span>
//                     </button>

//                     <button
//                       onClick={() => {
//                         stopCamera();
//                         setStage('idle');
//                       }}
//                       className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl
//                                  transition-all duration-300"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Stage: Processing - Show progress */}
//               {(stage === 'removing-bg' || stage === 'compositing') && (
//                 <div className="flex flex-col items-center gap-6 py-12">
//                   <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />

//                   <div className="text-center">
//                     <h3 className="text-xl font-semibold text-white mb-2">
//                       {stage === 'removing-bg' ? 'Removing Background...' : 'Creating Your Memory...'}
//                     </h3>
//                     <p className="text-gray-400">
//                       {stage === 'removing-bg'
//                         ? 'Using AI to isolate you from the background'
//                         : 'Blending you into the destination with smart filters'}
//                     </p>
//                   </div>

//                   {/* Progress Bar */}
//                   <div className="w-full max-w-md">
//                     <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
//                         style={{ width: `${progress}%` }}
//                       />
//                     </div>
//                     <p className="text-center text-gray-400 mt-2">{progress}%</p>
//                   </div>
//                 </div>
//               )}

//               {/* Stage: Complete - Show result */}
//               {stage === 'complete' && previewUrl && (
//                 <div className="flex flex-col items-center gap-6">
//                   <img
//                     src={previewUrl}
//                     alt="Your memory"
//                     className="w-full max-w-3xl rounded-xl shadow-2xl"
//                   />

//                   <div className="flex gap-4">
//                     <button
//                       onClick={downloadPhoto}
//                       className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
//                                  text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
//                                  shadow-lg flex items-center gap-3"
//                     >
//                       <Download className="w-6 h-6" />
//                       <span>Download Photo</span>
//                     </button>

//                     <button
//                       onClick={() => {
//                         if (previewUrl) {
//                           URL.revokeObjectURL(previewUrl);
//                           setPreviewUrl(null);
//                         }
//                         setFinalBlob(null);
//                         setStage('idle');
//                       }}
//                       className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl
//                                  transition-all duration-300"
//                     >
//                       Take Another
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
