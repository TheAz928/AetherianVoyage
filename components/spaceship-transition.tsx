"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SpaceshipTransitionProps {
  isActive: boolean
  onComplete: () => void
}

export function SpaceshipTransition({ isActive, onComplete }: SpaceshipTransitionProps) {
  const [stage, setStage] = useState<"approach" | "warp" | "complete">("approach")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    if (audioRef.current) {
      audioRef.current.volume = 0.4
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      })
    }

    // Approach stage
    const approachTimer = setTimeout(() => {
      setStage("warp")
    }, 1500)

    // Warp stage
    const warpTimer = setTimeout(() => {
      setStage("complete")
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(approachTimer)
      clearTimeout(warpTimer)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black"
        >
          <audio
            ref={audioRef}
            src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
            preload="auto"
          />

          {/* Warp speed lines */}
          {stage === "warp" && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    width: 2,
                    height: Math.random() * 150 + 100,
                    opacity: 0,
                  }}
                  animate={{
                    x: ["0%", "150%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.4,
                    delay: Math.random() * 0.3,
                    repeat: 3,
                  }}
                  className="absolute bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{
                    transform: `rotate(${Math.random() * 15 - 7.5}deg)`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Spaceship cockpit overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "approach" ? 0.5 : 0 }}
            className="absolute inset-0"
          >
            {/* Top HUD */}
            <div className="absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent border-b border-primary/20" />
            {/* Bottom HUD */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent border-t border-primary/20" />
            {/* Left HUD */}
            <div className="absolute bottom-0 left-0 top-0 w-40 bg-gradient-to-r from-black via-black/60 to-transparent border-r border-primary/20" />
            {/* Right HUD */}
            <div className="absolute bottom-0 right-0 top-0 w-40 bg-gradient-to-l from-black via-black/60 to-transparent border-l border-primary/20" />

            {/* Corner decorations */}
            <div className="absolute left-8 top-8 h-16 w-16 border-l-2 border-t-2 border-primary/40" />
            <div className="absolute right-8 top-8 h-16 w-16 border-r-2 border-t-2 border-primary/40" />
            <div className="absolute bottom-8 left-8 h-16 w-16 border-b-2 border-l-2 border-primary/40" />
            <div className="absolute bottom-8 right-8 h-16 w-16 border-b-2 border-r-2 border-primary/40" />
          </motion.div>

          {/* Center targeting reticle */}
          <motion.div
            initial={{ scale: 2, opacity: 0 }}
            animate={{
              scale: stage === "approach" ? 1 : 0.3,
              opacity: stage === "approach" ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative h-40 w-40">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-primary/50 shadow-glow"
              />
              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-4 rounded-full border-2 border-cyan-400/70"
              />
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute inset-8 rounded-full border-2 border-pink-400/70"
              />
              {/* Center crosshair */}
              <div className="absolute left-1/2 top-1/2 h-12 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-primary shadow-glow" />
              <div className="absolute left-1/2 top-1/2 h-0.5 w-12 -translate-x-1/2 -translate-y-1/2 bg-primary shadow-glow" />
              {/* Corner markers */}
              <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-primary" />
              <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-primary" />
            </div>
          </motion.div>

          {/* Status text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
          >
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="font-[family-name:var(--font-orbitron)] text-2xl font-bold text-primary glow-text-animated tracking-wider"
            >
              {stage === "approach" && "[ APPROACHING TARGET ]"}
              {stage === "warp" && "[ ENGAGING ZOOM DRIVE ]"}
              {stage === "complete" && "[ ARRIVAL COMPLETE ]"}
            </motion.p>
            {/* Progress bar */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
              className="mt-4 h-1 bg-gradient-to-r from-cyan-500 via-primary to-pink-500 shadow-glow"
            />
          </motion.div>

          {/* Vignette effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "warp" ? 0.6 : 0.3 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]"
          />

          {/* Scan lines for retro game effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
