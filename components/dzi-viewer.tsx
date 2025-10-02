"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Home, RotateCw } from "lucide-react"
import { AnnotationLayer } from "@/components/annotation-layer"
import { motion } from "framer-motion"

interface DziViewerProps {
  dziUrl: string
  imageName: string
  onAnnotationToggle?: (active: boolean) => void
  isAnnotationActive?: boolean
  onZoomChange?: (zoom: number) => void
  onPositionChange?: (position: { x: number; y: number }) => void
}

export function DziViewer({
  dziUrl,
  imageName,
  onAnnotationToggle,
  isAnnotationActive = false,
  onZoomChange,
  onPositionChange,
}: DziViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewer, setViewer] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Dynamically import OpenSeadragon only on client side
    const initViewer = async () => {
      if (!viewerRef.current) return

      try {
        // @ts-ignore - OpenSeadragon will be loaded via CDN
        const OpenSeadragon = window.OpenSeadragon

        if (!OpenSeadragon) {
          console.error("OpenSeadragon not loaded")
          return
        }

        const viewerInstance = OpenSeadragon({
          element: viewerRef.current,
          prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
          tileSources: dziUrl,
          showNavigationControl: false,
          showNavigator: true,
          navigatorPosition: "BOTTOM_RIGHT",
          navigatorSizeRatio: 0.15,
          navigatorBackground: "rgba(0, 0, 0, 0.8)",
          navigatorBorderColor: "rgba(139, 92, 246, 0.5)",
          animationTime: 0.5,
          blendTime: 0.1,
          constrainDuringPan: true,
          maxZoomPixelRatio: 2,
          minZoomLevel: 0.8,
          visibilityRatio: 1,
          zoomPerScroll: 1.2,
          gestureSettingsMouse: {
            clickToZoom: false,
            dblClickToZoom: true,
          },
        })

        viewerInstance.addHandler("open", () => {
          setIsLoading(false)
          console.log("DZI image loaded successfully")
        })

        viewerInstance.addHandler("zoom", (event: any) => {
          setZoom(event.zoom)
          onZoomChange?.(event.zoom)
        })

        viewerInstance.addHandler("viewport-change", () => {
          const viewport = viewerInstance.viewport
          const center = viewport.getCenter()
          const position = { x: center.x, y: center.y }
          setViewportPosition(position)
          onPositionChange?.(position)
        })

        viewerInstance.addHandler("open-failed", (event: any) => {
          console.error("Failed to open DZI:", event)
          setIsLoading(false)
        })

        setViewer(viewerInstance)

        return () => {
          viewerInstance.destroy()
        }
      } catch (error) {
        console.error("Error initializing OpenSeadragon:", error)
        setIsLoading(false)
      }
    }

    // Load OpenSeadragon from CDN
    if (!document.getElementById("openseadragon-script")) {
      const script = document.createElement("script")
      script.id = "openseadragon-script"
      script.src = "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/openseadragon.min.js"
      script.async = true
      script.onload = () => {
        console.log("OpenSeadragon loaded from CDN")
        initViewer()
      }
      document.head.appendChild(script)
    } else {
      initViewer()
    }
  }, [dziUrl])

  const handleZoomIn = () => {
    if (viewer) {
      const currentZoom = viewer.viewport.getZoom()
      viewer.viewport.zoomTo(currentZoom * 1.5)
    }
  }

  const handleZoomOut = () => {
    if (viewer) {
      const currentZoom = viewer.viewport.getZoom()
      viewer.viewport.zoomTo(currentZoom / 1.5)
    }
  }

  const handleHome = () => {
    if (viewer) {
      viewer.viewport.goHome()
    }
  }

  const handleRotate = () => {
    if (viewer) {
      const currentRotation = viewer.viewport.getRotation()
      viewer.viewport.setRotation(currentRotation + 90)
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading gigapixel image...</p>
          </div>
        </motion.div>
      )}

      {/* DZI Viewer Container */}
      <div ref={viewerRef} className="h-full w-full bg-black" />

      {!isLoading && <AnnotationLayer isActive={isAnnotationActive} zoom={zoom} position={viewportPosition} />}

      {/* Zoom Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute right-4 top-4 z-10 flex flex-col gap-2"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="border-primary/50 bg-background/80 backdrop-blur-sm transition-all hover:scale-110"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="border-primary/50 bg-background/80 backdrop-blur-sm transition-all hover:scale-110"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleHome}
          className="border-primary/50 bg-background/80 backdrop-blur-sm transition-all hover:scale-110"
          title="Reset View"
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRotate}
          className="border-primary/50 bg-background/80 backdrop-blur-sm transition-all hover:scale-110"
          title="Rotate 90°"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="border-primary/50 bg-background/80 backdrop-blur-sm transition-all hover:scale-110"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </motion.div>

      {/* Instructions */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="pointer-events-none absolute bottom-4 right-4 z-10 max-w-xs rounded-lg border border-primary/50 bg-background/80 px-4 py-2 backdrop-blur-sm"
        >
          <p className="text-xs text-muted-foreground">
            Scroll to zoom • Drag to pan • Double-click to zoom in
            {isAnnotationActive && " • Click to add annotation"}
          </p>
        </motion.div>
      )}
    </div>
  )
}
