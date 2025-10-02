"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackgroundAudio() {
    const playerRef = useRef<YT.Player | null>(null)
    const [isMuted, setIsMuted] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        document.body.appendChild(tag)

        // @ts-ignore
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new YT.Player("yt-player", {
                videoId: "C2-bLhU8Tac",
                playerVars: {
                    autoplay: 1,
                    loop: 1,
                    playlist: "C2-bLhU8Tac",
                    modestbranding: 1,
                    controls: 0,
                    mute: 1, // 🔑 allows autoplay
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(30)
                        setIsLoaded(true)
                    },
                },
            })
        }
    }, [])

    const toggleMute = () => {
        if (!playerRef.current) return
        if (isMuted) {
            playerRef.current.unMute()
            playerRef.current.playVideo()
            setIsMuted(false)
        } else {
            playerRef.current.mute()
            setIsMuted(true)
        }
    }

    return (
        <>
            {/* hidden player */}
            <div id="yt-player" className="hidden" />

            {isLoaded && (
                <Button
                    onClick={toggleMute}
                    size="icon"
                    variant="ghost"
                    className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-background/90 hover:border-primary hover:shadow-glow"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                    {isMuted ? (
                        <VolumeX className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <Volume2 className="h-5 w-5 text-primary animate-pulse" />
                    )}
                </Button>
            )}
        </>
    )
}
