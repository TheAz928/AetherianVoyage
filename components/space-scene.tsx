"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

interface Planet {
  name: string
  x: number
  y: number
  radius: number
  color: string
  description: string
}

export function SpaceScene({ onPlanetSelect }: { onPlanetSelect: (planet: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Define planets
    const planets: Planet[] = [
      {
        name: "Earth",
        x: canvas.width * 0.25,
        y: canvas.height * 0.4,
        radius: 60,
        color: "#4A90E2",
        description: "Explore our home planet",
      },
      {
        name: "Moon",
        x: canvas.width * 0.45,
        y: canvas.height * 0.6,
        radius: 40,
        color: "#9CA3AF",
        description: "Lunar surface imagery",
      },
      {
        name: "Mars",
        x: canvas.width * 0.65,
        y: canvas.height * 0.45,
        radius: 50,
        color: "#E74C3C",
        description: "The Red Planet",
      },
      {
        name: "Space",
        x: canvas.width * 0.85,
        y: canvas.height * 0.55,
        radius: 45,
        color: "#9B59B6",
        description: "Deep space imagery",
      },
    ]

    // Stars
    const stars: { x: number; y: number; radius: number; opacity: number }[] = []
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        opacity: Math.random(),
      })
    }

    let animationFrameId: number
    let time = 0

    const animate = () => {
      time += 0.01

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0a0a1a")
      gradient.addColorStop(0.5, "#1a0a2e")
      gradient.addColorStop(1, "#0f0520")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        const twinkle = Math.sin(time * 2 + star.x) * 0.5 + 0.5
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
        ctx.fill()
      })

      // Draw planets
      planets.forEach((planet) => {
        const isHovered =
          Math.sqrt(Math.pow(mousePos.x - planet.x, 2) + Math.pow(mousePos.y - planet.y, 2)) < planet.radius

        // Glow effect
        if (isHovered) {
          const glowGradient = ctx.createRadialGradient(
            planet.x,
            planet.y,
            planet.radius * 0.5,
            planet.x,
            planet.y,
            planet.radius * 1.5,
          )
          glowGradient.addColorStop(0, planet.color + "80")
          glowGradient.addColorStop(1, planet.color + "00")
          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Planet
        const planetGradient = ctx.createRadialGradient(
          planet.x - planet.radius * 0.3,
          planet.y - planet.radius * 0.3,
          planet.radius * 0.1,
          planet.x,
          planet.y,
          planet.radius,
        )
        planetGradient.addColorStop(0, planet.color + "FF")
        planetGradient.addColorStop(1, planet.color + "80")
        ctx.fillStyle = planetGradient
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2)
        ctx.fill()

        // Orbit ring
        ctx.strokeStyle = planet.color + "40"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.radius + 10, 0, Math.PI * 2)
        ctx.stroke()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePos({ x, y })

      const hovered = planets.find(
        (planet) => Math.sqrt(Math.pow(x - planet.x, 2) + Math.pow(y - planet.y, 2)) < planet.radius,
      )
      setHoveredPlanet(hovered || null)
      canvas.style.cursor = hovered ? "pointer" : "default"
    }

    // Click handler
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const clicked = planets.find(
        (planet) => Math.sqrt(Math.pow(x - planet.x, 2) + Math.pow(y - planet.y, 2)) < planet.radius,
      )
      if (clicked) {
        onPlanetSelect(clicked.name.toLowerCase())
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
    }
  }, [mousePos.x, mousePos.y, onPlanetSelect])

  return (
    <div className="relative h-screen w-full">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Overlay info */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-orbitron)] text-4xl font-bold text-balance glow-text sm:text-5xl">
            Select Your Destination
          </h2>
          <p className="mt-4 text-lg text-foreground/80">Click on a celestial body to begin exploration</p>
        </div>

        <div className="absolute bottom-20 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Planet info tooltip */}
      {hoveredPlanet && (
        <div
          className="pointer-events-none absolute rounded-lg border border-primary/50 bg-card/90 px-4 py-2 backdrop-blur-sm"
          style={{
            left: mousePos.x + 20,
            top: mousePos.y - 40,
          }}
        >
          <p className="font-[family-name:var(--font-orbitron)] font-semibold text-foreground">{hoveredPlanet.name}</p>
          <p className="text-sm text-muted-foreground">{hoveredPlanet.description}</p>
        </div>
      )}
    </div>
  )
}
