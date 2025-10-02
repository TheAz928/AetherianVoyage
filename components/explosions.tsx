"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Explosion {
  id: number
  x: number
  y: number
}

export function Explosions({ frequency = 1 }: { frequency?: number }) {
  const [explosions, setExplosions] = useState<Explosion[]>([])

  useEffect(() => {
    const createExplosion = () => {
      const newExplosion: Explosion = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }

      setExplosions((prev) => [...prev, newExplosion])

      // Remove explosion after animation
      setTimeout(() => {
        setExplosions((prev) => prev.filter((exp) => exp.id !== newExplosion.id))
      }, 1500)
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        createExplosion()
      }
    }, 3000 / frequency)

    return () => clearInterval(interval)
  }, [frequency])

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      <AnimatePresence>
        {explosions.map((explosion) => (
          <motion.div
            key={explosion.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute"
            style={{
              left: explosion.x,
              top: explosion.y,
            }}
          >
            {/* Outer ring */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="h-32 w-32 rounded-full bg-gradient-radial from-orange-500/60 via-pink-500/40 to-transparent blur-md" />
            </motion.div>

            {/* Middle ring */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="h-24 w-24 rounded-full bg-gradient-radial from-yellow-400/70 via-orange-500/50 to-transparent blur-sm" />
            </motion.div>

            {/* Inner core */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 0.8 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-radial from-white via-yellow-300 to-orange-500 shadow-glow" />
            </motion.div>

            {Array.from({ length: 24 }).map((_, i) => {
              // Random angle for irregular spread
              const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
              // Random distance for organic spread
              const distance = 60 + Math.random() * 60
              // Random size for particle variety
              const size = Math.random() * 3 + 1
              // Random duration for varied velocities
              const duration = 0.8 + Math.random() * 0.6

              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  transition={{
                    duration,
                    ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for realistic motion
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 shadow-glow"
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                  }}
                />
              )
            })}

            {Array.from({ length: 16 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2
              const distance = 30 + Math.random() * 40
              const size = Math.random() * 2 + 0.5

              return (
                <motion.div
                  key={`debris-${i}`}
                  initial={{ x: 0, y: 0, opacity: 0.8 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.6 + Math.random() * 0.4,
                    ease: "easeOut",
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                />
              )
            })}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
