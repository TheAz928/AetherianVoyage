"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react"
import { Toolbar } from "@/components/toolbar"
import { MiniMap } from "@/components/mini-map"
import { AnnotationLayer } from "@/components/annotation-layer"

interface ImageViewerProps {
  dataset: string
  onBack: () => void
}

const DATASET_IMAGES: Record<string, string> = {
  earth: "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg",
  moon: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_4k.jpg",
  mars: "https://mars.nasa.gov/system/resources/detail_files/25042_PIA24546-1600.jpg",
  space: "https://stsci-opo.org/STScI-01EVVGBQJNKPXT7XF0VWPQHGKE.png",
}

export function ImageViewer({ dataset, onBack }: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isAnnotationActive, setIsAnnotationActive] = useState(false)

  const imageUrl = DATASET_IMAGES[dataset] || DATASET_IMAGES.earth

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * -0.001
    const newZoom = Math.min(Math.max(1, zoom + delta), 10)
    setZoom(newZoom)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1 && !isAnnotationActive) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1 && !isAnnotationActive) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 10))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1))
    if (zoom <= 1.5) {
      setPosition({ x: 0, y: 0 })
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleMiniMapNavigate = (x: number, y: number) => {
    setPosition({ x, y })
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [zoom])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-background">
      {/* Top Controls */}
      <div className="absolute left-0 right-0 top-16 z-20 flex items-center justify-between px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="border-primary/50 bg-background/80 backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Space
        </Button>

        <div className="rounded-lg border border-primary/50 bg-background/80 px-4 py-2 backdrop-blur-sm">
          <p className="font-[family-name:var(--font-orbitron)] text-sm font-semibold capitalize">{dataset} Dataset</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className="border-primary/50 bg-background/80 backdrop-blur-sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="min-w-[60px] rounded-lg border border-primary/50 bg-background/80 px-3 py-2 text-center text-sm backdrop-blur-sm">
            {Math.round(zoom * 100)}%
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 10}
            className="border-primary/50 bg-background/80 backdrop-blur-sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="border-primary/50 bg-background/80 backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar dataset={dataset} onAnnotationToggle={setIsAnnotationActive} />

      {/* Image Container */}
      <div
        className="flex h-full w-full items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : zoom > 1 && !isAnnotationActive ? "grab" : "default" }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        <img
          ref={imageRef}
          src={imageUrl || "/placeholder.svg"}
          alt={`${dataset} imagery`}
          className="max-h-full max-w-full select-none transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: "center center",
          }}
          onLoad={() => setImageLoaded(true)}
          draggable={false}
        />

        {/* Annotation Layer */}
        {imageLoaded && <AnnotationLayer isActive={isAnnotationActive} zoom={zoom} position={position} />}
      </div>

      {/* Mini-Map */}
      {zoom > 1 && imageLoaded && (
        <MiniMap
          imageUrl={imageUrl}
          zoom={zoom}
          position={position}
          containerSize={containerSize}
          onNavigate={handleMiniMapNavigate}
        />
      )}

      {/* Instructions */}
      {zoom === 1 && !isAnnotationActive && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg border border-primary/50 bg-background/80 px-4 py-2 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">Use mouse wheel to zoom • Click and drag to pan</p>
        </div>
      )}

      {/* Annotation Instructions */}
      {isAnnotationActive && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg border border-primary/50 bg-background/80 px-4 py-2 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">Click anywhere to add an annotation pin</p>
        </div>
      )}
    </div>
  )
}
