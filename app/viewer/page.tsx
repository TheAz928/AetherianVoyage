"use client"

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
    const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 })
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

    const formatValue = (value: number | undefined, unit: string): string => {
        if (value === undefined) return "N/A"
        return `${value} ${unit}`
    }

    const getHabitabilityColor = (score: number) => {
        if (score >= 80) return "bg-green-500"
        if (score >= 60) return "bg-yellow-500"
        if (score >= 40) return "bg-orange-500"
        return "bg-red-500"
    }

    if (!image || !planet || !solarSystem || !galaxy) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Image not found</h2>
                    <Link href="/universe">
                        <Button className="mt-4">Return to Universe</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-screen w-screen bg-background overflow-hidden">
            {/* Starfield background */}
            <Starfield />

            {/* HUD Overlay */}
            <HudOverlay showCoordinates={true} coordinates={viewportPosition} zoom={zoom} />

            {/* Top Navigation / HUD */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute left-0 right-0 top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-lg"
            >
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: Back Button & Breadcrumb */}
                    <div className="flex items-center gap-4">
                        <Link href="/universe">
                            <Button variant="outline" size="sm" className="border-primary/50 bg-transparent">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Universe
                            </Button>
                        </Link>
                        <div className="hidden text-sm text-muted-foreground md:block">
                            <span className="text-foreground">{galaxy.name}</span>
                            <span className="mx-2">/</span>
                            <span className="text-foreground">{solarSystem.name}</span>
                            <span className="mx-2">/</span>
                            <span className="text-foreground">{planet.name}</span>
                        </div>
                    </div>

                    {/* Image Title */}
                    <div className="text-center">
                        <h2 className="font-[family-name:var(--font-orbitron)] text-lg font-bold">{image.name}</h2>
                        <p className="text-xs text-muted-foreground">
                            {image.mission} • {image.date}
                        </p>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant={isAnnotationActive ? "default" : "outline"}
                            size="sm"
                            className={isAnnotationActive ? "glow" : "border-primary/50 bg-transparent"}
                            onClick={() => setIsAnnotationActive(!isAnnotationActive)}
                        >
                            <Tag className="mr-2 h-4 w-4" />
                            {isAnnotationActive ? "Annotating" : "Annotate"}
                        </Button>
                        <Link
                            href={`/compare?galaxy=${galaxyId}&system=${systemId}&planet=${planetId}&image=${imageId}`}
                        >
                            <Button variant="outline" size="sm" className="border-primary/50 bg-transparent">
                                <GitCompare className="mr-2 h-4 w-4" />
                                Compare
                            </Button>
                        </Link>

                        {/* Statistics Modal */}
                        <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-primary/50 bg-transparent hover:bg-primary/10 transition"
                                >
                                    <Info className="mr-2 h-4 w-4" />
                                    Statistics
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto hide-scrollbar bg-gradient-to-br from-[#0B0C10]/90 to-[#1F1F2E]/90 border border-primary/40 rounded-2xl p-6 shadow-lg backdrop-blur-md">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-white">{planet.name} Statistics</DialogTitle>
                                    <DialogDescription className="text-sm text-gray-300">
                                        Detailed information about the planet's physical, orbital, and atmospheric characteristics.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {stats ? (
                                        <>
                                            {/* Habitability */}
                                            <StatCard label="Habitability Score">
                                                <Badge className={getHabitabilityColor(stats.habitabilityScore || 0)}>
                                                    {stats.habitabilityScore ?? "N/A"}
                                                </Badge>
                                            </StatCard>
                                            <StatCard label="Type" value={stats.type} />

                                            {/* Physical */}
                                            <StatCard label="Radius" value={formatValue(stats.radius, "km")} />
                                            <StatCard label="Mass" value={formatValue(stats.mass, "Earth masses")} />
                                            <StatCard label="Surface Area" value={formatValue(stats.surfaceArea, "km²")} />
                                            <StatCard label="Gravity" value={formatValue(stats.gravity, "m/s²", 2)} />
                                            <StatCard label="Escape Velocity" value={formatValue(stats.escapeVelocity, "km/s", 2)} />

                                            {/* Orbital & Rotational */}
                                            <StatCard label="Day Length" value={formatValue(stats.dayLength, "hours")} />
                                            <StatCard label="Year Length" value={formatValue(stats.yearLength, "days")} />
                                            <StatCard label="Distance from Star" value={formatValue(stats.distanceFromStar, "AU")} />

                                            {/* Atmosphere & Surface */}
                                            <StatCard label="Average Temperature" value={formatValue(stats.averageTemperature, "°C")} />
                                            <StatCard label="Atmosphere Composition" value={stats.atmosphereComposition} />
                                            <StatCard label="Surface Pressure" value={formatValue(stats.surfacePressure, "bar", 3)} />

                                            {/* Moons */}
                                            <StatCard label="Moons" value={stats.moons} />
                                        </>
                                    ) : (
                                        <p className="text-gray-300">No statistics available for this planet.</p>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </motion.div>

            {/* DZI Viewer fills the screen */}
            <DziViewer
                dziUrl={image.dziUrl}
                imageName={image.name}
                onAnnotationToggle={setIsAnnotationActive}
                isAnnotationActive={isAnnotationActive}
                onZoomChange={setZoom}
                onPositionChange={setViewportPosition}
            />
        </div>
    )
}

// Helper component for clean stat cards
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
        <div className="flex flex-col rounded-xl bg-[#11121B]/70 p-4 border border-primary/20 hover:border-primary/50 transition shadow-sm">
            <span className="text-gray-400 text-sm">{label}</span>
            <div className="mt-1 text-white text-lg font-semibold">{children ?? value}</div>
        </div>
    )
}

export default function ViewerPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            }
        >
            <ViewerContent />
        </Suspense>
    )
}
