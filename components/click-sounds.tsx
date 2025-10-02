"use client"

import { useEffect } from "react"

export function ClickSounds() {
    useEffect(() => {
        const audio = new Audio("/sound/click.wav")
        audio.volume = 0.6

        const handleClick = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest("button, a")) {
                const clickSound = audio.cloneNode() as HTMLAudioElement
                clickSound.play().catch(() => {})
            }
        }

        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    return null
}
