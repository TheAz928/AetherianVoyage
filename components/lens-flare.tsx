"use client"

import { useEffect, useState } from "react"

interface FlarePosition {
    x: number
    y: number
    opacity: number
}

interface LensFlareProps {
    maxFlares?: number
    size?: number
    minDelay?: number
    maxDelay?: number
}

export function LensFlare({
                              maxFlares = 5,
                              size = 1,
                              minDelay = 3000,
                              maxDelay = 6000,
                          }: LensFlareProps) {
    const [flares, setFlares] = useState<FlarePosition[]>([])

    useEffect(() => {
        let timeout: NodeJS.Timeout

        const createFlare = () => {
            const newFlare: FlarePosition = {
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: Math.random() * 0.6 + 0.2,
            }

            setFlares((prev) => {
                const updated = [...prev, newFlare]
                if (updated.length > maxFlares) {
                    updated.shift()
                }
                return updated
            })

            // Remove flare after animation
            setTimeout(() => {
                setFlares((prev) => prev.slice(1))
            }, 3000)

            // Schedule next flare with random delay
            const nextDelay =
                Math.random() * (maxDelay - minDelay) + minDelay
            timeout = setTimeout(createFlare, nextDelay)
        }

        createFlare() // initial flare

        return () => clearTimeout(timeout)
    }, [maxFlares, minDelay, maxDelay])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {flares.map((flare, i) => (
                <div
                    key={i}
                    className="absolute animate-pulse"
                    style={{
                        left: `${flare.x}%`,
                        top: `${flare.y}%`,
                        opacity: flare.opacity,
                        animation: "flare 3s ease-out forwards",
                    }}
                >
                    {/* Main flare */}
                    <div className="relative">
                        <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-cyan-400/40 via-blue-500/20 to-transparent blur-xl"
                            style={{ width: 32 * size, height: 32 * size }}
                        />
                        <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-white/60 via-cyan-300/30 to-transparent blur-md"
                            style={{ width: 20 * size, height: 20 * size }}
                        />
                        <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                            style={{ width: 2 * size, height: 2 * size }}
                        />
                    </div>

                    {/* Secondary flares */}
                    <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/30 blur-md"
                        style={{ left: 30 * size, top: 20 * size, width: 8 * size, height: 8 * size }}
                    />
                    <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/30 blur-md"
                        style={{ left: -20 * size, top: 15 * size, width: 6 * size, height: 6 * size }}
                    />
                </div>
            ))}

            <style jsx>{`
                @keyframes flare {
                    0% {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    20% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(1.5);
                    }
                }
            `}</style>
        </div>
    )
}
