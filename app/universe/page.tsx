"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Starfield } from "@/components/starfield"
import { LensFlare } from "@/components/lens-flare"
import { EnergyParticles } from "@/components/energy-particles"
import { SpaceshipTransition } from "@/components/spaceship-transition"
import { GalaxyVortex } from "@/components/galaxy-vortex"
import { universeData, type Galaxy, type SolarSystem } from "@/lib/universe-data"
import { ChevronRight, Sparkles, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function UniversePage() {
  const [selectedGalaxy, setSelectedGalaxy] = useState<Galaxy | null>(null)
  const [selectedSolarSystem, setSelectedSolarSystem] = useState<SolarSystem | null>(null)
  const [transitionActive, setTransitionActive] = useState(false)
  const [targetUrl, setTargetUrl] = useState<string>("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const galaxyParam = searchParams.get("galaxy")
    if (galaxyParam && !selectedGalaxy) {
      const galaxy = universeData.find((g) => g.id === galaxyParam)
      if (galaxy) {
        setSelectedGalaxy(galaxy)
      }
    }
  }, [searchParams, selectedGalaxy])

  // Auto-scroll to selected items
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [selectedGalaxy, selectedSolarSystem])

  const handleImageClick = (url: string) => {
    setTargetUrl(url)
    setTransitionActive(true)
  }

  const handleTransitionComplete = () => {
    router.push(targetUrl)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Starfield />
      <LensFlare />
      <EnergyParticles />
      <Navbar />

      <SpaceshipTransition isActive={transitionActive} onComplete={handleTransitionComplete} />

      <main className="relative min-h-screen px-4 py-24">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-[family-name:var(--font-orbitron)] text-4xl font-bold leading-tight tracking-tight text-balance glow-text-animated sm:text-5xl lg:text-6xl">
              Navigate the Universe
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-foreground/80 text-balance">
              Scroll through galaxies, solar systems, and planets to explore gigapixel imagery
            </p>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedGalaxy(null)
                setSelectedSolarSystem(null)
              }}
              className="h-auto p-2 hover:text-primary hover:bg-primary/10"
            >
              Universe
            </Button>
            {selectedGalaxy && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSolarSystem(null)}
                  className="h-auto p-2 hover:text-primary hover:bg-primary/10"
                >
                  {selectedGalaxy.name}
                </Button>
              </>
            )}
            {selectedSolarSystem && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="p-2 text-primary">{selectedSolarSystem.name}</span>
              </>
            )}
          </div>

          {/* Galaxy View */}
          {!selectedGalaxy && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold glow-text">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                Galaxies
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {universeData.map((galaxy, index) => (
                  <motion.button
                    key={galaxy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedGalaxy(galaxy)}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 text-left backdrop-blur-sm transition-all hover:border-primary hover:shadow-glow-lg h-64"
                  >
                    <div className={`absolute inset-0 opacity-20 ${galaxy.gradient} animate-gradient`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-40 h-40">
                        <GalaxyVortex isActive={true} color={galaxy.color.match(/from-(\w+-\d+)/)?.[1] || "blue-500"} />
                      </div>
                    </div>
                    <div className="relative z-10 flex flex-col justify-end h-full">
                      <h3 className="mb-2 text-xl font-bold text-foreground">{galaxy.name}</h3>
                      <p className="text-sm text-muted-foreground">{galaxy.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                        <span>{galaxy.solarSystems.length} solar systems</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Solar System View */}
          {selectedGalaxy && !selectedSolarSystem && (
            <div ref={scrollContainerRef} className="space-y-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold glow-text">
                <Globe className="h-6 w-6 text-primary animate-pulse" />
                Solar Systems in {selectedGalaxy.name}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {selectedGalaxy.solarSystems.map((solarSystem, index) => (
                  <motion.button
                    key={solarSystem.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSolarSystem(solarSystem)}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 text-left backdrop-blur-sm transition-all hover:border-primary hover:shadow-glow-lg"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className={`mb-4 h-20 w-20 rounded-full bg-gradient-to-br ${solarSystem.color} glow-pulse`}
                      />
                      <h3 className="mb-2 text-xl font-bold text-foreground">{solarSystem.name}</h3>
                      <p className="text-sm text-muted-foreground">{solarSystem.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                        <span>{solarSystem.planets.length} planets</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Planet View */}
          {selectedGalaxy && selectedSolarSystem && (
            <div ref={scrollContainerRef} className="space-y-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold glow-text">
                <Globe className="h-6 w-6 text-primary animate-pulse" />
                Planets in {selectedSolarSystem.name}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {selectedSolarSystem.planets.map((planet) => (
                  <motion.div
                    key={planet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary hover:shadow-glow-lg transition-all"
                  >
                    <div className={`absolute inset-0 opacity-20 ${planet.gradient} animate-gradient`} />
                    <div className="relative p-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className={`mb-4 h-20 w-20 rounded-full bg-gradient-to-br ${planet.color} glow-pulse`}
                      />
                      <h3 className="mb-2 text-xl font-bold text-foreground">{planet.name}</h3>
                      <p className="mb-4 text-sm text-muted-foreground">{planet.description}</p>

                      {/* Images */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {planet.images.length} images available
                        </p>
                        {planet.images.map((image) => (
                          <motion.button
                            key={image.id}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleImageClick(
                                `/viewer?galaxy=${selectedGalaxy.id}&system=${selectedSolarSystem.id}&planet=${planet.id}&image=${image.id}`,
                              )
                            }
                            className="flex w-full items-center gap-3 rounded-lg border border-border/30 bg-background/50 p-3 transition-all hover:border-primary/50 hover:bg-background/80 hover:shadow-glow"
                          >
                            <img
                              src={image.thumbnail || "/placeholder.svg"}
                              alt={image.name}
                              className="h-12 w-12 rounded object-cover ring-2 ring-primary/20"
                            />
                            <div className="flex-1 overflow-hidden text-left">
                              <p className="truncate text-sm font-medium">{image.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{image.mission}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
