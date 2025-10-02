"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SplitSquareHorizontal, Layers2 } from 'lucide-react'
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { universeData, type CelestialImage } from "@/lib/universe-data"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export function CompareViewer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // <CHANGE> Get all available images from universe data
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
  const [leftViewer, setLeftViewer] = useState<any>(null)
  const [rightViewer, setRightViewer] = useState<any>(null)

  useEffect(() => {
    const initViewers = async () => {
      // @ts-ignore
      const OpenSeadragon = window.OpenSeadragon
      if (!OpenSeadragon) return

      // Left viewer
      const leftElement = document.getElementById("left-viewer")
      if (leftElement && !leftViewer) {
        const leftInstance = OpenSeadragon({
          element: leftElement,
          prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
          tileSources: leftImage.dziUrl,
          showNavigationControl: false,
          showNavigator: false,
          animationTime: 0.5,
          constrainDuringPan: true,
        })
        setLeftViewer(leftInstance)
      }

      // Right viewer
      const rightElement = document.getElementById("right-viewer")
      if (rightElement && !rightViewer && compareMode === "split") {
        const rightInstance = OpenSeadragon({
          element: rightElement,
          prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
          tileSources: rightImage.dziUrl,
          showNavigationControl: false,
          showNavigator: false,
          animationTime: 0.5,
          constrainDuringPan: true,
        })
        setRightViewer(rightInstance)
      }
    }

    if (!document.getElementById("openseadragon-script")) {
      const script = document.createElement("script")
      script.id = "openseadragon-script"
      script.src = "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/openseadragon.min.js"
      script.async = true
      script.onload = () => initViewers()
      document.head.appendChild(script)
    } else {
      initViewers()
    }

    return () => {
      leftViewer?.destroy()
      rightViewer?.destroy()
    }
  }, [compareMode])

  // <CHANGE> Update viewers when images change
  useEffect(() => {
    if (leftViewer) {
      leftViewer.open(leftImage.dziUrl)
    }
  }, [leftImage, leftViewer])

  useEffect(() => {
    if (rightViewer && compareMode === "split") {
      rightViewer.open(rightImage.dziUrl)
    }
  }, [rightImage, rightViewer, compareMode])

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
            <div className="rounded-lg border border-primary/50 bg-background/80 px-4 py-2 backdrop-blur-sm">
              <p className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">Compare Mode</p>
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
      {/* <CHANGE> Updated selectors to use universe data */}
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
        <div className="flex h-full w-full pt-32">
          {/* Left DZI Viewer */}
          <div className="relative h-full w-1/2 border-r-2 border-primary/50">
            <div id="left-viewer" className="h-full w-full bg-black" />
            <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-primary/50 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
              <p className="text-sm font-medium">{leftImage.name}</p>
            </div>
          </div>

          {/* Right DZI Viewer */}
          <div className="relative h-full w-1/2">
            <div id="right-viewer" className="h-full w-full bg-black" />
            <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-primary/50 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
              <p className="text-sm font-medium">{rightImage.name}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-full w-full pt-32">
          {/* Base DZI Viewer */}
          <div id="left-viewer" className="h-full w-full bg-black" />

          {/* Overlay Image with opacity */}
          <div
            className="absolute inset-0 top-32"
            style={{ opacity: opacity[0] / 100, pointerEvents: "none" }}
          >
            <img
              src={rightImage.thumbnail || "/placeholder.svg"}
              alt={rightImage.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Labels */}
          <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-primary/50 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
            <p className="text-sm font-medium">Base: {leftImage.name}</p>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-primary/50 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
            <p className="text-sm font-medium">Overlay: {rightImage.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}
