"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface HudOverlayProps {
  showCoordinates?: boolean
  coordinates?: { x: number; y: number }
  zoom?: number
}

export function HudOverlay({ showCoordinates = false, coordinates, zoom }: HudOverlayProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Top left corner HUD */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute left-4 top-20 space-y-2"
      >
        <div className="rounded-lg border border-primary/30 bg-background/60 px-3 py-2 backdrop-blur-sm">
          <p className="font-[family-name:var(--font-orbitron)] text-xs text-primary">SYSTEM TIME</p>
          <p className="font-mono text-sm text-foreground">{time.toLocaleTimeString()}</p>
        </div>

        {showCoordinates && coordinates && (
          <div className="rounded-lg border border-primary/30 bg-background/60 px-3 py-2 backdrop-blur-sm">
            <p className="font-[family-name:var(--font-orbitron)] text-xs text-primary">COORDINATES</p>
            <p className="font-mono text-xs text-foreground">X: {coordinates.x.toFixed(4)}</p>
            <p className="font-mono text-xs text-foreground">Y: {coordinates.y.toFixed(4)}</p>
          </div>
        )}

        {zoom && (
          <div className="rounded-lg border border-primary/30 bg-background/60 px-3 py-2 backdrop-blur-sm">
            <p className="font-[family-name:var(--font-orbitron)] text-xs text-primary">MAGNIFICATION</p>
            <p className="font-mono text-sm text-foreground">{zoom.toFixed(2)}x</p>
          </div>
        )}
      </motion.div>

      {/* Top right corner decorative elements */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute right-4 top-20"
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <p className="font-[family-name:var(--font-orbitron)] text-xs text-green-500">SYSTEMS ONLINE</p>
        </div>
      </motion.div>

      {/* Corner brackets for sci-fi feel */}
      <svg className="absolute left-0 top-16 h-24 w-24 text-primary/20" viewBox="0 0 100 100">
        <path d="M 0 20 L 0 0 L 20 0" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 0 20 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 20 0 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      <svg className="absolute right-0 top-16 h-24 w-24 rotate-90 text-primary/20" viewBox="0 0 100 100">
        <path d="M 0 20 L 0 0 L 20 0" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 0 20 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 20 0 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      <svg className="absolute bottom-4 left-0 h-24 w-24 -rotate-90 text-primary/20" viewBox="0 0 100 100">
        <path d="M 0 20 L 0 0 L 20 0" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 0 20 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 20 0 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      <svg className="absolute bottom-4 right-0 h-24 w-24 rotate-180 text-primary/20" viewBox="0 0 100 100">
        <path d="M 0 20 L 0 0 L 20 0" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 0 20 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 20 0 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}
