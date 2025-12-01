"use client"

import { useState, useEffect, useRef } from "react"
import PassportCover from "./passport-cover"
import PassportPage from "./passport-page"

interface PassportDisplayProps {
  data: {
    fullName: string
    dateOfBirth: string
    nationality: string
    destination: string
    photo?: string
    passportId?: string
  }
  onComplete: () => void
}

export default function PassportDisplay({ data, onComplete }: PassportDisplayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showStamp, setShowStamp] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(10) // 10 seconds countdown
  const [isClosing, setIsClosing] = useState(false)
  const isClosingRef = useRef(false)
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen) {
      const stampTimer = setTimeout(() => {
        setShowStamp(true)
      }, 3000)

      // Countdown timer - update every second
      const countdownInterval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Auto-close after 10 seconds
      autoCloseTimerRef.current = setTimeout(() => {
        handleClose()
      }, 10000)

      return () => {
        clearTimeout(stampTimer)
        if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
        clearInterval(countdownInterval)
      }
    }
  }, [isOpen])

  const handleClose = () => {
    if (isClosingRef.current) return

    isClosingRef.current = true
    setIsClosing(true)

    // Clear auto-close timer if it exists (in case manual close happened first)
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current)
    }

    // Wait for close animation (0.8s), then show cover
    setTimeout(() => {
      setIsOpen(false)

      // Wait for cover to be visible (1.5s) then navigate
      setTimeout(() => {
        onComplete()
      }, 1500)
    }, 800)
  }

  const handleOpen = () => {
    // Prevent opening if we're in the closing phase
    if (isClosingRef.current) return
    setIsOpen(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-50 opacity-10 pointer-events-none" />

      {/* Countdown Timer - White Circular Loader */}
      {isOpen && (
        <div className="absolute top-8 right-8 z-30">
          <div className="relative w-20 h-20">
            {/* Background circle */}
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              {/* Background ring */}
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="white"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - timeRemaining / 10)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            {/* Time text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{timeRemaining}</p>
                <p className="text-[8px] text-white/70 -mt-1">sec</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main passport area */}
      <div className="relative z-20 flex items-center justify-center">
        {!isOpen ? (
          <PassportCover data={data} onOpen={handleOpen} />
        ) : (
          <PassportPage data={data} showStamp={showStamp} onClose={handleClose} isClosing={isClosing} />
        )}
      </div>
    </div>
  )
}
