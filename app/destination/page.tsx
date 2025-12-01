'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Plane, Mic, Loader2, Sparkles, Wand2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getCountryByName, getRandomTravelVideo, COUNTRIES, Country } from '@/lib/data/destinations';
import { hasPhotoBackground } from '@/lib/data/photoBackgrounds';
import PhotoGallery from '../components/PhotoGallery';
import VideoTransition from '../components/VideoTransition';
import EyeTransition from '../components/EyeTransition';
import { getMusicManager } from '@/lib/utils/musicManager';

// --- VOICE CONFIG & TYPES ---
const GOOGLE_API_KEY = (process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY || "").trim();

const SYSTEM_PROMPT_TEMPLATE = `
You are a knowledgeable and enthusiastic tour guide for {DESTINATION}.
Voice: Friendly, engaging, and informative.
Style: Keep responses concise (max 2-3 sentences) and interesting.
Context: The user is currently visiting {DESTINATION} in a dream-like virtual travel experience.
`;

type ChatRole = "user" | "model";
type ChatMessage = { role: ChatRole; content: string };

type SpeechRecognitionResultLike = { [index: number]: { transcript: string }; length: number };
type SpeechRecognitionEventLike = { results: { [index: number]: SpeechRecognitionResultLike; length: number } };

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const getAudioContextClass = (): typeof AudioContext | null => {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext || w.webkitAudioContext || null;
};

const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

const callGeminiText = async (history: ChatMessage[], message: string, destinationName: string, city: string): Promise<string> => {
  const cleanKey = GOOGLE_API_KEY;
  if (!cleanKey) throw new Error("No API key");

  const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace(/{DESTINATION}/g, `${destinationName}${city ? `, ${city}` : ''}`);

  const prompt = {
    contents: [
      ...(history || []).map((h: ChatMessage) => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.content }] })),
      { role: "user", parts: [{ text: message }] }
    ],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { maxOutputTokens: 150, temperature: 1.0 }
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(cleanKey)}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(prompt)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Gemini API Error");
  }
  return (await res.json())?.candidates?.[0]?.content?.parts?.[0]?.text || "I am listening...";
};

const callGoogleTTS = async (text: string): Promise<string> => {
  const cleanKey = GOOGLE_API_KEY;
  if (!cleanKey) throw new Error("No Key");

  const ssml = `
    <speak>
      <voice name="en-US-Journey-F">
        <prosody rate="1.1" pitch="+2st">
            ${text}
        </prosody>
      </voice>
    </speak>
  `;

  const payload = {
    input: { ssml },
    voice: { languageCode: "en-US", name: "en-US-Journey-F" },
    audioConfig: { audioEncoding: "MP3", effectsProfileId: ["headphone-class-device"] }
  };

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(cleanKey)}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
  );

  if (!res.ok) throw new Error("Google TTS Failed");
  const data = await res.json();
  const binaryString = window.atob(data.audioContent);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes.buffer], { type: "audio/mpeg" }));
};

const speakNativeBrowser = (text: string, onEnd: () => void) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.1;
  utterance.rate = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Female"));
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
};

// Dynamically import StreetViewPanorama
const StreetViewPanorama = dynamic(() => import('../components/StreetViewPanorama'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-white text-lg">Loading Street View...</p>
      </div>
    </div>
  ),
});

const DestinationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [destinationData, setDestinationData] = useState<any>(null);
  const [countryData, setCountryData] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDestinationOptions, setShowDestinationOptions] = useState(false);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState<number>(-1);
  const [showNarration, setShowNarration] = useState(true);
  const [showVideoTransition, setShowVideoTransition] = useState(false);
  const [nextDestinationData, setNextDestinationData] = useState<any>(null);
  const [showInitialEyeOpening, setShowInitialEyeOpening] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioPlayAttempted = useRef<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(10); // Default 10 seconds
  const [remainingCountries, setRemainingCountries] = useState<Country[]>([]);
  const [showCountrySelection, setShowCountrySelection] = useState(false);

  // Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Ask Guide");
  const [audioReady, setAudioReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const voiceAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const historyRef = useRef<ChatMessage[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const dest = searchParams.get('destination');
    const userName = searchParams.get('name');

    if (!dest) {
      router.push('/dreamForm');
      return;
    }

    const timeoutId = setTimeout(() => {
      setDestination(dest);
      setName(userName || 'Traveler');

      const country = getCountryByName(dest);
      if (country) {
        setCountryData(country);
        // Use the airport street view as the initial arrival view
        setDestinationData({
          name: country.name,
          emoji: country.emoji,
          streetViewCoords: country.airport.streetViewCoords,
          narration: country.airport.narration,
          narrationAudio: country.airport.narrationAudio, // FIX: Include audio file path
          city: country.airport.city,
          isAirport: true,
        });

        // Store current country for next flight departure
        localStorage.setItem('currentCountry', country.name);

        // Play country-specific music when arriving at airport
        const musicManager = getMusicManager();
        musicManager.playCountryMusic(country.id);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [searchParams, router]);

  // Calculate remaining countries
  useEffect(() => {
    // Show all countries except the current one (allow revisiting)
    const remaining = COUNTRIES.filter(country =>
      country.name !== destination
    );
    const timeoutId = setTimeout(() => {
      setRemainingCountries(remaining);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [destination]);

  // Show initial eye opening animation
  useEffect(() => {
    const eyeTimer = setTimeout(() => {
      setShowInitialEyeOpening(false);
    }, 1500);

    return () => clearTimeout(eyeTimer);
  }, [destination]);

  // Hide welcome overlay after 3 seconds (after eye opens)
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000); // 1.5s eye opening + 2.5s welcome

    return () => clearTimeout(welcomeTimer);
  }, []);

  // Don't auto-show destination options - let user click buttons instead
  // This prevents being forced into the modal automatically
  // User can click "View All Destinations" or "Next Country" when ready

  // Play narration audio when destination changes - with better error handling
  useEffect(() => {
    if (destinationData?.narrationAudio && audioRef.current && !audioPlayAttempted.current) {
      // Reset narration visibility
      const showNarrationTimeout = setTimeout(() => {
        setShowNarration(true);
      }, 0);
      audioPlayAttempted.current = true;

      // Set audio source
      audioRef.current.src = destinationData.narrationAudio;

      // Get audio duration once metadata is loaded
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          const duration = audioRef.current.duration;
          setAudioDuration(duration);
          console.log(`🎵 Airport narration duration: ${duration} seconds`);
        }
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      // Try to play the audio
      const playAudio = () => {
        if (audioRef.current) {
          audioRef.current.play().catch(error => {
            console.warn('Audio autoplay blocked, waiting for user interaction:', error);
            // Try again on user click
            const playOnInteraction = () => {
              if (audioRef.current) {
                audioRef.current.play().catch(e => console.error('Audio play failed:', e));
              }
              document.removeEventListener('click', playOnInteraction);
            };
            document.addEventListener('click', playOnInteraction, { once: true });
          });
        }
      };

      // Wait a bit for eye opening animation to complete
      const playTimeout = setTimeout(playAudio, 1500);

      // Handle when audio ends
      const handleAudioEnd = () => {
        setShowNarration(false);
        audioPlayAttempted.current = false;
      };

      audioRef.current.addEventListener('ended', handleAudioEnd);

      return () => {
        clearTimeout(showNarrationTimeout);
        clearTimeout(playTimeout);
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('ended', handleAudioEnd);
          audioRef.current.pause();
        }
        audioPlayAttempted.current = false;
      };
    }
  }, [destinationData?.narrationAudio]);

  // Voice Cleanup
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current != null) window.clearTimeout(speechTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { }
      }
    };
  }, []);

  const initAudio = () => {
    if (audioContextRef.current) return;
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const audio = new Audio();
    audio.crossOrigin = "anonymous";

    audioContextRef.current = ctx;
    voiceAudioElementRef.current = audio;
    setAudioReady(true);
  };

  const handleSpeak = async (text: string) => {
    console.log('🎤 handleSpeak called with:', text);
    if (!text.trim() || !destinationData) {
      console.warn('🎤 Empty text or missing destination data');
      return;
    }

    try {
      if (!audioContextRef.current) initAudio();
      if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
    } catch (e) {
      console.error('🎤 Audio Context Error:', e);
    }

    // Pause background narration if playing
    if (audioRef.current && !audioRef.current.paused) {
      console.log('🎤 Pausing narration');
      audioRef.current.pause();
    }

    // Pause background music
    try {
      console.log('🎤 Pausing background music');
      getMusicManager().pause();
    } catch (e) {
      console.error('🎤 Failed to pause music:', e);
    }

    const userMsg = { role: "user" as ChatRole, content: text };
    historyRef.current.push(userMsg);
    setMessages([...historyRef.current]);

    setVoiceStatus("Thinking...");
    setIsSpeaking(true);

    try {
      console.log('🎤 Calling Gemini API...');
      const reply = await callGeminiText(historyRef.current, text, destinationData.name, destinationData.city);
      console.log('🎤 Gemini Reply:', reply);

      const assistantMsg = { role: "model" as ChatRole, content: reply };
      historyRef.current.push(assistantMsg);
      setMessages([...historyRef.current]);

      setVoiceStatus("Speaking...");

      try {
        console.log('🎤 Calling Google TTS...');
        const audioUrl = await callGoogleTTS(reply);
        if (audioUrl && voiceAudioElementRef.current) {
          const audio = voiceAudioElementRef.current;
          audio.src = audioUrl;
          audio.onended = () => {
            console.log('🎤 TTS Ended');
            setIsSpeaking(false);
            setVoiceStatus("Ask Guide");
            // Resume music
            try {
              console.log('🎤 Resuming background music');
              getMusicManager().resume();
            } catch (e) {
              console.error('🎤 Failed to resume music:', e);
            }
          };
          audio.onerror = (e) => {
            console.error('🎤 Audio Playback Error:', e);
            setIsSpeaking(false);
            setVoiceStatus("Error");
            getMusicManager().resume();
          };
          await audio.play();
        }
      } catch (ttsError) {
        console.warn("🎤 Fallback TTS due to error:", ttsError);
        speakNativeBrowser(reply, () => {
          console.log('🎤 Native TTS Ended');
          setIsSpeaking(false);
          setVoiceStatus("Ask Guide");
          getMusicManager().resume();
        });
      }
    } catch (err) {
      console.error('🎤 Voice Feature Error:', err);
      setVoiceStatus("Error");
      setIsSpeaking(false);
      getMusicManager().resume();
      setTimeout(() => setVoiceStatus("Ask Guide"), 2000);
    }
  };

  const startListening = () => {
    console.log('🎤 startListening called');
    try {
      if (!audioContextRef.current) initAudio();
    } catch (e) {
      console.error('🎤 Init Audio Error:', e);
    }

    const Rec = getSpeechRecognition();
    if (!Rec) {
      console.error('🎤 Speech recognition not supported');
      alert("Speech recognition not supported");
      return;
    }

    // Pause music while listening
    try {
      console.log('🎤 Pausing background music for listening');
      getMusicManager().pause();
    } catch (e) {
      console.error('🎤 Failed to pause music:', e);
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { console.error('🎤 Stop Rec Error:', e); }
      recognitionRef.current = null;
    }

    const r: SpeechRecognitionLike = new Rec();
    recognitionRef.current = r;
    r.continuous = false;
    r.interimResults = true;

    r.onstart = () => {
      console.log('🎤 Recognition started');
      setVoiceStatus("Listening...");
    };

    let lastTranscript = "";
    r.onresult = (event: SpeechRecognitionEventLike) => {
      const results = event.results;
      if (!results || results.length === 0) return;
      const lastResult = results[results.length - 1];
      if (!lastResult || !lastResult[0]) return;

      lastTranscript = lastResult[0].transcript || "";
      // console.log('🎤 Transcript:', lastTranscript); // Optional: log transcript

      if (speechTimeoutRef.current != null) window.clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = window.setTimeout(() => {
        if (lastTranscript.trim()) handleSpeak(lastTranscript.trim());
        speechTimeoutRef.current = undefined;
      }, 1000);
    };

    r.onerror = (event: any) => {
      console.error('🎤 Recognition Error:', event);
      setVoiceStatus("Error");
      if (speechTimeoutRef.current != null) window.clearTimeout(speechTimeoutRef.current);

      // Resume music on error
      getMusicManager().resume();

      setTimeout(() => setVoiceStatus("Ask Guide"), 2000);
    };

    r.onend = () => {
      console.log('🎤 Recognition ended');
      if (speechTimeoutRef.current == null && !isSpeaking) {
        setVoiceStatus("Ask Guide");
        // Resume music if we are not proceeding to speak
        getMusicManager().resume();
      }
    };

    try {
      r.start();
    } catch (e) {
      console.error('🎤 Failed to start recognition:', e);
      getMusicManager().resume();
    }
  };

  const handleDestinationSelect = (destinationId: string) => {
    const selectedIndex = countryData.destinations.findIndex((d: any) => d.id === destinationId);
    if (selectedIndex !== -1) {
      const selectedDest = countryData.destinations[selectedIndex];

      // Prepare next destination data
      setNextDestinationData({
        ...selectedDest,
        emoji: countryData.emoji,
        isAirport: false,
      });

      setCurrentDestinationIndex(selectedIndex);
      setShowDestinationOptions(false);

      // Show video transition
      setShowVideoTransition(true);
    }
  };

  const handleNextDestination = () => {
    if (!countryData) return;

    // Loop back to first destination if at the last one
    const nextIndex = (currentDestinationIndex + 1) % countryData.destinations.length;
    const nextDest = countryData.destinations[nextIndex];

    // Prepare next destination data
    setNextDestinationData({
      ...nextDest,
      emoji: countryData.emoji,
      isAirport: false,
    });

    setCurrentDestinationIndex(nextIndex);

    // Show video transition
    setShowVideoTransition(true);
  };

  const handleCountrySelect = (country: Country) => {
    // Mark current country as visited
    if (countryData) {
      const visitedCountries = JSON.parse(localStorage.getItem('visitedCountries') || '[]');
      if (!visitedCountries.includes(countryData.id)) {
        visitedCountries.push(countryData.id);
        localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
      }
      // Store current country as the departure location for next flight
      localStorage.setItem('currentCountry', countryData.name);
    }

    // Store selected country
    localStorage.setItem('selectedCountry', country.name);

    // Get current country (where we're departing from)
    const currentCountry = localStorage.getItem('currentCountry') || 'India';

    // Get user data for navigation
    const dreamData = localStorage.getItem('dreamData');
    const userData = dreamData ? JSON.parse(dreamData) : null;
    const userName = name || userData?.name || 'Traveler';
    const userNationality = userData?.nationality || 'American';

    // Navigate to plane with all required parameters
    router.push(`/plane?departure=${encodeURIComponent(currentCountry)}&destination=${encodeURIComponent(country.name)}&name=${encodeURIComponent(userName)}&nationality=${encodeURIComponent(userNationality)}`);
  };

  const handleVideoTransitionComplete = () => {
    // Video transition complete, update destination
    if (nextDestinationData) {
      setDestinationData(nextDestinationData);
      setShowVideoTransition(false);
      setNextDestinationData(null);
      setShowWelcome(true);
      setShowInitialEyeOpening(false); // Eye already opened from video transition

      // Hide welcome after a delay
      setTimeout(() => setShowWelcome(false), 3000);
    }
  };

  const getDestinationEmoji = (dest: string) => {
    const emojiMap: { [key: string]: string } = {
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'Egypt': '🇪🇬',
      'United States': '🇺🇸',
      'Brazil': '🇧🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'Australia': '🇦🇺',
      'Canada': '🇨🇦',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'Thailand': '🇹🇭',
      'Greece': '🇬🇷',
      'Mexico': '🇲🇽',
      'Netherlands': '🇳🇱',
      'Switzerland': '🇨🇭',
      'Iceland': '🇮🇸',
      'New Zealand': '🇳🇿',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Dubai (UAE)': '🇦🇪',
      'Norway': '🇳🇴',
      'Sweden': '🇸🇪',
      'Portugal': '🇵🇹',
      'Morocco': '🇲🇦',
      'Turkey': '🇹🇷',
      'Argentina': '🇦🇷',
      'Peru': '🇵🇪',
      'Russia': '🇷🇺',
    };
    return emojiMap[dest] || '🌍';
  };

  const getDestinationImage = (destId: string) => {
    const imageMap: { [key: string]: string } = {
      // India
      'taj-mahal': '/destinations/Taj_Mahal.jpeg',
      'red-fort': '/destinations/red-fort-delhi-attr-hero.jpeg',
      'qutub-minar': '/destinations/qutub minar.webp',
      // USA
      'statue-of-liberty': '/destinations/Statue-of-Liberty.webp',
      'times-square': '/destinations/timesquare.jpg',
      'met-museum': '/destinations/metropolitonmuseum.avif',
      'biltmore': '/destinations/biltmore.jpg',
      // UK
      'eryri-snowdonia': '/destinations/eryrinp.webp',
      'buckingham-palace': '/destinations/Buckingham.Palace.jpg',
      'bath': '/destinations/bath.jpeg',
      // Russia
      'red-square': '/destinations/redsquare.webp',
      'hermitage-museum': '/destinations/Hermitage.webp',
      'peter-paul-fortress': '/destinations/peter-and-paul-fortress-1.webp',
      // France
      'eiffel-tower': '/destinations/eiffel tower.webp',
      'fontainebleau': '/destinations/Château de Fontainebleau.jpg',
      'chambord': '/destinations/Chambord.webp',
    };
    return imageMap[destId] || '';
  };

  if (!destination || !destinationData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">✈️</div>
          <div className="text-white text-2xl animate-pulse">Arriving...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Transition between destinations */}
      {showVideoTransition && countryData && (
        <VideoTransition
          videoSrc={getRandomTravelVideo(countryData.id)}
          onComplete={handleVideoTransitionComplete}
          destinationName={nextDestinationData?.name}
          showEyeTransition={true}
        />
      )}

      {/* Initial Eye Opening Effect - when first arriving */}
      {showInitialEyeOpening && !showVideoTransition && (
        <EyeTransition
          isClosing={false}
          onTransitionComplete={() => setShowInitialEyeOpening(false)}
        />
      )}

      {/* Panoramic Street View OR Static Image with Parallax - Full Screen */}
      <div className="absolute inset-0 w-full h-full">
        {destinationData.isAirport && countryData?.airport.useStaticImage ? (
          // Static Image with Parallax Effect for Russian Airport
          <div
            className="relative w-full h-full overflow-hidden"
            onMouseMove={(e) => {
              const { clientX, clientY } = e;
              const { innerWidth, innerHeight } = window;
              const xOffset = (clientX / innerWidth - 0.5) * 20;
              const yOffset = (clientY / innerHeight - 0.5) * 20;
              const img = e.currentTarget.querySelector('img');
              if (img) {
                (img as HTMLElement).style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1.1)`;
              }
            }}
          >
            <img
              src={countryData.airport.staticImageUrl}
              alt={countryData.airport.name}
              className="w-full h-full object-cover transition-transform duration-300 ease-out"
              style={{ transform: 'scale(1.1)' }}
            />
          </div>
        ) : (
          // Regular Street View
          <StreetViewPanorama
            coords={destinationData.streetViewCoords}
            className="w-full h-full"
            onLoad={() => console.log('Street View loaded!')}
            onError={(error) => console.error('Street View error:', error)}
          />
        )}
      </div>

      {/* Welcome Overlay - Fades out after 3 seconds */}
      {showWelcome && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent z-20 flex items-center justify-center px-4 sm:px-6 transition-opacity duration-1000"
          style={{ opacity: showWelcome ? 1 : 0 }}
        >
          <div className="text-center space-y-4 sm:space-y-5 animate-fade-in max-w-3xl mx-auto">
            <div className="text-6xl sm:text-8xl md:text-9xl animate-bounce">
              {getDestinationEmoji(destination)}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Welcome to {destinationData.name}!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-200">
              {name}, your dream has come true! 🎉
            </p>
            {destinationData.city && (
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base md:text-lg">{destinationData.city}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Audio Element for Narration */}
      <audio ref={audioRef} className="hidden" />

      {/* Bottom Info Bar - Always visible (except during modals or welcome) */}
      {!showDestinationOptions && !showCountrySelection && !showWelcome && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 sm:px-6 sm:py-6 z-10 bg-linear-to-t from-black/90 via-black/70 to-transparent">
          <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4">
            {/* Narration - Only visible while audio is playing */}
            {destinationData.narration && showNarration && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
                <p className="text-white/90 text-sm md:text-base text-center leading-relaxed">
                  {destinationData.narration}
                </p>
              </div>
            )}

            {/* Action Buttons - Mobile Responsive Grid */}
            {countryData && (
              <div className="flex flex-wrap justify-center items-center gap-2">
                {/* Next Destination in Current Country */}
                {Array.isArray(countryData.destinations) && countryData.destinations.length > 0 && (
                  <button
                    onClick={handleNextDestination}
                    className="group flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-xs md:text-sm">Next →</span>
                    <span className="text-xs hidden md:inline">
                      {countryData.destinations[(currentDestinationIndex + 1) % countryData.destinations.length]?.name}
                    </span>
                  </button>
                )}

                {/* Single Next Country Button - Always show */}
                {remainingCountries.length > 0 && (
                  <button
                    onClick={() => setShowCountrySelection(true)}
                    className="group flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-green-600/90 to-emerald-600/90 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-400/30 hover:border-green-400/60"
                  >
                    <Plane className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">Next Country</span>
                    <span className="text-xs opacity-80">({remainingCountries.length})</span>
                  </button>
                )}

                {/* View All Destinations Button - Always show */}
                <button
                  onClick={() => setShowDestinationOptions(true)}
                  className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500/90 hover:to-blue-500/90 backdrop-blur-md rounded-xl text-white border border-cyan-400/30 hover:border-cyan-400/50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className="text-xs md:text-sm font-semibold">View All</span>
                </button>

                {/* Photo Gallery Button - Only show if not at airport and has photos */}
                {!destinationData.isAirport && destinationData.id && hasPhotoBackground(destinationData.id) && (
                  <PhotoGallery
                    destinationId={destinationData.id}
                    destinationName={destinationData.name}
                  />
                )}

                {/* End Journey Button - Always show */}
                <button
                  onClick={() => router.push('/goodbye')}
                  className="px-2.5 py-2 md:px-3 md:py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl text-white/80 hover:text-white border border-white/10 hover:border-white/30 transition-all hover:scale-105"
                >
                  <span className="text-xs">End</span>
                </button>

                {/* Voice Guide Button */}
                <button
                  onClick={startListening}
                  disabled={isSpeaking}
                  className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 ${isSpeaking
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 animate-pulse'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500'
                    }`}
                >
                  {isSpeaking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  <span className="text-xs md:text-sm">{voiceStatus}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Destination Selection Modal - Shows destinations in current country */}
      {showDestinationOptions && countryData && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-white/20 max-w-4xl w-full shadow-2xl my-4">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 space-y-2 sm:space-y-3 md:space-y-4">
              <div className="text-4xl sm:text-5xl md:text-6xl">{countryData.emoji}</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Choose Your Destination
              </h2>
              <p className="text-sm sm:text-base md:text-xl text-white/80 px-4">
                Where would you like to explore in {destination}?
              </p>
            </div>

            {/* Destination Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {countryData.destinations.map((dest: any) => (
                <button
                  key={dest.id}
                  onClick={() => handleDestinationSelect(dest.id)}
                  className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                >
                  {/* Destination Real Image */}
                  <div className="w-full h-32 sm:h-36 md:h-40 rounded-lg sm:rounded-xl mb-3 sm:mb-4 overflow-hidden relative">
                    <img
                      src={getDestinationImage(dest.id)}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>

                  {/* Destination Info */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-blue-300 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">
                    {dest.city}
                  </p>
                  <p className="text-white/70 text-[10px] sm:text-xs line-clamp-2">
                    {dest.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-4 sm:mt-6 md:mt-8 text-center">
              <button
                onClick={() => setShowDestinationOptions(false)}
                className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Country Selection Modal - Shows all remaining countries */}
      {showCountrySelection && remainingCountries.length > 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-green-400/20 max-w-4xl w-full shadow-2xl my-4">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 space-y-2 sm:space-y-3 md:space-y-4">
              <div className="text-4xl sm:text-5xl md:text-6xl">✈️</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Choose Your Next Country
              </h2>
              <p className="text-sm sm:text-base md:text-xl text-white/80 px-4">
                {remainingCountries.length} {remainingCountries.length === 1 ? 'country' : 'countries'} waiting to be explored
              </p>
            </div>

            {/* Country Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {remainingCountries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => {
                    setShowCountrySelection(false);
                    handleCountrySelect(country);
                  }}
                  className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                >
                  {/* Country Flag */}
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform">
                    {country.emoji}
                  </div>

                  {/* Country Info */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                    {country.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-green-200/80 mb-2 sm:mb-3">
                    <Plane className="w-3 h-3 sm:w-4 sm:h-4" />
                    <p className="text-xs sm:text-sm">{country.airport.city}</p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-emerald-200/80">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <p className="text-xs sm:text-sm">{country.destinations.length} destinations</p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300 pointer-events-none"></div>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-4 sm:mt-6 md:mt-8 text-center">
              <button
                onClick={() => setShowCountrySelection(false)}
                className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay gradient for better contrast */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 via-transparent to-black/20 z-[5]" />
    </div>
  );
};

const DestinationPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading destination...</div>
      </div>
    }>
      <DestinationContent />
    </Suspense>
  );
};

export default DestinationPage;
