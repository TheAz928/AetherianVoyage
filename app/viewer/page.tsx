"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { Starfield } from "@/components/starfield"
import { DziViewer } from "@/components/dzi-viewer"
import { HudOverlay } from "@/components/hud-overlay"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Tag, GitCompare, Info } from "lucide-react"
import { getImage, getPlanet, getSolarSystem, getGalaxy } from "@/lib/universe-data"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

function ViewerContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isAnnotationActive, setIsAnnotationActive] = useState(false)
    const [zoom, setZoom] = useState(1)
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null)
    const [isStatsOpen, setIsStatsOpen] = useState(false)

    const galaxyId = searchParams.get("galaxy") || ""
    const systemId = searchParams.get("system") || ""
    const planetId = searchParams.get("planet") || ""
    const imageId = searchParams.get("image") || ""

    const galaxy = getGalaxy(galaxyId)
    const solarSystem = getSolarSystem(galaxyId, systemId)
    const planet = getPlanet(galaxyId, systemId, planetId)
    const image = getImage(galaxyId, systemId, planetId, imageId)

    const stats = planet?.statistics

    const formatValue = (value: number | undefined, unit: string, decimals = 0): string => {
        if (value === undefined) return "N/A"
        return `${value.toFixed(decimals)} ${unit}`
    }

    const getHabitabilityColor = (score: number) => {
        if (score >= 80) return "bg-green-500"
        if (score >= 60) return "bg-yellow-500"
        if (score >= 40) return "bg-orange-500"
        return "bg-red-500"
    }

    if (!image || !planet || !solarSystem || !galaxy) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold">Image not found</h2>
                    <Link href="/universe" className="mt-4 inline-block">
                        <Button className="w-full max-w-xs">Return to Universe</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-screen w-screen bg-background overflow-hidden pt-16 md:pt-20">
            {/* Starfield background */}
            <Starfield />

            <HudOverlay showCoordinates={true} coordinates={cursorPosition} zoom={zoom} />

            {/* Top Navigation / HUD */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="fixed left-0 right-0 top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-lg"
            >
                <div className="flex flex-col items-start justify-between px-2 py-2 gap-2 md:flex-row md:items-center md:px-4 md:py-3 md:gap-0">
                    {/* Left: Back Button & Breadcrumb */}
                    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                        <Link href="/universe" className="shrink-0">
                            <Button variant="outline" size="sm" className="border-primary/50 bg-transparent h-7 px-2 md:h-8 md:px-3">
                                <ArrowLeft className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                                <span className="text-xs md:text-sm">Back</span>
                            </Button>
                        </Link>
                        <div className="hidden lg:block text-xs md:text-sm text-muted-foreground">
                            <span className="text-foreground">{galaxy.name}</span>
                            <span className="mx-1 md:mx-2">/</span>
                            <span className="text-foreground">{solarSystem.name}</span>
                            <span className="mx-1 md:mx-2">/</span>
                            <span className="text-foreground">{planet.name}</span>
                        </div>
                    </div>

                    {/* Image Title - centered on mobile */}
                    <div className="text-center flex-1 min-w-0 w-full md:w-auto">
                        <h2 className="font-[family-name:var(--font-orbitron)] text-sm md:text-base lg:text-lg font-bold truncate px-1">
                            {image.name}
                        </h2>
                        <p className="text-[10px] md:text-xs text-muted-foreground truncate px-1">
                            {image.mission} • {image.date}
                        </p>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto justify-end">
                        <Button
                            variant={isAnnotationActive ? "default" : "outline"}
                            size="sm"
                            className={
                                isAnnotationActive ? "glow h-7 md:h-8 text-xs" : "border-primary/50 bg-transparent h-7 md:h-8 text-xs"
                            }
                            onClick={() => setIsAnnotationActive(!isAnnotationActive)}
                        >
                            <Tag className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">{isAnnotationActive ? "Annotating" : "Annotate"}</span>
                        </Button>
                        <Link
                            href={`/compare?galaxy=${galaxyId}&system=${systemId}&planet=${planetId}&image=${imageId}`}
                            className="shrink-0"
                        >
                            <Button variant="outline" size="sm" className="border-primary/50 bg-transparent h-7 md:h-8 text-xs">
                                <GitCompare className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                                <span className="hidden sm:inline">Compare</span>
                            </Button>
                        </Link>
                        <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-primary/50 bg-transparent h-7 md:h-8 text-xs hover:bg-primary/10 transition"
                                >
                                    <Info className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                                    <span className="hidden sm:inline">Stats</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto hide-scrollbar bg-gradient-to-br from-[#0B0C10]/90 to-[#1F1F2E]/90 border border-primary/40 rounded-2xl p-4 md:p-6 shadow-lg backdrop-blur-md">
                                <DialogHeader>
                                    <DialogTitle className="text-lg md:text-xl font-bold text-white">
                                        {planet.name} Statistics
                                    </DialogTitle>
                                    <DialogDescription className="text-xs md:text-sm text-gray-300">
                                        Detailed information about the planet's physical, orbital, and atmospheric characteristics.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 md:mt-6 grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-2">
                                    {stats ? (
                                        <>
                                            <StatCard label="Habitability Score">
                                                <Badge className={getHabitabilityColor(stats.habitabilityScore || 0)}>
                                                    {stats.habitabilityScore ?? "N/A"}
                                                </Badge>
                                            </StatCard>
                                            <StatCard label="Type" value={stats.type} />
                                            <StatCard label="Radius" value={formatValue(stats.radius, "km")} />
                                            <StatCard label="Mass" value={formatValue(stats.mass, "Earth masses")} />
                                            <StatCard label="Surface Area" value={formatValue(stats.surfaceArea, "km²")} />
                                            <StatCard label="Gravity" value={formatValue(stats.gravity, "m/s²", 2)} />
                                            <StatCard label="Escape Velocity" value={formatValue(stats.escapeVelocity, "km/s", 2)} />
                                            <StatCard label="Day Length" value={formatValue(stats.dayLength, "hours")} />
                                            <StatCard label="Year Length" value={formatValue(stats.yearLength, "days")} />
                                            <StatCard label="Distance from Star" value={formatValue(stats.distanceFromStar, "AU")} />
                                            <StatCard label="Average Temperature" value={formatValue(stats.averageTemperature, "°C")} />
                                            <StatCard label="Atmosphere Composition" value={stats.atmosphereComposition} />
                                            <StatCard label="Surface Pressure" value={formatValue(stats.surfacePressure, "bar", 3)} />
                                            <StatCard label="Moons" value={stats.moons?.toString() || "0"} />
                                        </>
                                    ) : (
                                        <p className="text-gray-300 col-span-2">No statistics available.</p>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </motion.div>

            <DziViewer
                dziUrl={image.dziUrl}
                imageName={image.name}
                onAnnotationToggle={setIsAnnotationActive}
                isAnnotationActive={isAnnotationActive}
                onZoomChange={setZoom}
                onCursorPositionChange={setCursorPosition}
            />
        </div>
    )
}

const StatCard = ({
                      label,
                      value,
                      children,
                  }: {
    label: string
    value?: string | number
    children?: React.ReactNode
}) => {
    return (
        <div className="flex flex-col rounded-lg md:rounded-xl bg-[#11121B]/70 p-3 md:p-4 border border-primary/20">
            <span className="text-gray-400 text-xs md:text-sm">{label}</span>
            <div className="mt-1 text-white text-base md:text-lg font-semibold">{children ?? value}</div>
        </div>
    )
}

export default function ViewerPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 md:h-12 md:w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            }
        >
            <ViewerContent />
        </Suspense>
    )
}
