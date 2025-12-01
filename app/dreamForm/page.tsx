'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Globe, User, Flag, Sparkles, Loader2 } from 'lucide-react';
import EyeTransition from '../components/EyeTransition';
import DreamyParticles from '../components/DreamyParticles';
import CameraCapture from '../components/CameraCapture';

const DreamFormScene = () => {
  const router = useRouter();
  const [eyesClosed, setEyesClosed] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    dateOfBirth: '',
    passportNumber: '',
    selfie: null as File | null,
    destinations: [] as string[],
  });

  // Separate date fields
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [processedSelfie, setProcessedSelfie] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nationality search states
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [filteredNationalities, setFilteredNationalities] = useState<string[]>([]);
  const nationalityRef = useRef<HTMLDivElement>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);

  const countries = [
    'India',
    'United Kingdom',
    'Russia',
    'United States',
    'France'
  ];

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const nationalities = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguan', 'Argentine', 'Armenian', 'Australian',
    'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean',
    'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese',
    'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese',
    'Colombian', 'Comoran', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djiboutian',
    'Dominican', 'Dutch', 'East Timorese', 'Ecuadorian', 'Egyptian', 'Emirati', 'Equatorial Guinean', 'Eritrean', 'Estonian',
    'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek',
    'Grenadian', 'Guatemalan', 'Guinean', 'Guyanese', 'Haitian', 'Honduran', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian',
    'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan',
    'Kiribati', 'Korean', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner',
    'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese',
    'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Montenegrin',
    'Moroccan', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian', 'Nigerien',
    'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Palestinian', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian',
    'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese',
    'Saudi', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovak', 'Slovenian', 'Solomon Islander',
    'Somali', 'South African', 'South Sudanese', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamese', 'Swazi', 'Swedish', 'Swiss',
    'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian', 'Tunisian', 'Turkish', 'Turkmen',
    'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Vanuatuan', 'Venezuelan', 'Vietnamese', 'Yemeni', 'Zambian',
    'Zimbabwean'
  ];

  // Filter nationalities based on search
  useEffect(() => {
    if (nationalitySearch.trim() === '') {
      setFilteredNationalities(nationalities);
    } else {
      const filtered = nationalities.filter(nat =>
        nat.toLowerCase().includes(nationalitySearch.toLowerCase())
      );
      setFilteredNationalities(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nationalitySearch]);

  // Update dateOfBirth when day, month, or year changes
  useEffect(() => {
    if (birthDay && birthMonth && birthYear && birthYear.length === 4) {
      const paddedDay = birthDay.padStart(2, '0');
      const dateString = `${birthYear}-${birthMonth}-${paddedDay}`;
      setFormData(prev => ({ ...prev, dateOfBirth: dateString }));
    }
  }, [birthDay, birthMonth, birthYear]);

  // Handle nationality selection
  const handleNationalitySelect = (nationality: string) => {
    setFormData({ ...formData, nationality });
    setNationalitySearch(nationality);
    setShowNationalityDropdown(false);
  };

  // Portal-based dropdown component
  const DropdownPortal = () => {
    if (!showNationalityDropdown || !dropdownRect) return null;

    const backdropStyle: React.CSSProperties = {
      position: 'fixed',
      inset: 0,
      zIndex: 9999998,
      background: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(4px)',
      pointerEvents: 'auto',
    };

    // No results case
    if (nationalitySearch && filteredNationalities.length === 0) {
      const noResultsStyle: React.CSSProperties = {
        position: 'absolute',
        top: dropdownRect.bottom + window.scrollY + 8,
        left: dropdownRect.left + window.scrollX,
        width: dropdownRect.width,
        padding: '24px',
        backgroundColor: '#991b1b',
        border: '3px solid #ef4444',
        borderRadius: 12,
        zIndex: 9999999,
        pointerEvents: 'auto',
      };

      return createPortal(
        <>
          <div
            style={backdropStyle}
            onClick={() => setShowNationalityDropdown(false)}
            aria-hidden="true"
          />
          <div style={noResultsStyle} className="text-white text-center text-2xl font-bold">
            ❌ No matching nationality found
          </div>
        </>,
        document.body
      );
    }

    // Dropdown with results
    const dropdownStyle: React.CSSProperties = {
      position: 'absolute',
      top: dropdownRect.bottom + window.scrollY + 8,
      left: dropdownRect.left + window.scrollX,
      width: dropdownRect.width,
      maxHeight: '320px',
      overflowY: 'auto',
      backgroundColor: '#1e293b',
      border: '3px solid #a855f7',
      borderRadius: 12,
      zIndex: 9999999,
      pointerEvents: 'auto',
    };

    return createPortal(
      <>
        <div
          style={backdropStyle}
          onClick={() => setShowNationalityDropdown(false)}
          aria-hidden="true"
        />
        <div style={dropdownStyle} role="listbox" aria-hidden={!showNationalityDropdown}>
          {filteredNationalities.slice(0, 50).map((nat) => (
            <button
              key={nat}
              type="button"
              onClick={() => handleNationalitySelect(nat)}
              className="block w-full px-6 py-5 text-left text-white text-2xl font-bold hover:bg-purple-600 active:bg-purple-700 transition-colors duration-100 border-b-2 border-gray-600 last:border-b-0 cursor-pointer"
              style={{ backgroundColor: '#1e293b', pointerEvents: 'auto' }}
            >
              {nat}
            </button>
          ))}
          {filteredNationalities.length > 50 && (
            <div className="px-6 py-3 text-center text-purple-300 text-sm bg-purple-500/10">
              Type more to filter {filteredNationalities.length - 50} more options
            </div>
          )}
        </div>
      </>,
      document.body
    );
  };

  // Calculate dropdown position for portal
  useEffect(() => {
    if (showNationalityDropdown && nationalityRef.current) {
      const rect = nationalityRef.current.getBoundingClientRect();
      setDropdownRect(rect);
    }
  }, [showNationalityDropdown]);

  // Close dropdown on Escape key & prevent body scroll when open
  useEffect(() => {
    if (showNationalityDropdown) {
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowNationalityDropdown(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [showNationalityDropdown]);

  // Process a file (from upload or camera)
  const processFile = async (file: File) => {
    setFormData({ ...formData, selfie: file });

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelfiePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Process background removal immediately
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Convert image to JPEG if it's in an unsupported format (like AVIF, HEIC, etc.)
      let imageToProcess: File | Blob = file;

      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
        // Convert to JPEG for compatibility
        const img = new Image();
        const imageUrl = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(imageUrl);

        const convertedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to convert image'));
          }, 'image/jpeg', 0.95);
        });

        imageToProcess = convertedBlob;
      }

      // Dynamically import the background removal function
      const { removeSelfieBackground } = await import('@/lib/utils/backgroundRemoval');

      const blob = await removeSelfieBackground(imageToProcess, {
        quality: 'medium',
        progress: (p) => setProcessingProgress(Math.floor(p * 100)),
      });

      // Convert processed blob to base64 for storage
      const processedReader = new FileReader();
      processedReader.onloadend = () => {
        setProcessedSelfie(processedReader.result as string);
        setIsProcessing(false);
      };
      processedReader.readAsDataURL(blob);
    } catch (error) {
      console.error('Background removal failed:', error);
      alert('Failed to process photo. Please try another image.');
      setIsProcessing(false);
    }
  };

  // Handle file input change
  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = e instanceof File ? e : e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  useEffect(() => {
    // Start with eyes closed, then open them after a brief moment
    const timer = setTimeout(() => {
      setEyesClosed(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Play video and audio when eyes start to open
    if (!eyesClosed) {
      const videoTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.log('Video autoplay failed:', error);
          });
        }
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.log('Audio autoplay failed:', error);
          });
        }
      }, 500);

      return () => clearTimeout(videoTimer);
    }
  }, [eyesClosed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.nationality || formData.destinations.length === 0) {
      alert('Please fill in all required fields and select at least one destination!');
      return;
    }

    // Validate date of birth
    if (!birthDay || !birthMonth || !birthYear) {
      alert('Please enter your complete date of birth!');
      return;
    }

    // Check if year is 4 digits
    if (birthYear.length !== 4) {
      alert('Please enter a valid 4-digit year!');
      return;
    }

    // Check if year is in valid range
    const yearNum = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      alert(`Year must be between 1900 and ${currentYear}!`);
      return;
    }

    // Check if date is valid
    const selectedDate = new Date(yearNum, parseInt(birthMonth) - 1, parseInt(birthDay));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      alert('Date of birth cannot be in the future!');
      return;
    }

    // Check if date is valid (e.g., not Feb 31)
    if (
      selectedDate.getDate() !== parseInt(birthDay) ||
      selectedDate.getMonth() !== parseInt(birthMonth) - 1 ||
      selectedDate.getFullYear() !== yearNum
    ) {
      alert('Please enter a valid date!');
      return;
    }

    // If user uploaded a photo, wait for background processing to complete
    if (selfiePreview && isProcessing) {
      alert('Please wait for photo processing to complete!');
      return;
    }

    // If user uploaded a photo but processing failed
    if (selfiePreview && !processedSelfie) {
      alert('Photo processing failed. Please upload a different photo or continue without a photo.');
      return;
    }

    // Generate a permanent passport ID if one doesn't exist
    let existingData = null;
    try {
      const stored = localStorage.getItem('dreamData');
      if (stored) {
        existingData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading existing data:', error);
    }

    // Generate passport ID once and keep it
    const generateDreamID = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 9; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const passportId = existingData?.passportId || generateDreamID();

    // Store form data in localStorage for persistence
    // Store the already-processed selfie (background removed) if available
    const dataToStore = {
      name: formData.name,
      nationality: formData.nationality,
      dateOfBirth: formData.dateOfBirth,
      passportNumber: formData.passportNumber,
      destinations: formData.destinations,
      selfieBase64: processedSelfie || null, // Store processed image (no background) or null
      hasPhoto: !!processedSelfie, // Flag to indicate if user uploaded a photo
      passportId: passportId, // Store the permanent passport ID
    };
    localStorage.setItem('dreamData', JSON.stringify(dataToStore));

    // Close eyes before navigation
    setIsNavigating(true);
    setEyesClosed(true);
  };

  // Handle navigation after eye transition completes
  const handleEyeTransitionComplete = () => {
    if (isNavigating) {
      const firstDestination = formData.destinations[0];
      router.push(
        `/plane?nationality=${encodeURIComponent(formData.nationality)}&destination=${encodeURIComponent(firstDestination)}&name=${encodeURIComponent(formData.name)}`
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0e27] via-[#1a1535] to-[#0a0e27] flex items-center justify-center py-12 px-4">
      {/* Dreamy particle effect background */}
      <DreamyParticles />

      {/* Background video - sleeping man (subtle overlay) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        muted
        playsInline
      >
        <source src="/scene.mp4" type="video/mp4" />
      </video>

      {/* Background audio - voice */}
      <audio ref={audioRef}>
        <source src="/voice.mp3" type="audio/mpeg" />
      </audio>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 space-y-4 animate-fade-in">
          <p className="text-lg text-blue-200/80">
            Let&apos;s create your journey to the world...
          </p>
        </div>


        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-purple-500/20">

          {/* Name Input */}
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <label className="flex items-center space-x-2 text-blue-200 font-medium">
              <User className="w-5 h-5" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
          </div>

          {/* Nationality Input with Search */}
           <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <label className="flex items-center space-x-2 text-blue-200 font-medium">
              <Flag className="w-5 h-5" />
              <span>Nationality</span>
            </label>
            <select
              required
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            >
              <option value="" className="bg-[#1a1535] text-white/60">Select your nationality</option>
              {nationalities.map((nat) => (
                <option key={nat} value={nat} className="bg-[#1a1535] text-white">
                  {nat}
                </option>
              ))}
            </select>
          </div>

          {/* Date of Birth Input */}
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <label className="flex items-center space-x-2 text-blue-200 font-medium">
              <Sparkles className="w-5 h-5" />
              <span>Date of Birth</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Day Input */}
              <div>
                <label className="text-xs text-blue-300/70 mb-1 block">Day</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="31"
                  placeholder="DD"
                  value={birthDay}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 31)) {
                      setBirthDay(val);
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-center"
                />
              </div>

              {/* Month Dropdown */}
              <div>
                <label className="text-xs text-blue-300/70 mb-1 block">Month</label>
                <select
                  required
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                >
                  <option value="" className="bg-[#1a1535] text-white/60">Month</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value} className="bg-[#1a1535] text-white">
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Input */}
              <div>
                <label className="text-xs text-blue-300/70 mb-1 block">Year</label>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="YYYY"
                  value={birthYear}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow typing freely, validation will happen on submit
                    if (val.length <= 4) {
                      setBirthYear(val);
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-center"
                />
              </div>
            </div>
          </div>

          {/* Selfie Upload */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <label className="flex items-center space-x-2 text-blue-200 font-medium">
              <Camera className="w-5 h-5" />
              <span>Your Photo <span className="text-sm text-blue-300/60">(Optional)</span></span>
            </label>
            <p className="text-xs text-blue-200/60">
              Upload your photo to appear in destination memories, or skip to view destinations only
            </p>

            {/* Preview */}
            {selfiePreview && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-lg shadow-purple-500/30">
                  <img src={selfiePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>

                {/* Processing indicator */}
                {isProcessing && (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                    <p className="text-sm text-purple-300">Processing... {processingProgress}%</p>
                    <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Success indicator */}
                {!isProcessing && processedSelfie && (
                  <p className="text-sm text-green-300">✓ Ready! Background removed</p>
                )}
              </div>
            )}

            {/* Upload Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-200 hover:bg-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCamera(true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-200 hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSelfieUpload}
              className="hidden"
              disabled={isProcessing}
            />
          </div>

          {/* Destinations */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <label className="flex items-center space-x-2 text-blue-200 font-medium">
              <Globe className="w-5 h-5" />
              <span>Dream Destinations</span>
            </label>

            <select
              required
              value={formData.destinations[0] || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destinations: e.target.value ? [e.target.value] : [],
                })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            >
              <option value="" className="bg-[#1a1535] text-white/60">Select a destination</option>
              {countries.map((country) => (
                <option key={country} value={country} className="bg-[#1a1535] text-white">
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl shadow-xl shadow-purple-500/30 hover:shadow-purple-400/50 transition-all duration-500 transform hover:scale-105 active:scale-95 mt-8"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="text-xl font-semibold text-white tracking-wide">
                Begin Dream Journey
              </span>
            </div>
          </button>
        </form>

        {/* Footer text */}
        <p className="text-center text-sm text-blue-200/60 mt-6 animate-pulse">
          Your information will be used to create your personalized dream passport
        </p>
      </div>

      {/* Eye transition effect */}
      <EyeTransition isClosing={eyesClosed} onTransitionComplete={handleEyeTransitionComplete} />

      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleSelfieUpload}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default DreamFormScene;
