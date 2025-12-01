"use client"

import { useState } from "react"

interface PassportCoverProps {
  data: {
    fullName: string
    dateOfBirth: string
    nationality: string
    destination: string
    photo?: string
  }
  onOpen: () => void
}

export default function PassportCover({ data, onOpen }: PassportCoverProps) {
  const [isHovered, setIsHovered] = useState(false)

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

  return (
    <div className="perspective w-full max-w-lg">
      <style>{`
        @keyframes coverSlide {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .passport-cover {
          animation: coverSlide 0.8s ease-out;
        }

        .cover-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .passport-cover:hover .cover-shine {
          left: 100%;
        }
      `}</style>

      <div
        className="passport-cover relative w-full cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onOpen}
      >
        {/* Main passport cover */}
        <div className={`relative w-full bg-gradient-to-br ${passportColor.primary} rounded-lg overflow-hidden shadow-2xl border-2 border-amber-700/40 flex flex-col items-center justify-between p-8 text-center`} style={{
          aspectRatio: '9/14',
          maxHeight: '550px',
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 4px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 4px
            ),
            radial-gradient(circle at 30% 40%, ${passportColor.accent}, transparent 50%),
            radial-gradient(circle at 70% 60%, ${passportColor.secondary}, transparent 50%)
          `,
          boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Top Section - PASSPORT */}
          <div className="pt-6 space-y-3">
            <h1 className="text-4xl font-serif font-bold text-amber-100 tracking-[0.2em]" style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 1px rgba(255, 255, 255, 0.2), 0 0 12px rgba(251, 191, 36, 0.3)'
            }}>PASSPORT</h1>
            <p className="text-sm font-semibold text-amber-300 tracking-widest" style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.8), 0 0 6px rgba(251, 191, 36, 0.3)'
            }}>{countryName}</p>
          </div>

          {/* Middle Section - Globe Icon */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <svg className="w-36 h-36" viewBox="0 0 200 200" style={{
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.7))'
              }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FDE68A', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#D97706', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Outer circle - bold */}
                <circle cx="100" cy="100" r="85" fill="none" stroke="#FBBF24" strokeWidth="4.5" opacity="1"/>

                {/* Inner circle for depth */}
                <circle cx="100" cy="100" r="78" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.6"/>

                {/* Vertical meridian lines (longitude) */}
                {/* Center meridian */}
                <line x1="100" y1="15" x2="100" y2="185" stroke="#FBBF24" strokeWidth="3" opacity="0.95"/>

                {/* Left and right curved meridians */}
                <path d="M 100 15 Q 50 100 100 185" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.95"/>
                <path d="M 100 15 Q 150 100 100 185" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.95"/>

                {/* Additional meridians for grid effect */}
                <path d="M 100 15 Q 70 100 100 185" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.85"/>
                <path d="M 100 15 Q 130 100 100 185" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.85"/>

                {/* Horizontal parallel lines (latitude) */}
                {/* Equator - center horizontal */}
                <ellipse cx="100" cy="100" rx="85" ry="20" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.95"/>

                {/* Upper and lower parallels */}
                <ellipse cx="100" cy="100" rx="85" ry="45" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.9"/>
                <ellipse cx="100" cy="100" rx="85" ry="65" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.9"/>

                {/* Tropics - subtle */}
                <ellipse cx="100" cy="100" rx="85" ry="10" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.7"/>
                <ellipse cx="100" cy="100" rx="85" ry="35" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.75"/>
                <ellipse cx="100" cy="100" rx="85" ry="55" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.75"/>
                <ellipse cx="100" cy="100" rx="85" ry="75" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.8"/>
              </svg>
            </div>
          </div>

          {/* Bottom Section - Branding */}
          <div className="pb-6 space-y-3">
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-2xl font-serif font-bold text-amber-100 tracking-wider" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 1px rgba(255, 255, 255, 0.2), 0 0 10px rgba(251, 191, 36, 0.4)'
              }}>DREAM GLOBE</h3>

              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"></div>
            </div>

            <p className="text-[10px] text-amber-200/70 tracking-widest" style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
            }}>CLICK TO OPEN</p>

            <p
              className={`text-xs text-amber-200/80 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
              }}
            >
              Official Travel Document
            </p>
          </div>

          {/* Shine effect */}
          <div className="cover-shine" />
        </div>
      </div>
    </div>
  )
}
