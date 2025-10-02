"use client"

import { Starfield } from "@/components/starfield"
import { LensFlare } from "@/components/lens-flare"
import { EnergyParticles } from "@/components/energy-particles"
import { ShootingStars } from "@/components/shooting-stars"
import { Explosions } from "@/components/explosions"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Rocket, Sparkles, ImageIcon, Telescope } from "lucide-react"
import Link from "next/link"
import { GalaxyVortex } from "@/components/galaxy-vortex"
import { universeData } from "@/lib/universe-data"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const featuredImages = [
    {
      name: "Earth - Blue Marble",
      thumbnail: universeData[0].solarSystems[0].planets[0].images[0].thumbnail,
      description: "Our home planet in stunning detail",
      url: `/viewer?galaxy=milky-way&system=solar-system&planet=earth&image=earth-blue-marble`,
    },
    {
      name: "Moon - Lunar Surface",
      thumbnail: universeData[0].solarSystems[0].planets[1].images[0].thumbnail,
      description: "Explore the cratered lunar landscape",
      url: `/viewer?galaxy=milky-way&system=solar-system&planet=moon&image=moon-surface`,
    },
    {
      name: "Mars - Red Planet",
      thumbnail: universeData[0].solarSystems[0].planets[2].images[0].thumbnail,
      description: "The mysterious red neighbor",
      url: `/viewer?galaxy=milky-way&system=solar-system&planet=mars&image=mars-surface`,
    },
  ]

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">
      <Starfield density="normal" shootingStarFrequency={1.5} glareFrequency={1.2} brightness={1} />
      <LensFlare />
      <EnergyParticles />
      <ShootingStars frequency={2} />
      <Explosions frequency={2} />
      <Navbar />

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-32 transform-gpu">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative inline-block mb-6"
          >
            <h1
              className="font-[family-name:var(--font-orbitron)] text-5xl font-bold leading-tight tracking-wider text-balance sm:text-6xl lg:text-8xl relative"
              style={{
                textShadow:
                  "0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.6), 0 0 90px rgba(236, 72, 153, 0.4)",
              }}
            >
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-gradient">
                Explore the Cosmos
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-6 text-lg leading-relaxed text-balance sm:text-xl max-w-3xl mx-auto font-light tracking-wide"
            style={{
              color: "rgba(226, 232, 240, 0.9)",
              textShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            }}
          >
            Journey through multiple galaxies and solar systems with{" "}
            <span
              className="text-cyan-400 font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text"
              style={{ textShadow: "0 0 15px rgba(34, 211, 238, 0.6)" }}
            >
              gigapixel DZI zoom
            </span>
            . Discover Earth, Moon, Mars, and distant galaxies in unprecedented detail.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/universe">
              <Button
                size="lg"
                className="group relative overflow-hidden glow-pulse transform-gpu text-lg px-8 py-6 font-semibold tracking-wide"
                style={{
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <Rocket className="relative mr-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span className="relative">Begin Voyage</span>
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-400/50 bg-transparent hover:bg-cyan-400/10 hover:border-cyan-400 transform-gpu transition-all duration-300 text-lg px-8 py-6 font-semibold tracking-wide text-cyan-300 hover:text-cyan-200"
                style={{
                  boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
                }}
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <div className="mt-32 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Telescope
                className="h-7 w-7 text-cyan-400"
                style={{ filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))" }}
              />
            </motion.div>
            <h3
              className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide"
              style={{
                textShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
              }}
            >
              Featured Destinations
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 transform-gpu">
            {featuredImages.map((image, index) => (
              <Link key={image.name} href={image.url}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.08, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all hover:border-primary/70 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transform-gpu relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={image.thumbnail || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-4 right-4 bg-primary/30 backdrop-blur-sm rounded-full p-3 border border-primary/50"
                    >
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </motion.div>
                  </div>
                  <div className="relative p-6">
                    <p className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {image.name}
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed">{image.description}</p>
                    <div className="mt-5 flex items-center gap-2 text-sm text-primary font-medium">
                      <span>Explore in detail</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-32 w-full max-w-6xl pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Sparkles
                className="h-7 w-7 text-purple-400"
                style={{ filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))" }}
              />
            </motion.div>
            <h3
              className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 bg-clip-text text-transparent tracking-wide"
              style={{
                textShadow: "0 0 30px rgba(168, 85, 247, 0.6)",
              }}
            >
              Discover Galaxies
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 transform-gpu">
            {universeData.map((galaxy, index) => {
              const totalPlanets = galaxy.solarSystems.reduce((sum, system) => sum + system.planets.length, 0)
              const totalImages = galaxy.solarSystems.reduce(
                (sum, system) => sum + system.planets.reduce((pSum, planet) => pSum + planet.images.length, 0),
                0,
              )

              return (
                <Link key={galaxy.name} href={`/universe?galaxy=${galaxy.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
                    whileTap={{ scale: 0.95 }}
                    className="group cursor-pointer rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-8 transition-all hover:border-primary/70 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] relative overflow-hidden h-80 transform-gpu"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div
                      className={`absolute inset-0 opacity-20 ${galaxy.gradient}`}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="relative w-48 h-48 transform-gpu"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 1 }}
                      >
                        <GalaxyVortex isActive={true} color={galaxy.color.match(/from-(\w+-\d+)/)?.[1] || "blue-500"} />
                      </motion.div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-end h-full">
                      <motion.p
                        className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {galaxy.name}
                      </motion.p>
                      <p className="text-sm text-white/50 mb-4 leading-relaxed">{galaxy.description}</p>
                      <div className="space-y-2 text-sm">
                        <motion.p
                          className="text-primary/90 font-medium"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          ✦ {galaxy.solarSystems.length} solar systems
                        </motion.p>
                        <motion.p className="text-primary/70" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                          ✦ {totalPlanets} planets
                        </motion.p>
                        <motion.p className="text-primary/70" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                          ✦ {totalImages} images
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Link href="/universe">
              <Button
                variant="outline"
                size="lg"
                className="group border-primary/40 hover:border-primary bg-black/40 backdrop-blur-sm text-lg px-8 py-6"
              >
                <Telescope className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Navigate Full Universe
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-6">
              <motion.img
                src="/nasa-logo.png"
                alt="NASA"
                className="h-10 opacity-70 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              />
            </div>
            <div className="flex flex-col items-center sm:items-end gap-2">
              <p className="text-sm text-white/50">Data provided by NASA Open Datasets</p>
              <p className="text-sm text-white/60 font-medium">© 2025 Team CosmonovaBD. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
