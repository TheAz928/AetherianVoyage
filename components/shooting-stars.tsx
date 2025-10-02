"use client"

import { useEffect, useRef } from "react"

interface ShootingStar {
  id: number
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  angle: number
}

export function ShootingStars({ frequency = 1 }: { frequency?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<ShootingStar[]>([])
  const animationFrameRef = useRef<number>()

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

    // Create shooting star periodically
    const createShootingStar = () => {
      const star: ShootingStar = {
        id: Date.now(),
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5, // Top half of screen
        length: Math.random() * 80 + 60,
        speed: Math.random() * 3 + 4,
        opacity: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3, // Roughly 45 degrees
      }
      starsRef.current.push(star)
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        createShootingStar()
      }
    }, 2000 / frequency)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      starsRef.current = starsRef.current.filter((star) => {
        // Update position
        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed
        star.opacity -= 0.01

        // Remove if off screen or faded
        if (star.x > canvas.width + 100 || star.y > canvas.height + 100 || star.opacity <= 0) {
          return false
        }

        // Draw shooting star with gradient trail
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length,
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(0.3, `rgba(200, 220, 255, ${star.opacity * 0.8})`)
        gradient.addColorStop(0.6, `rgba(150, 180, 255, ${star.opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(100, 150, 255, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.lineCap = "round"

        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - Math.cos(star.angle) * star.length, star.y - Math.sin(star.angle) * star.length)
        ctx.stroke()

        // Add bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
        ctx.fill()

        // Add glow
        ctx.shadowBlur = 10
        ctx.shadowColor = `rgba(200, 220, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        return true
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      clearInterval(interval)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [frequency])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-10" />
}
