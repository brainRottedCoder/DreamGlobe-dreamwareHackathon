"use client"

import { useEffect, useState } from "react"

interface PassportPageProps {
  data: {
    fullName: string
    dateOfBirth: string
    nationality: string
    destination: string
    photo?: string
    passportId?: string
  }
  showStamp: boolean
  onClose: () => void
  isClosing: boolean
}

export default function PassportPage({ data, showStamp, onClose, isClosing }: PassportPageProps) {
  const [stampVisible, setStampVisible] = useState(false)
  const [stampRotation, setStampRotation] = useState(0)
  const [fadeInElements, setFadeInElements] = useState(false)

  const countryFlags: { [key: string]: string } = {
    INDIAN: "🇮🇳",
    FRENCH: "🇫🇷",
    AMERICAN: "🇺🇸",
    RUSSIAN: "🇷🇺",
    BRITISH: "🇬🇧",
    CANADIAN: "🇨🇦",
    AUSTRALIAN: "🇦🇺",
    GERMAN: "🇩🇪",
    JAPANESE: "🇯🇵",
    CHINESE: "🇨🇳",
    BRAZILIAN: "🇧🇷",
    MEXICAN: "🇲🇽",
    ITALIAN: "🇮🇹",
    SPANISH: "🇪🇸",
  }

  useEffect(() => {
    setFadeInElements(true)
  }, [])

  useEffect(() => {
    if (showStamp) {
      setStampRotation(Math.random() * 20 - 10)
      setStampVisible(true)
    }
  }, [showStamp])

  const generateDreamID = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 9; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Use passportId from data if available, otherwise generate new one
  const dreamID = data.passportId || generateDreamID()

  // Convert nationality to country name
  const getCountryName = (nationality: string): string => {
    const nationalityToCountry: { [key: string]: string } = {
      'INDIAN': 'INDIA',
      'AMERICAN': 'UNITED STATES',
      'BRITISH': 'UNITED KINGDOM',
      'FRENCH': 'FRANCE',
      'GERMAN': 'GERMANY',
      'CHINESE': 'CHINA',
      'JAPANESE': 'JAPAN',
      'RUSSIAN': 'RUSSIA',
      'CANADIAN': 'CANADA',
      'AUSTRALIAN': 'AUSTRALIA',
      'BRAZILIAN': 'BRAZIL',
      'MEXICAN': 'MEXICO',
      'ITALIAN': 'ITALY',
      'SPANISH': 'SPAIN',
      'KOREAN': 'SOUTH KOREA',
      'SAUDI': 'SAUDI ARABIA',
      'EMIRATI': 'UAE',
      'EGYPTIAN': 'EGYPT',
      'SOUTH AFRICAN': 'SOUTH AFRICA',
      'NIGERIAN': 'NIGERIA',
      'KENYAN': 'KENYA',
      'PAKISTANI': 'PAKISTAN',
      'BANGLADESHI': 'BANGLADESH',
      'INDONESIAN': 'INDONESIA',
      'THAI': 'THAILAND',
      'VIETNAMESE': 'VIETNAM',
      'FILIPINO': 'PHILIPPINES',
      'MALAYSIAN': 'MALAYSIA',
      'SINGAPOREAN': 'SINGAPORE',
      'TURKISH': 'TURKEY',
      'IRANIAN': 'IRAN',
      'IRAQI': 'IRAQ',
      'ISRAELI': 'ISRAEL',
      'POLISH': 'POLAND',
      'DUTCH': 'NETHERLANDS',
      'BELGIAN': 'BELGIUM',
      'SWISS': 'SWITZERLAND',
      'AUSTRIAN': 'AUSTRIA',
      'SWEDISH': 'SWEDEN',
      'NORWEGIAN': 'NORWAY',
      'DANISH': 'DENMARK',
      'FINNISH': 'FINLAND',
      'IRISH': 'IRELAND',
      'PORTUGUESE': 'PORTUGAL',
      'GREEK': 'GREECE',
      'CZECH': 'CZECH REPUBLIC',
      'ROMANIAN': 'ROMANIA',
      'HUNGARIAN': 'HUNGARY',
      'UKRAINIAN': 'UKRAINE',
      'ARGENTINIAN': 'ARGENTINA',
      'CHILEAN': 'CHILE',
      'COLOMBIAN': 'COLOMBIA',
      'PERUVIAN': 'PERU',
      'VENEZUELAN': 'VENEZUELA',
      'ECUADORIAN': 'ECUADOR',
      'CUBAN': 'CUBA',
      'NEW ZEALANDER': 'NEW ZEALAND',
    }

    const upperNationality = nationality.toUpperCase()
    return nationalityToCountry[upperNationality] || upperNationality
  }

  const countryName = getCountryName(data.nationality)

  // Determine passport cover color based on nationality
  const getPassportColor = (nationality: string): { primary: string, secondary: string, accent: string } => {
    const upperNationality = nationality.toUpperCase()

    // Red passports
    const redPassportCountries = [
      'CHINESE', 'RUSSIAN', 'POLISH', 'ROMANIAN', 'SERBIAN', 'SLOVENIAN',
      'CROATIAN', 'LATVIAN', 'GEORGIAN', 'PERUVIAN', 'BOLIVIAN', 'COLOMBIAN',
      'ECUADORIAN', 'VENEZUELAN', 'SWISS', 'TURKISH', 'ALBANIAN', 'MACEDONIAN'
    ]

    // Green passports
    const greenPassportCountries = [
      'MOROCCAN', 'PAKISTANI', 'SAUDI', 'NIGERIAN', 'SENEGALESE', 'MEXICAN',
      'MALIAN', 'BURKINABE', 'IVORIAN'
    ]

    // Black passports
    const blackPassportCountries = [
      'NEW ZEALANDER'
    ]

    if (redPassportCountries.includes(upperNationality)) {
      return {
        primary: 'from-red-950 via-red-900 to-red-950',
        secondary: 'rgba(153, 27, 27, 0.15)',
        accent: 'rgba(185, 28, 28, 0.1)'
      }
    } else if (greenPassportCountries.includes(upperNationality)) {
      return {
        primary: 'from-green-950 via-green-900 to-green-950',
        secondary: 'rgba(20, 83, 45, 0.15)',
        accent: 'rgba(22, 101, 52, 0.1)'
      }
    } else if (blackPassportCountries.includes(upperNationality)) {
      return {
        primary: 'from-gray-950 via-gray-900 to-gray-950',
        secondary: 'rgba(17, 24, 39, 0.15)',
        accent: 'rgba(31, 41, 55, 0.1)'
      }
    }

    // Default: Blue passports (most common)
    return {
      primary: 'from-blue-950 via-blue-900 to-blue-950',
      secondary: 'rgba(30, 58, 138, 0.15)',
      accent: 'rgba(59, 130, 246, 0.1)'
    }
  }

  const passportColor = getPassportColor(data.nationality)

  // Get interior page colors based on passport color
  const getInteriorPageColor = (nationality: string): { gradient: string, border: string, text: string } => {
    const upperNationality = nationality.toUpperCase()

    // Red passports - lighter red/cream interior
    const redPassportCountries = [
      'CHINESE', 'RUSSIAN', 'POLISH', 'ROMANIAN', 'SERBIAN', 'SLOVENIAN',
      'CROATIAN', 'LATVIAN', 'GEORGIAN', 'PERUVIAN', 'BOLIVIAN', 'COLOMBIAN',
      'ECUADORIAN', 'VENEZUELAN', 'SWISS', 'TURKISH', 'ALBANIAN', 'MACEDONIAN'
    ]

    // Green passports - lighter green/cream interior
    const greenPassportCountries = [
      'MOROCCAN', 'PAKISTANI', 'SAUDI', 'NIGERIAN', 'SENEGALESE', 'MEXICAN',
      'MALIAN', 'BURKINABE', 'IVORIAN'
    ]

    // Black passports - gray/cream interior
    const blackPassportCountries = [
      'NEW ZEALANDER'
    ]

    if (redPassportCountries.includes(upperNationality)) {
      return {
        gradient: 'from-red-50 to-orange-50',
        border: 'border-red-400/50',
        text: 'text-black'
      }
    } else if (greenPassportCountries.includes(upperNationality)) {
      return {
        gradient: 'from-green-50 to-emerald-50',
        border: 'border-green-400/50',
        text: 'text-black'
      }
    } else if (blackPassportCountries.includes(upperNationality)) {
      return {
        gradient: 'from-gray-50 to-slate-50',
        border: 'border-gray-400/50',
        text: 'text-black'
      }
    }

    // Default: Blue passports - cream/black text interior
    return {
      gradient: 'from-amber-50 to-orange-50',
      border: 'border-amber-400/50',
      text: 'text-black'
    }
  }

  const interiorPageColor = getInteriorPageColor(data.nationality)

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const issuedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  const expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="w-full max-w-5xl">
      <style>{`
        @keyframes bookOpen {
          from {
            opacity: 0;
            transform: perspective(1200px) rotateY(90deg) rotateX(0deg);
          }
          to {
            opacity: 1;
            transform: perspective(1200px) rotateY(0deg) rotateX(0deg);
          }
        }

        @keyframes bookClose {
          0% {
            opacity: 1;
            transform: perspective(1200px) scale(1) rotateX(0deg) rotateY(0deg);
          }
          40% {
            opacity: 0.9;
            transform: perspective(1200px) scale(0.95) rotateX(5deg) rotateY(0deg);
          }
          100% {
            opacity: 0;
            transform: perspective(1200px) scale(0.7) rotateX(15deg) rotateY(-20deg) translateY(50px);
          }
        }

        @keyframes fadeInStaggered {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOutElements {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes stampSlam {
          0% {
            opacity: 0;
            transform: translate(-40%, -50%) scale(1.3) rotate(-30deg);
          }
          70% {
            transform: translate(-40%, -50%) scale(0.9) rotate(var(--stamp-rotation));
          }
          100% {
            opacity: 1;
            transform: translate(-40%, -50%) scale(1) rotate(var(--stamp-rotation));
          }
        }

        .book-container {
          animation: ${isClosing ? 'bookClose' : 'bookOpen'} ${isClosing ? '0.8s' : '0.9s'} cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .fade-in-element {
          opacity: ${isClosing ? 0 : (fadeInElements ? 1 : 0)};
          transform: translateY(${fadeInElements ? 0 : 8}px);
          transition: all ${isClosing ? '0.3s' : '0.6s'} ease-out;
        }

        .fade-in-1 { transition-delay: ${isClosing ? '0s' : '0.4s'}; }
        .fade-in-2 { transition-delay: ${isClosing ? '0s' : '0.6s'}; }
        .fade-in-3 { transition-delay: ${isClosing ? '0s' : '0.8s'}; }
        .fade-in-4 { transition-delay: ${isClosing ? '0s' : '1s'}; }
        .fade-in-5 { transition-delay: ${isClosing ? '0s' : '1.2s'}; }

        .stamp-container {
          --stamp-rotation: ${stampRotation}deg;
          animation: stampSlam 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <div
        id="passport-content"
        className="book-container grid grid-cols-2 gap-0 bg-amber-50 rounded-lg shadow-2xl overflow-hidden border border-amber-200 relative w-full max-w-5xl mx-auto"
        style={{ aspectRatio: '18/14', maxHeight: '90vh' }}
      >
        {/* LEFT PAGE - Cover Interior */}
        <div className={`bg-gradient-to-br ${passportColor.primary} p-3 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-between items-center text-center border-r-2 border-slate-300`} style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.15) 2px,
              rgba(0, 0, 0, 0.15) 4px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.15) 2px,
              rgba(0, 0, 0, 0.15) 4px
            ),
            radial-gradient(circle at 30% 40%, ${passportColor.accent}, transparent 50%),
            radial-gradient(circle at 70% 60%, ${passportColor.secondary}, transparent 50%)
          `,
          boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Top Section - PASSPORT */}
          <div className="pt-2 sm:pt-4 md:pt-6 space-y-1 sm:space-y-2 md:space-y-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-amber-100 tracking-[0.2em]" style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 1px rgba(255, 255, 255, 0.2), 0 0 12px rgba(251, 191, 36, 0.3)'
            }}>PASSPORT</h1>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-amber-300 tracking-widest" style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.8), 0 0 6px rgba(251, 191, 36, 0.3)'
            }}>{countryName}</p>
          </div>

          {/* Middle Section - Globe Icon */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <svg className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36" viewBox="0 0 200 200" style={{
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.7))'
              }}>
                <defs>
                  <linearGradient id="goldGradientInterior" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FDE68A', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#D97706', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Outer circle - bold */}
                <circle cx="100" cy="100" r="85" fill="none" stroke="#FBBF24" strokeWidth="4.5" opacity="1" />

                {/* Inner circle for depth */}
                <circle cx="100" cy="100" r="78" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.6" />

                {/* Vertical meridian lines (longitude) */}
                {/* Center meridian */}
                <line x1="100" y1="15" x2="100" y2="185" stroke="#FBBF24" strokeWidth="3" opacity="0.95" />

                {/* Left and right curved meridians */}
                <path d="M 100 15 Q 50 100 100 185" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.95" />
                <path d="M 100 15 Q 150 100 100 185" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.95" />

                {/* Additional meridians for grid effect */}
                <path d="M 100 15 Q 70 100 100 185" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.85" />
                <path d="M 100 15 Q 130 100 100 185" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.85" />

                {/* Horizontal parallel lines (latitude) */}
                {/* Equator - center horizontal */}
                <ellipse cx="100" cy="100" rx="85" ry="20" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.95" />

                {/* Upper and lower parallels */}
                <ellipse cx="100" cy="100" rx="85" ry="45" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.9" />
                <ellipse cx="100" cy="100" rx="85" ry="65" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.9" />

                {/* Tropics - subtle */}
                <ellipse cx="100" cy="100" rx="85" ry="10" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.7" />
                <ellipse cx="100" cy="100" rx="85" ry="35" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.75" />
                <ellipse cx="100" cy="100" rx="85" ry="55" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.75" />
                <ellipse cx="100" cy="100" rx="85" ry="75" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.8" />
              </svg>
            </div>
          </div>

          {/* Bottom Section - Branding */}
          <div className="pb-2 sm:pb-4 md:pb-6 space-y-1 sm:space-y-2 md:space-y-3">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-amber-100 tracking-wider" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 1px rgba(255, 255, 255, 0.2), 0 0 10px rgba(251, 191, 36, 0.4)'
              }}>DREAM GLOBE</h3>

              <div className="h-px w-20 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"></div>
            </div>

            <p className="text-[8px] sm:text-[9px] md:text-[10px] text-amber-200/70 tracking-widest" style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
            }}>OFFICIAL DOCUMENT</p>

            <p className="text-[10px] sm:text-[11px] md:text-xs text-amber-200/80" style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
            }}>Valid Indefinitely</p>
          </div>
        </div>

        {/* RIGHT PAGE - Main Details */}
        <div className={`bg-gradient-to-b ${interiorPageColor.gradient} p-3 sm:p-6 md:p-8 lg:p-12 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8`}>
          {/* Header */}
          <div className={`fade-in-element fade-in-1 text-center space-y-1 sm:space-y-2 border-b-2 ${interiorPageColor.border} pb-2 sm:pb-3 md:pb-4`}>
            <p className={`text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold ${interiorPageColor.text} tracking-widest`}>PERSONAL INFORMATION</p>
            <h1 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold ${interiorPageColor.text}`}>PASSPORT</h1>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Photo */}
            <div className="fade-in-element fade-in-2 col-span-1 flex flex-col items-center space-y-1 sm:space-y-2">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-slate-300 rounded-full border-2 sm:border-3 md:border-4 border-amber-900 flex items-center justify-center overflow-hidden shadow-md`}>
                {data.photo ? (
                  <img
                    src={data.photo}
                    alt="Passport photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl md:text-3xl">📷</span>
                )}
              </div>
              <p className={`text-[6px] sm:text-[7px] md:text-[8px] font-bold ${interiorPageColor.text} tracking-widest`}>PHOTO</p>
            </div>

            {/* Details */}
            <div className="fade-in-element fade-in-3 col-span-1 sm:col-span-2 space-y-2 sm:space-y-3 md:space-y-4">
              {/* Name */}
              <div>
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-700 tracking-wider mb-1">SURNAME / GIVEN NAMES</p>
                <p className={`text-xs sm:text-sm md:text-base font-serif font-bold ${interiorPageColor.text} uppercase`}>{data.fullName}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div>
                  <p className="text-[7px] sm:text-[8px] font-bold text-gray-700 tracking-wider mb-1">DATE OF BIRTH</p>
                  <p className={`text-[10px] sm:text-[11px] md:text-xs font-mono ${interiorPageColor.text}`}>{formatDate(data.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-[7px] sm:text-[8px] font-bold text-gray-700 tracking-wider mb-1">NATIONALITY</p>
                  <p className={`text-[10px] sm:text-[11px] md:text-xs font-mono ${interiorPageColor.text}`}>
                    {countryFlags[data.nationality.toUpperCase()] || '🌍'} {data.nationality}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Destination - with stamp */}
          <div className={`fade-in-element fade-in-4 border-y-2 ${interiorPageColor.border} py-2 sm:py-3 relative`}>
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-1 sm:space-y-2 flex-1 text-center sm:text-left">
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-700 tracking-widest">AUTHORIZED DESTINATION</p>
                <p className={`text-sm sm:text-base md:text-lg font-serif font-bold ${interiorPageColor.text} uppercase`}>{data.destination}</p>
              </div>

              {/* Stamp - Next to destination */}
              {stampVisible && (
                <div className="stamp-container pointer-events-none w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[90px] lg:h-[90px] flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: `rotate(${stampRotation}deg)` }}>
                    {/* Outer circle */}
                    <circle cx="60" cy="60" r="55" fill="none" stroke="#1e3a8a" strokeWidth="2.5" opacity="0.85" />
                    {/* Inner circle */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.6" />

                    {/* Destination text on top arc */}
                    <defs>
                      <path id="topArc" d="M 20,60 A 40,40 0 0,1 100,60" fill="none" />
                    </defs>
                    <text fill="#1e3a8a" fontSize="10" fontWeight="bold" opacity="0.85" letterSpacing="1">
                      <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                        {data.destination.toUpperCase()}
                      </textPath>
                    </text>

                    {/* Center checkmark */}
                    <text
                      x="60"
                      y="65"
                      textAnchor="middle"
                      className="font-bold"
                      fill="#1e3a8a"
                      opacity="0.85"
                      style={{ fontSize: "32px", fontWeight: "bold" }}
                    >
                      ✓
                    </text>

                    {/* "DEPARTURE" text on bottom arc */}
                    <defs>
                      <path id="bottomArc2" d="M 100,60 A 40,40 0 0,1 20,60" fill="none" />
                    </defs>
                    <text fill="#1e3a8a" fontSize="10" fontWeight="bold" opacity="0.85" letterSpacing="1">
                      <textPath href="#bottomArc2" startOffset="50%" textAnchor="middle">
                        DEPARTURE
                      </textPath>
                    </text>

                    {/* Date at bottom center */}
                    <text
                      x="60"
                      y="110"
                      textAnchor="middle"
                      className="font-bold"
                      fill="#1e3a8a"
                      opacity="0.75"
                      style={{ fontSize: "8px", fontWeight: "bold", letterSpacing: "0.5px" }}
                    >
                      {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                    </text>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Footer Details */}
          <div className="fade-in-element fade-in-5 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center text-[10px] sm:text-[11px] md:text-xs">
            <div>
              <p className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-gray-700 tracking-widest mb-1">PASSPORT ID</p>
              <p className={`font-mono text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs ${interiorPageColor.text}`}>{dreamID}</p>
            </div>
            <div>
              <p className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-gray-700 tracking-widest mb-1">ISSUED</p>
              <p className={`text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs ${interiorPageColor.text}`}>{issuedDate}</p>
            </div>
            <div>
              <p className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-gray-700 tracking-widest mb-1">EXPIRES</p>
              <p className={`text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs ${interiorPageColor.text}`}>{expiryDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 md:mt-8 flex justify-center px-4">
        <button
          onClick={onClose}
          disabled={isClosing}
          className={`bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg transition shadow-lg text-sm sm:text-base w-full sm:w-auto ${isClosing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isClosing ? 'Closing...' : 'Close Passport'}
        </button>
      </div>
    </div>
  )
}
