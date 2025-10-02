"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { SplitSquareHorizontal, Layers2, RotateCcw } from 'lucide-react'
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { universeData, type CelestialImage } from "@/lib/universe-data"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export function CompareViewer() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const allImages: CelestialImage[] = []
    universeData.forEach((galaxy) => {
        galaxy.solarSystems.forEach((system) => {
            system.planets.forEach((planet) => {
                planet.images.forEach((image) => {
                    allImages.push(image)
                })
            })
        })
    })

    const initialImageId = searchParams.get("image") || allImages[0]?.id
    const [leftImage, setLeftImage] = useState<CelestialImage>(
        allImages.find((img) => img.id === initialImageId) || allImages[0]
    )
    const [rightImage, setRightImage] = useState<CelestialImage>(allImages[1] || allImages[0])
    const [compareMode, setCompareMode] = useState<"split" | "overlay">("split")
    const [opacity, setOpacity] = useState([50])
    const [refreshKey, setRefreshKey] = useState(0) // 👈 Triggers re-mount

    const leftViewerRef = useRef<any>(null)
    const rightViewerRef = useRef<any>(null)
    const overlayViewerRef = useRef<any>(null)

    // Load OpenSeadragon script once
    useEffect(() => {
        if (typeof window === "undefined") return
        if (!document.getElementById("openseadragon-script")) {
            const script = document.createElement("script")
            script.id = "openseadragon-script"
            script.src = "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/openseadragon.min.js"
            script.async = true
            document.head.appendChild(script)
        }
    }, [])

    const initViewer = useCallback(() => {
        if (typeof window === "undefined") return
        const OpenSeadragon = (window as any).OpenSeadragon
        if (!OpenSeadragon) return

            // Cleanup
            ;[leftViewerRef, rightViewerRef, overlayViewerRef].forEach(ref => {
            if (ref.current) {
                ref.current.destroy()
                ref.current = null
            }
        })

        // Left viewer (always present)
        const leftEl = document.getElementById("left-viewer")
        if (leftEl) {
            leftViewerRef.current = OpenSeadragon({
                element: leftEl,
                prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
                tileSources: leftImage.dziUrl,
                showNavigationControl: false,
                showNavigator: false,
                animationTime: 0.5,
                constrainDuringPan: true,
                visibilityRatio: 1,
            })
        }

        if (compareMode === "split") {
            const rightEl = document.getElementById("right-viewer")
            if (rightEl) {
                rightViewerRef.current = OpenSeadragon({
                    element: rightEl,
                    prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
                    tileSources: rightImage.dziUrl,
                    showNavigationControl: false,
                    showNavigator: false,
                    animationTime: 0.5,
                    constrainDuringPan: true,
                    visibilityRatio: 1,
                })
            }
        } else if (compareMode === "overlay") {
            const overlayEl = document.getElementById("overlay-viewer")
            if (overlayEl) {
                overlayViewerRef.current = OpenSeadragon({
                    element: overlayEl,
                    prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
                    tileSources: rightImage.dziUrl,
                    showNavigationControl: false,
                    showNavigator: false,
                    animationTime: 0.5,
                    constrainDuringPan: true,
                    visibilityRatio: 1,
                    preserveViewport: true,
                })

                // Sync overlay with base
                const sync = () => {
                    if (leftViewerRef.current && overlayViewerRef.current) {
                        const v = leftViewerRef.current.viewport
                        overlayViewerRef.current.viewport.zoomTo(v.getZoom(), null, true)
                        overlayViewerRef.current.viewport.panTo(v.getCenter(), true)
                    }
                }
                leftViewerRef.current.addHandler('animation', sync)

                // Update opacity
                const updateOpacity = () => {
                    const canvas = overlayEl.querySelector('canvas')
                    if (canvas) canvas.style.opacity = `${opacity[0] / 100}`
                }
                overlayViewerRef.current.addHandler('open', updateOpacity)
                overlayViewerRef.current.addHandler('animation', updateOpacity)
                updateOpacity()
            }
        }
    }, [compareMode, leftImage, rightImage, opacity])

    // Re-init viewers when anything changes
    useEffect(() => {
        initViewer()
        return () => {
            ;[leftViewerRef, rightViewerRef, overlayViewerRef].forEach(ref => {
                if (ref.current) {
                    ref.current.destroy()
                    ref.current = null
                }
            })
        }
    }, [initViewer, refreshKey]) // 👈 refreshKey triggers full reset

    // Handle opacity change in overlay mode
    useEffect(() => {
        if (compareMode === "overlay" && overlayViewerRef.current) {
            const canvas = document.getElementById("overlay-viewer")?.querySelector('canvas')
            if (canvas) canvas.style.opacity = `${opacity[0] / 100}`
        }
    }, [opacity, compareMode])

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    const breadcrumbItems = [
        { label: "Universe", href: "/universe" },
        { label: "Compare Mode" },
    ]

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background pt-16">
            {/* Top Controls */}
            <div className="absolute left-0 right-0 top-16 z-20 border-b border-border/50 bg-background/80 backdrop-blur-lg">
                <div className="px-4 py-3">
                    <div className="mb-3">
                        <BreadcrumbNav items={breadcrumbItems} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg border border-primary/50 bg-background/80 px-4 py-2 backdrop-blur-sm">
                                <p className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">Compare Mode</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                className="border-primary/50"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Refresh
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={compareMode === "split" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCompareMode("split")}
                                className="border-primary/50"
                            >
                                <SplitSquareHorizontal className="mr-2 h-4 w-4" />
                                Split
                            </Button>
                            <Button
                                variant={compareMode === "overlay" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCompareMode("overlay")}
                                className="border-primary/50"
                            >
                                <Layers2 className="mr-2 h-4 w-4" />
                                Overlay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Selectors */}
            <div className="absolute left-4 top-40 z-20 space-y-3">
                <div className="rounded-lg border border-primary/50 bg-background/95 p-3 backdrop-blur-sm">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Left Image</p>
                    <Select value={leftImage.id} onValueChange={(id) => setLeftImage(allImages.find((img) => img.id === id)!)}>
                        <SelectTrigger className="w-48 border-primary/30">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {allImages.map((image) => (
                                <SelectItem key={image.id} value={image.id}>
                                    {image.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border border-primary/50 bg-background/95 p-3 backdrop-blur-sm">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Right Image</p>
                    <Select
                        value={rightImage.id}
                        onValueChange={(id) => setRightImage(allImages.find((img) => img.id === id)!)}
                    >
                        <SelectTrigger className="w-48 border-primary/30">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {allImages.map((image) => (
                                <SelectItem key={image.id} value={image.id}>
                                    {image.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {compareMode === "overlay" && (
                    <div className="rounded-lg border border-primary/50 bg-background/95 p-3 backdrop-blur-sm">
                        <p className="mb-2 text-xs font-semibold text-muted-foreground">Opacity</p>
                        <Slider value={opacity} onValueChange={setOpacity} max={100} step={1} className="w-48" />
                        <p className="mt-1 text-center text-xs text-muted-foreground">{opacity[0]}%</p>
                    </div>
                )}
            </div>

            {/* Comparison View */}
            {compareMode === "split" ? (
                <div className="flex h-full w-full pt-32" key={`split-${refreshKey}`}>
                    <div className="relative h-full w-1/2 border-r-2 border-primary/50">
                        <div id="left-viewer" className="h-full w-full bg-black" />
                        <div className="pointer-events-none absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-lg border border-primary/50 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
                            <p className="text-sm font-medium">{leftImage.name}</p>
                        </div>
                    </div>
                    <div className="relative h-full w-1/2">
                        <div id="right-viewer" className="h-full w-full bg-black" />
                        <div className="pointer-events-none absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-lg border border-primary/50 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
                            <p className="text-sm font-medium">{rightImage.name}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative h-full w-full pt-32" key={`overlay-${refreshKey}`}>
                    <div id="left-viewer" className="h-full w-full bg-black" />
                    <div id="overlay-viewer" className="absolute inset-0 top-32" style={{ pointerEvents: "none" }} />
                    <div className="pointer-events-none absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-lg border border-primary/50 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
                        <p className="text-sm font-medium">Base: {leftImage.name} | Overlay: {rightImage.name}</p>
                    </div>
                </div>
            )}
        </div>
    )
}