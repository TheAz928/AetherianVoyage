"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface HudOverlayProps {
    showCoordinates?: boolean
    coordinates?: { x: number; y: number } | null
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
                className="absolute left-2 top-28 md:left-4 md:top-32 space-y-1.5 md:space-y-2"
            >
                <div className="rounded-lg border border-primary/30 bg-background/60 px-2 py-1.5 md:px-3 md:py-2 backdrop-blur-sm">
                    <p className="font-[family-name:var(--font-orbitron)] text-[10px] md:text-xs text-primary">SYSTEM TIME</p>
                    <p className="font-mono text-xs md:text-sm text-foreground">{time.toLocaleTimeString()}</p>
                </div>

                {showCoordinates && coordinates && (
                    <div className="rounded-lg border border-primary/30 bg-background/60 px-2 py-1.5 md:px-3 md:py-2 backdrop-blur-sm">
                        <p className="font-[family-name:var(--font-orbitron)] text-[10px] md:text-xs text-primary">
                            MOUSE POSITION
                        </p>
                        <p className="font-mono text-[10px] md:text-xs text-foreground">X: {coordinates.x}</p>
                        <p className="font-mono text-[10px] md:text-xs text-foreground">Y: {coordinates.y}</p>
                    </div>
                )}

                {zoom && (
                    <div className="rounded-lg border border-primary/30 bg-background/60 px-2 py-1.5 md:px-3 md:py-2 backdrop-blur-sm">
                        <p className="font-[family-name:var(--font-orbitron)] text-[10px] md:text-xs text-primary">MAGNIFICATION</p>
                        <p className="font-mono text-xs md:text-sm text-foreground">{zoom.toFixed(2)}x</p>
                    </div>
                )}
            </motion.div>

            {/* Top right corner decorative elements */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute right-2 top-28 md:right-4 md:top-32"
            >
                <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="h-1.5 w-1.5 md:h-2 md:w-2 animate-pulse rounded-full bg-green-500" />
                    <p className="font-[family-name:var(--font-orbitron)] text-[10px] md:text-xs text-green-500">
                        SYSTEMS ONLINE
                    </p>
                </div>
            </motion.div>

            {/* Corner brackets for sci-fi feel */}
            <svg className="hidden md:block absolute left-0 top-28 h-24 w-24 text-primary/20" viewBox="0 0 100 100">
                <path d="M 0 20 L 0 0 L 20 0" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M 0 20 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M 20 0 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>

            <svg
                className="hidden md:block absolute right-0 top-28 h-24 w-24 rotate-90 text-primary/20"
                viewBox="0 0 100 100"
            >
                <path d="M 0 20 L 0 0 L 20 0" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M 0 20 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M 20 0 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>

            <svg
                className="hidden md:block absolute bottom-4 left-0 h-24 w-24 -rotate-90 text-primary/20"
                viewBox="0 0 100 100"
            >
                <path d="M 0 20 L 0 0 L 20 0" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M 0 20 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M 20 0 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>

            <svg
                className="hidden md:block absolute bottom-4 right-0 h-24 w-24 rotate-180 text-primary/20"
                viewBox="0 0 100 100"
            >
                <path d="M 0 20 L 0 0 L 20 0" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M 0 20 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M 20 0 L 20 20" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
        </div>
    )
}
