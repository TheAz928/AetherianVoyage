"use client"

import type React from "react"

import { useRef, useEffect } from "react"

interface MiniMapProps {
    imageUrl: string
    zoom: number
    position: { x: number; y: number }
    containerSize: { width: number; height: number }
    onNavigate: (x: number, y: number) => void
}

export function MiniMap({ imageUrl, zoom, position, containerSize, onNavigate }: MiniMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Load image if not already loaded
        if (!imageRef.current) {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.src = imageUrl
            img.onload = () => {
                imageRef.current = img
                drawMiniMap()
            }
        } else {
            drawMiniMap()
        }

        function drawMiniMap() {
            if (!ctx || !canvas || !imageRef.current) return

            const img = imageRef.current
            const miniMapWidth = 200
            const miniMapHeight = 150

            // Clear canvas
            ctx.clearRect(0, 0, miniMapWidth, miniMapHeight)

            // Draw thumbnail
            ctx.drawImage(img, 0, 0, miniMapWidth, miniMapHeight)

            // Calculate viewport rectangle
            const viewportWidth = (containerSize.width / zoom) * (miniMapWidth / containerSize.width)
            const viewportHeight = (containerSize.height / zoom) * (miniMapHeight / containerSize.height)

            const viewportX =
                miniMapWidth / 2 - (position.x / zoom) * (miniMapWidth / containerSize.width) - viewportWidth / 2
            const viewportY =
                miniMapHeight / 2 - (position.y / zoom) * (miniMapHeight / containerSize.height) - viewportHeight / 2

            // Draw viewport rectangle
            ctx.strokeStyle = "#9B59B6"
            ctx.lineWidth = 2
            ctx.strokeRect(
                Math.max(0, Math.min(viewportX, miniMapWidth - viewportWidth)),
                Math.max(0, Math.min(viewportY, miniMapHeight - viewportHeight)),
                Math.min(viewportWidth, miniMapWidth),
                Math.min(viewportHeight, miniMapHeight),
            )

            // Draw semi-transparent overlay outside viewport
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
            ctx.fillRect(0, 0, miniMapWidth, miniMapHeight)
            ctx.clearRect(
                Math.max(0, Math.min(viewportX, miniMapWidth - viewportWidth)),
                Math.max(0, Math.min(viewportY, miniMapHeight - viewportHeight)),
                Math.min(viewportWidth, miniMapWidth),
                Math.min(viewportHeight, miniMapHeight),
            )

            // Redraw the viewport area
            ctx.drawImage(
                img,
                Math.max(0, Math.min(viewportX, miniMapWidth - viewportWidth)) * (img.width / miniMapWidth),
                Math.max(0, Math.min(viewportY, miniMapHeight - viewportHeight)) * (img.height / miniMapHeight),
                Math.min(viewportWidth, miniMapWidth) * (img.width / miniMapWidth),
                Math.min(viewportHeight, miniMapHeight) * (img.height / miniMapHeight),
                Math.max(0, Math.min(viewportX, miniMapWidth - viewportWidth)),
                Math.max(0, Math.min(viewportY, miniMapHeight - viewportHeight)),
                Math.min(viewportWidth, miniMapWidth),
                Math.min(viewportHeight, miniMapHeight),
            )

            // Draw viewport border again
            ctx.strokeStyle = "#9B59B6"
            ctx.lineWidth = 2
            ctx.strokeRect(
                Math.max(0, Math.min(viewportX, miniMapWidth - viewportWidth)),
                Math.max(0, Math.min(viewportY, miniMapHeight - viewportHeight)),
                Math.min(viewportWidth, miniMapWidth),
                Math.min(viewportHeight, miniMapHeight),
            )
        }
    }, [imageUrl, zoom, position, containerSize])

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Convert minimap coordinates to image coordinates
        const imageX = (x / 200) * containerSize.width - containerSize.width / 2
        const imageY = (y / 150) * containerSize.height - containerSize.height / 2

        onNavigate(imageX * zoom, imageY * zoom)
    }

    return (
        <div className="absolute bottom-4 left-4 z-20 rounded-lg border-2 border-primary/50 bg-background/95 p-3 backdrop-blur-sm">
            <p className="mb-2 text-center text-xs font-medium text-foreground">Mini-Map Navigator</p>
            <canvas ref={canvasRef} width={200} height={150} className="cursor-pointer rounded" onClick={handleClick} />
        </div>
    )
}