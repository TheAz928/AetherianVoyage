"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Home, RotateCw, Wand2 } from "lucide-react"
import { AnnotationLayer } from "@/components/annotation-layer"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DziViewerProps {
    dziUrl: string
    imageName: string
    onAnnotationToggle?: (active: boolean) => void
    isAnnotationActive?: boolean
    onZoomChange?: (zoom: number) => void
    onPositionChange?: (position: { x: number; y: number }) => void
    onCursorPositionChange?: (pos: { x: number; y: number } | null) => void
}

interface HighlightedRegion {
    name: string
    x: number
    y: number
}

export function DziViewer({
                              dziUrl,
                              imageName,
                              onAnnotationToggle,
                              isAnnotationActive = false,
                              onZoomChange,
                              onPositionChange,
                              onCursorPositionChange,
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
    const [showKnownLabels, setShowKnownLabels] = useState(false)
    const [imageWidth, setImageWidth] = useState<number | null>(null)
    const [imageHeight, setImageHeight] = useState<number | null>(null)
    const [highlightedRegion, setHighlightedRegion] = useState<HighlightedRegion | null>(null)
    const animationFinishHandlerRef = useRef<((e: any) => void) | null>(null)

    const AEOLIS_IMAGE_WIDTH = 26674
    const AEOLIS_IMAGE_HEIGHT = 17783
    const AEOLIS_REGIONS = [
        { name: "Gale Crater", x: 1450, y: 2895, zoom: 8 }
    ]
    const isAeolisImage = dziUrl.toLowerCase().includes("mars")

    const navigateToRegion = (pixelX: number, pixelY: number, regionName: string, targetZoom: number) => {
        if (!viewer) return
        const tiledImage = viewer.world.getItemAt(0)
        if (!tiledImage) return
        if (pixelX < 0 || pixelX > AEOLIS_IMAGE_WIDTH || pixelY < 0 || pixelY > AEOLIS_IMAGE_HEIGHT) return

        setHighlightedRegion(null)

        if (animationFinishHandlerRef.current) {
            viewer.removeHandler("animation-finish", animationFinishHandlerRef.current)
        }

        const onAnimationFinish = () => {
            setHighlightedRegion({
                name: regionName,
                x: pixelX,
                y: pixelY,
            })
            setTimeout(() => {
                setHighlightedRegion((prev) => prev?.name === regionName ? null : prev)
            }, 4000)
            viewer.removeHandler("animation-finish", onAnimationFinish)
            animationFinishHandlerRef.current = null
        }

        animationFinishHandlerRef.current = onAnimationFinish
        viewer.addHandler("animation-finish", onAnimationFinish)

        const viewportPoint = tiledImage.imageToViewportCoordinates(pixelX, pixelY)
        viewer.viewport.zoomTo(targetZoom, viewportPoint, true)
    }

    useEffect(() => {
        if (!viewer) return

        const updateHighlightPosition = () => {
            setHighlightedRegion(prev => prev)
        }

        viewer.addHandler("animation", updateHighlightPosition)
        viewer.addHandler("zoom", updateHighlightPosition)
        viewer.addHandler("pan", updateHighlightPosition)

        return () => {
            viewer.removeHandler("animation", updateHighlightPosition)
            viewer.removeHandler("zoom", updateHighlightPosition)
            viewer.removeHandler("pan", updateHighlightPosition)
        }
    }, [viewer])

    useEffect(() => {
        const initViewer = () => {
            if (!viewerRef.current) return
            const OpenSeadragon = (window as any).OpenSeadragon
            if (!OpenSeadragon) {
                console.error("OpenSeadragon not loaded")
                return
            }

            const imageAspectRatio = AEOLIS_IMAGE_WIDTH / AEOLIS_IMAGE_HEIGHT
            const maxNavigatorWidth = 250
            const maxNavigatorHeight = 200
            let navigatorWidth = maxNavigatorWidth
            let navigatorHeight = maxNavigatorWidth / imageAspectRatio
            if (navigatorHeight > maxNavigatorHeight) {
                navigatorHeight = maxNavigatorHeight
                navigatorWidth = maxNavigatorHeight * imageAspectRatio
            }

            const viewerInstance = OpenSeadragon({
                element: viewerRef.current,
                prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
                tileSources: dziUrl,
                showNavigationControl: false,
                showNavigator: true,
                navigatorPosition: "BOTTOM_LEFT",
                navigatorHeight: navigatorHeight,
                navigatorWidth: navigatorWidth,
                navigatorBackground: "rgba(0, 0, 0, 0.8)",
                navigatorBorderColor: "rgba(239, 68, 68, 0.8)",
                navigatorDisplayRegionColor: "rgba(239, 68, 68, 0.4)",
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
                const tiledImage = viewerInstance.world.getItemAt(0)
                if (tiledImage) {
                    const width = tiledImage.source.dimensions.x
                    const height = tiledImage.source.dimensions.y
                    setImageWidth(width)
                    setImageHeight(height)
                }
            })

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
            return () => {
                if (animationFinishHandlerRef.current && viewerInstance) {
                    viewerInstance.removeHandler("animation-finish", animationFinishHandlerRef.current)
                }
                viewerInstance.destroy()
            }
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
    }, [dziUrl, onZoomChange, onPositionChange])

    useEffect(() => {
        if (!viewer) return
        const element = viewerRef.current
        if (!element) return

        const handleMouseMove = (e: MouseEvent) => {
            if (!viewer || !viewer.viewport) return
            const tiledImage = viewer.world.getItemAt(0)
            if (!tiledImage) return
            const rect = element.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const point = new (window as any).OpenSeadragon.Point(x, y)
            const viewportPoint = viewer.viewport.pointFromPixel(point)
            const imagePoint = tiledImage.viewportToImageCoordinates(viewportPoint.x, viewportPoint.y)
            const pos = {
                x: Math.max(0, Math.min(AEOLIS_IMAGE_WIDTH, Math.round(imagePoint.x))),
                y: Math.max(0, Math.min(AEOLIS_IMAGE_HEIGHT, Math.round(imagePoint.y))),
            }
            onCursorPositionChange?.(pos)
        }

        const handleMouseLeave = () => {
            onCursorPositionChange?.(null)
        }

        element.addEventListener("mousemove", handleMouseMove)
        element.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            element.removeEventListener("mousemove", handleMouseMove)
            element.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [viewer, onCursorPositionChange])

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
        const duration = 2500
        const interval = 50
        const increment = (100 / duration) * interval
        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment
                if (next >= 100) {
                    clearInterval(timer)
                    setTimeout(() => {
                        setAiProcessing(false)
                        setAiComplete(true)
                    }, 200)
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

    const getHighlightPosition = () => {
        if (!viewer || !highlightedRegion) return { x: 0, y: 0 }
        const tiledImage = viewer.world.getItemAt(0)
        if (!tiledImage) return { x: 0, y: 0 }
        try {
            const viewportPoint = tiledImage.imageToViewportCoordinates(highlightedRegion.x, highlightedRegion.y)
            const pixelPoint = viewer.viewport.pixelFromPoint(viewportPoint, true)
            return { x: pixelPoint.x, y: pixelPoint.y }
        } catch (error) {
            return { x: 0, y: 0 }
        }
    }

    const highlightPos = getHighlightPosition()

    return (
        <div ref={containerRef} className="relative h-full w-full">
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

            <div ref={viewerRef} className="h-full w-full bg-black" />

            {isAeolisImage && !isLoading && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm border border-primary/40 rounded-lg p-2 md:p-3 max-w-[280px] md:max-w-md shadow-lg"
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs md:text-sm font-semibold text-primary">Known Labels</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 md:h-6 md:w-6 p-0 text-xs"
                            onClick={() => setShowKnownLabels(!showKnownLabels)}
                        >
                            {showKnownLabels ? "−" : "+"}
                        </Button>
                    </div>
                    {showKnownLabels && (
                        <div className="space-y-1 md:space-y-1.5">
                            {AEOLIS_REGIONS.map((region, idx) => (
                                <div key={idx} className="flex flex-col gap-0.5">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto justify-start p-1.5 text-xs text-left hover:bg-primary/10 w-full"
                                        onClick={() => navigateToRegion(region.x, region.y, region.name, region.zoom)}
                                    >
                                        <span className="font-medium">{region.name}</span>
                                    </Button>
                                    <div className="px-1.5 pb-1 text-[10px] md:text-xs text-muted-foreground font-mono">
                                        <span className="text-primary/80">X:</span> {region.x.toLocaleString()}
                                        <span className="mx-1">•</span>
                                        <span className="text-primary/80">Y:</span> {region.y.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            <AnimatePresence>
                {highlightedRegion && (
                    <motion.div
                        key="highlight"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute z-30 pointer-events-none"
                        style={{
                            left: highlightPos.x,
                            top: highlightPos.y,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <div className="relative">
                            <motion.div
                                className="absolute inset-0 rounded-full bg-red-500"
                                animate={{
                                    scale: [1, 2, 1],
                                    opacity: [0.8, 0, 0.8],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                                style={{ width: "40px", height: "40px" }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full bg-red-500"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [1, 0.3, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                                style={{ width: "40px", height: "40px" }}
                            />
                            <div className="relative w-10 h-10 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/90 backdrop-blur-sm border border-red-500/50 rounded-lg px-3 py-1.5 shadow-lg"
                        >
                            <p className="text-xs md:text-sm font-semibold text-red-500">{highlightedRegion.name}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && <AnnotationLayer isActive={isAnnotationActive} zoom={zoom} position={viewportPosition} />}

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute right-2 top-4 md:right-4 md:top-6 z-10 flex flex-col gap-1.5 md:gap-2"
            >
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    className="h-8 w-8 md:h-10 md:w-10 border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110"
                    title="Zoom In"
                >
                    <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    className="h-8 w-8 md:h-10 md:w-10 border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110"
                    title="Zoom Out"
                >
                    <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleHome}
                    className="h-8 w-8 md:h-10 md:w-10 border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110"
                    title="Reset View"
                >
                    <Home className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRotate}
                    className="h-8 w-8 md:h-10 md:w-10 border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110"
                    title="Rotate 90°"
                >
                    <RotateCw className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="h-8 w-8 md:h-10 md:w-10 border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110"
                    title="Toggle Fullscreen"
                >
                    {isFullscreen ? (
                        <Minimize2 className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                        <Maximize2 className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAIFixDemo}
                    className="h-8 w-8 md:h-10 md:w-10 border-primary/50 bg-background/80 backdrop-blur-sm hover:scale-110"
                    title="AI Upscale & Denoise"
                >
                    <Wand2 className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
            </motion.div>

            <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsModalOpen(false)
                        setAiProcessing(false)
                        setAiComplete(false)
                        setProgress(0)
                    }
                }}
            >
                <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-sm md:text-base">AI Upscale & Denoise</DialogTitle>
                    </DialogHeader>

                    {aiProcessing && !aiComplete && (
                        <div className="flex flex-col items-center justify-center py-6 md:py-8 flex-1 px-4">
                            <div className="relative mb-4 md:mb-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                <Wand2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground text-center max-w-xs mb-4 md:mb-6">
                                Enhancing image with AI upscaling and denoising...
                            </p>

                            <div className="w-full max-w-md">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                    <span>Processing</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 md:h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground mt-3 md:mt-4 opacity-70">This may take a few seconds</p>
                        </div>
                    )}

                    {!aiProcessing && aiComplete && (
                        <div className="flex flex-col md:flex-row gap-3 md:gap-6 py-3 md:py-4 flex-1 min-h-0 px-2">
                            <div className="flex-1 flex flex-col items-center">
                                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Original</p>
                                <div className="w-full flex-1 border rounded-md overflow-hidden flex items-center justify-center bg-muted/30">
                                    <img
                                        src="/ai/defect.png"
                                        alt="Original Defect Region"
                                        className="object-contain w-full h-full max-h-[40vh] md:max-h-[60vh]"
                                        onError={(e) => {
                                            ;(e.target as HTMLImageElement).src =
                                                "https://placehold.co/500x400/e2e8f0/64748b?text=Original+Image"
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center">
                                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">AI Enhanced</p>
                                <div className="w-full flex-1 border rounded-md overflow-hidden flex items-center justify-center bg-muted/30">
                                    <img
                                        src="/ai/img.png"
                                        alt="AI Enhanced Region"
                                        className="object-contain w-full h-full max-h-[40vh] md:max-h-[60vh]"
                                        onError={(e) => {
                                            ;(e.target as HTMLImageElement).src =
                                                "https://placehold.co/500x400/1e293b/94a3b8?text=Enhanced+Image"
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