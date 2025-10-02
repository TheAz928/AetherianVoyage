"use client"

import { useEffect, useRef } from "react"

interface Particle {
  angle: number
  radius: number
  speed: number
  size: number
  opacity: number
  color: string
}

interface GalaxyVortexProps {
  isActive: boolean
  color: string
}

const colorMap: Record<string, string> = {
  "blue-400": "rgba(96, 165, 250",
  "blue-500": "rgba(59, 130, 246",
  "purple-400": "rgba(192, 132, 252",
  "purple-500": "rgba(168, 85, 247",
  "indigo-400": "rgba(129, 140, 248",
  "indigo-500": "rgba(99, 102, 241",
  "pink-400": "rgba(244, 114, 182",
  "pink-500": "rgba(236, 72, 153",
  "violet-400": "rgba(167, 139, 250",
  "violet-500": "rgba(139, 92, 246",
}

export function GalaxyVortex({ isActive, color }: GalaxyVortexProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rgbaColor = colorMap[color] || "rgba(59, 130, 246"

    // Set canvas size to match container
    canvas.width = 200
    canvas.height = 200

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 150 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 80 + 20,
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        color: rgbaColor,
      }))
    }
    initParticles()

    const animate = () => {
      timeRef.current += 0.016

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw vortex center glow
      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40)
      centerGradient.addColorStop(0, `${rgbaColor}, 1)`)
      centerGradient.addColorStop(0.3, `${rgbaColor}, 0.7)`)
      centerGradient.addColorStop(0.6, `${rgbaColor}, 0.3)`)
      centerGradient.addColorStop(1, `${rgbaColor}, 0)`)

      ctx.fillStyle = centerGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
      ctx.fill()

      // Draw bright center core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 15)
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 1)")
      coreGradient.addColorStop(0.5, `${rgbaColor}, 1)`)
      coreGradient.addColorStop(1, `${rgbaColor}, 0)`)

      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
      ctx.fill()

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Spiral motion
        particle.angle += particle.speed
        particle.radius -= 0.15

        // Reset particle if it reaches center
        if (particle.radius < 5) {
          particle.radius = 100
          particle.angle = Math.random() * Math.PI * 2
        }

        // Calculate position with spiral effect
        const spiralFactor = particle.radius / 100
        const x = centerX + Math.cos(particle.angle) * particle.radius * spiralFactor
        const y = centerY + Math.sin(particle.angle) * particle.radius * spiralFactor

        // Draw particle with glow
        const particleOpacity = particle.opacity * (particle.radius / 100)

        ctx.shadowBlur = 8
        ctx.shadowColor = particle.color
        ctx.fillStyle = `${particle.color}, ${particleOpacity})`
        ctx.beginPath()
        ctx.arc(x, y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        // Draw particle trail
        const trailLength = 10
        const trailX = x + Math.cos(particle.angle + Math.PI) * trailLength
        const trailY = y + Math.sin(particle.angle + Math.PI) * trailLength

        const trailGradient = ctx.createLinearGradient(x, y, trailX, trailY)
        trailGradient.addColorStop(0, `${particle.color}, ${particleOpacity * 0.5})`)
        trailGradient.addColorStop(1, `${particle.color}, 0)`)

        ctx.strokeStyle = trailGradient
        ctx.lineWidth = particle.size * 0.5
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(trailX, trailY)
        ctx.stroke()
      })

      // Draw rotating spiral arms
      for (let i = 0; i < 3; i++) {
        const armAngle = (timeRef.current * 0.5 + (i * Math.PI * 2) / 3) % (Math.PI * 2)

        ctx.strokeStyle = `${rgbaColor}, 0.2)`
        ctx.lineWidth = 2
        ctx.beginPath()

        for (let r = 10; r < 100; r += 2) {
          const angle = armAngle + r * 0.05
          const x = centerX + Math.cos(angle) * r
          const y = centerY + Math.sin(angle) * r

          if (r === 10) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, color])

  return <canvas ref={canvasRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />
}
