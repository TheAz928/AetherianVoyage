"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    ZoomIn,
    ZoomOut,
    Maximize2,
    Minimize2,
    Home,
    RotateCw,
    Wand2
} from "lucide-react"
import { AnnotationLayer } from "@/components/annotation-layer"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [aiProcessing, setAiProcessing] = useState(false)
    const [aiComplete, setAiComplete] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const initViewer = () => {
            if (!viewerRef.current) return

            const OpenSeadragon = (window as any).OpenSeadragon
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
                navigatorPosition: "BOTTOM_LEFT",
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

            viewerInstance.addHandler("open", () => setIsLoading(false))
            viewerInstance.addHandler("zoom", (e: any) => {
                setZoom(e.zoom)
                onZoomChange?.(e.zoom)
            })
            viewerInstance.addHandler("viewport-change", () => {
                const center = viewerInstance.viewport.getCenter()
                setViewportPosition({ x: center.x, y: center.y })
                onPositionChange?.({ x: center.x, y: center.y })
            })
            viewerInstance.addHandler("open-failed", () => setIsLoading(false))

            setViewer(viewerInstance)
            return () => viewerInstance.destroy()
        }

        if (!(window as any).OpenSeadragon) {
            const script = document.createElement("script")
            script.src = "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/openseadragon.min.js"
            script.async = true
            script.onload = initViewer
            document.head.appendChild(script)
        } else {
            initViewer()
        }
    }, [dziUrl])

    const handleZoomIn = () => viewer && viewer.viewport.zoomTo(viewer.viewport.getZoom() * 1.5)
    const handleZoomOut = () => viewer && viewer.viewport.zoomTo(viewer.viewport.getZoom() / 1.5)
    const handleHome = () => viewer && viewer.viewport.goHome()
    const handleRotate = () => viewer && viewer.viewport.setRotation((viewer.viewport.getRotation() + 90) % 360)
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const handleAIFixDemo = () => {
        setIsModalOpen(true)
        setAiProcessing(true)
        setAiComplete(false)
        setProgress(0)

        // Simulate progress over 2500ms
        const duration = 2500
        const interval = 50 // update every 50ms
        const increment = (100 / duration) * interval

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment
                if (next >= 100) {
                    clearInterval(timer)
                    setTimeout(() => {
                        setAiProcessing(false)
                        setAiComplete(true)
                    }, 200) // small delay for smooth transition
                    return 100
                }
                return next
            })
        }, interval)
    }

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement)
        document.addEventListener("fullscreenchange", handler)
        return () => document.removeEventListener("fullscreenchange", handler)
    }, [])

    return (
        <div ref={containerRef} className="relative h-full w-full">
            {/* Loading */}
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

            {/* Viewer */}
            <div ref={viewerRef} className="h-full w-full bg-black" />

            {/* Annotation Layer */}
            {!isLoading && <AnnotationLayer isActive={isAnnotationActive} zoom={zoom} position={viewportPosition} />}

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute right-4 top-32 md:top-40 z-10 flex flex-col gap-2"
            >
                <Button variant="outline" size="icon" onClick={handleZoomIn} className="border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110" title="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut} className="border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110" title="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleHome} className="border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110" title="Reset View">
                    <Home className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleRotate} className="border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110" title="Rotate 90°">
                    <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={toggleFullscreen} className="border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110" title="Toggle Fullscreen">
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAIFixDemo}
                    className="border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110"
                    title="AI Upscale & Denoise"
                >
                    <Wand2 className="h-4 w-4" />
                </Button>
            </motion.div>

            {/* Instructions */}
            {!isLoading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="pointer-events-none absolute bottom-4 left-64 z-10 max-w-xs rounded-lg border border-primary/50 bg-background/80 px-4 py-2 backdrop-blur-sm"
                >
                    <p className="text-xs text-muted-foreground">
                        Scroll to zoom • Drag to pan • Double-click to zoom in
                        {isAnnotationActive && " • Click to add annotation"}
                    </p>
                </motion.div>
            )}

            {/* AI Modal */}
            <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsModalOpen(false);
                        setAiProcessing(false);
                        setAiComplete(false);
                        setProgress(0);
                    }
                }}
            >
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>AI Upscale & Denoise</DialogTitle>
                    </DialogHeader>

                    {/* Loading State with Progress Bar */}
                    {aiProcessing && !aiComplete && (
                        <div className="flex flex-col items-center justify-center py-8 flex-1 px-4">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                <Wand2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6" />
                            </div>
                            <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                                Enhancing image with AI upscaling and denoising...
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full max-w-md">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                    <span>Processing</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground mt-4 opacity-70">
                                This may take a few seconds
                            </p>
                        </div>
                    )}

                    {/* Result State */}
                    {!aiProcessing && aiComplete && (
                        <div className="flex flex-col md:flex-row gap-6 py-4 flex-1 min-h-0 px-2">
                            {/* Original */}
                            <div className="flex-1 flex flex-col items-center">
                                <p className="text-sm font-medium text-muted-foreground mb-2">Original</p>
                                <div className="w-full flex-1 border rounded-md overflow-hidden flex items-center justify-center bg-muted/30">
                                    <img
                                        src="/ai/defect.png"
                                        alt="Original Defect Region"
                                        className="object-contain w-full h-full max-h-[60vh]"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/500x400/e2e8f0/64748b?text=Original+Image"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* AI Enhanced */}
                            <div className="flex-1 flex flex-col items-center">
                                <p className="text-sm font-medium text-muted-foreground mb-2">AI Enhanced</p>
                                <div className="w-full flex-1 border rounded-md overflow-hidden flex items-center justify-center bg-muted/30">
                                    <img
                                        src="/ai/img.png"
                                        alt="AI Enhanced Region"
                                        className="object-contain w-full h-full max-h-[60vh]"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/500x400/1e293b/94a3b8?text=Enhanced+Image"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}