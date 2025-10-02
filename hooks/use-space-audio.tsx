"use client"
import { useCallback } from "react"

export function useSound(url: string, volume: number = 0.6, loop: boolean = false) {
    return useCallback(() => {
        const audio = new Audio(url)
        audio.volume = volume
        audio.loop = loop   // 🔑 enable looping
        audio.play().catch(() => {})
    }, [url, volume, loop])
}
