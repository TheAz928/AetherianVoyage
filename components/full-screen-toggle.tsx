"use client"

import { useState, useEffect } from "react"
import { Maximize, Minimize } from "lucide-react"

export function FullscreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener("fullscreenchange", handleChange)
        return () => document.removeEventListener("fullscreenchange", handleChange)
    }, [])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error("Failed to enable fullscreen:", err)
            })
        } else {
            document.exitFullscreen().catch((err) => {
                console.error("Failed to exit fullscreen:", err)
            })
        }
    }

    return (
        <button
            onClick={toggleFullscreen}
            className="ml-2 rounded px-2 py-1 text-sm hover:bg-muted/30 transition"
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
    )
}
