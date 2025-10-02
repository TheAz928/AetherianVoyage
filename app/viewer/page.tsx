"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { Navbar } from "@/components/navbar"
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

    const formatValue = (value: number | undefined, unit: string, decimals = 0): string => {
        if (value === undefined) return "N/A"
        return `${value.toLocaleString(undefined, { maximumFractionDigits: decimals })} ${unit}`
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
        <div className="relative min-h-screen bg-background">
            <Starfield />
            <Navbar />

            <HudOverlay showCoordinates={true} coordinates={viewportPosition} zoom={zoom} />

            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute left-0 right-0 top-16 z-20 border-b border-border/50 bg-background/80 backdrop-blur-lg"
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

                    {/* Center: Image Title */}
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
                        <Link href={`/compare?galaxy=${galaxyId}&system=${systemId}&planet=${planetId}&image=${imageId}`}>
                            <Button variant="outline" size="sm" className="border-primary/50 bg-transparent">
                                <GitCompare className="mr-2 h-4 w-4" />
                                Compare
                            </Button>
                        </Link>
                        <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-primary/50 bg-transparent">
                                    <Info className="mr-2 h-4 w-4" />
                                    Statistics
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto hide-scrollbar">
                                <DialogHeader>
                                    <DialogTitle className="font-[family-name:var(--font-orbitron)] text-2xl">
                                        {planet.name} - Planetary Statistics
                                    </DialogTitle>
                                    <DialogDescription>Comprehensive data and metrics for {planet.name}</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    {stats?.habitabilityScore !== undefined && (
                                        <div className="rounded-lg border border-primary/30 bg-muted/50 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h3 className="font-[family-name:var(--font-orbitron)] text-lg font-semibold">
                                                    Habitability Score
                                                </h3>
                                                <Badge className={`${getHabitabilityColor(stats.habitabilityScore)} text-white`}>
                                                    {stats.habitabilityScore}/100
                                                </Badge>
                                            </div>
                                            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className={`h-full ${getHabitabilityColor(stats.habitabilityScore)} transition-all duration-500`}
                                                    style={{ width: `${stats.habitabilityScore}%` }}
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Based on atmosphere, temperature, water presence, and radiation levels
                                            </p>
                                        </div>
                                    )}

                                    {(stats?.radius || stats?.mass || stats?.surfaceArea || stats?.gravity) && (
                                        <div className="space-y-3">
                                            <h3 className="border-b border-primary/30 pb-2 font-[family-name:var(--font-orbitron)] text-lg font-semibold">
                                                Physical Characteristics
                                            </h3>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {stats.radius && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Radius</p>
                                                        <p className="font-mono text-lg font-semibold">{formatValue(stats.radius, "km")}</p>
                                                    </div>
                                                )}
                                                {stats.mass && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Mass</p>
                                                        <p className="font-mono text-lg font-semibold">
                                                            {formatValue(stats.mass, "Earth masses", 3)}
                                                        </p>
                                                    </div>
                                                )}
                                                {stats.surfaceArea && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Surface Area</p>
                                                        <p className="font-mono text-lg font-semibold">{formatValue(stats.surfaceArea, "km²")}</p>
                                                    </div>
                                                )}
                                                {stats.gravity && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Gravity</p>
                                                        <p className="font-mono text-lg font-semibold">{formatValue(stats.gravity, "m/s²", 2)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(stats?.dayLength || stats?.yearLength || stats?.distanceFromStar || stats?.escapeVelocity) && (
                                        <div className="space-y-3">
                                            <h3 className="border-b border-primary/30 pb-2 font-[family-name:var(--font-orbitron)] text-lg font-semibold">
                                                Orbital & Rotational Data
                                            </h3>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {stats.dayLength && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Day Length</p>
                                                        <p className="font-mono text-lg font-semibold">
                                                            {formatValue(stats.dayLength, "hours", 1)}
                                                        </p>
                                                    </div>
                                                )}
                                                {stats.yearLength && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Year Length</p>
                                                        <p className="font-mono text-lg font-semibold">
                                                            {formatValue(stats.yearLength, "days", 2)}
                                                        </p>
                                                    </div>
                                                )}
                                                {stats.distanceFromStar && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Distance from Star</p>
                                                        <p className="font-mono text-lg font-semibold">
                                                            {formatValue(stats.distanceFromStar, "AU", 3)}
                                                        </p>
                                                    </div>
                                                )}
                                                {stats.escapeVelocity && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Escape Velocity</p>
                                                        <p className="font-mono text-lg font-semibold">
                                                            {formatValue(stats.escapeVelocity, "km/s", 2)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(stats?.averageTemperature !== undefined ||
                                        stats?.atmosphereComposition ||
                                        stats?.surfacePressure !== undefined) && (
                                        <div className="space-y-3">
                                            <h3 className="border-b border-primary/30 pb-2 font-[family-name:var(--font-orbitron)] text-lg font-semibold">
                                                Atmospheric & Environmental Data
                                            </h3>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {stats.averageTemperature !== undefined && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Average Temperature</p>
                                                        <p className="font-mono text-lg font-semibold">
                                                            {formatValue(stats.averageTemperature, "°C")}
                                                        </p>
                                                    </div>
                                                )}
                                                {stats.atmosphereComposition && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Atmosphere Composition</p>
                                                        <p className="font-mono text-sm font-semibold">{stats.atmosphereComposition}</p>
                                                    </div>
                                                )}
                                                {stats.surfacePressure !== undefined && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Surface Pressure</p>
                                                        <p className="font-mono text-lg font-semibold">
                                                            {formatValue(stats.surfacePressure, "atm", 3)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(stats?.moons !== undefined || stats?.type) && (
                                        <div className="space-y-3">
                                            <h3 className="border-b border-primary/30 pb-2 font-[family-name:var(--font-orbitron)] text-lg font-semibold">
                                                Additional Information
                                            </h3>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {stats.moons !== undefined && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Natural Satellites (Moons)</p>
                                                        <p className="font-mono text-lg font-semibold">{stats.moons}</p>
                                                    </div>
                                                )}
                                                {stats.type && (
                                                    <div className="rounded-lg border border-primary/20 bg-muted/30 p-3">
                                                        <p className="text-sm text-muted-foreground">Planet Type</p>
                                                        <p className="font-mono text-lg font-semibold">{stats.type}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!stats && (
                                        <div className="rounded-lg border border-primary/30 bg-muted/50 p-6 text-center">
                                            <p className="text-muted-foreground">
                                                No statistical data available for {planet.name} at this time.
                                            </p>
                                        </div>
                                    )}

                                    {/* Data Source Note */}
                                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                                        <p className="text-xs text-muted-foreground">
                                            <strong>Note:</strong> Data compiled from NASA, ESA, and other space agencies. Values are
                                            approximate and subject to ongoing research.
                                        </p>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-screen pt-32"
            >
                <DziViewer
                    dziUrl={image.dziUrl}
                    imageName={image.name}
                    onAnnotationToggle={setIsAnnotationActive}
                    isAnnotationActive={isAnnotationActive}
                    onZoomChange={setZoom}
                    onPositionChange={setViewportPosition}
                />
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 pt-24">
                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-3"
                ></motion.div>
            </div>
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
