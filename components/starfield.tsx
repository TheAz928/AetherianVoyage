"use client"

import { useEffect, useRef } from "react"

export function Starfield({
  density = "normal",
  shootingStarFrequency = 1,
  glareFrequency = 1,
  brightness = 1,
}: {
  density?: "sparse" | "normal" | "dense"
  shootingStarFrequency?: number
  glareFrequency?: number
  brightness?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const starCount = density === "sparse" ? 150 : density === "dense" ? 800 : 400

    const stars: {
      x: number
      y: number
      z: number
      radius: number
      opacity: number
      speed: number
      color: string
      blinkSpeed: number
      shape: "circle" | "diamond" | "plus"
      twinklePhase: number
    }[] = []

    const colors = [
      "255, 255, 255", // white - dominant
      "255, 255, 255", // white
      "255, 255, 255", // white
      "255, 255, 255", // white
      "255, 255, 255", // white
      "255, 255, 255", // white
      "255, 255, 255", // white
      "255, 245, 240", // very subtle warm
      "245, 250, 255", // very subtle cool
      "255, 250, 245", // very subtle warm
    ]

    for (let i = 0; i < starCount; i++) {
      const shapeRandom = Math.random()
      let shape: "circle" | "diamond" | "plus"
      if (shapeRandom < 0.85) {
        shape = "circle"
      } else if (shapeRandom < 0.93) {
        shape = "diamond"
      } else {
        shape = "plus"
      }

      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 3,
        radius: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        blinkSpeed: Math.random() * 0.02 + 0.005,
        shape,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    const shootingStars: {
      x: number
      y: number
      length: number
      speed: number
      opacity: number
      active: boolean
    }[] = []

    const glares: {
      x: number
      y: number
      radius: number
      opacity: number
      maxOpacity: number
      speed: number
      color: string
      growing: boolean
      active: boolean
    }[] = []

    const glareColors = [
      "200, 220, 255", // subtle blue
      "255, 240, 220", // subtle warm
      "220, 230, 255", // subtle cool
    ]

    const createGlare = () => {
      glares.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 100 + 60,
        opacity: 0,
        maxOpacity: Math.random() * 0.15 + 0.1,
        speed: Math.random() * 0.008 + 0.003,
        color: glareColors[Math.floor(Math.random() * glareColors.length)],
        growing: true,
        active: true,
      })
    }

    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 3,
        opacity: 1,
        active: true,
      })
    }

    const drawCircleStar = (x: number, y: number, radius: number, color: string, opacity: number, twinkle: number) => {
      const adjustedOpacity = opacity * brightness * (0.7 + Math.sin(twinkle) * 0.3)

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 5)
      gradient.addColorStop(0, `rgba(${color}, ${adjustedOpacity})`)
      gradient.addColorStop(0.4, `rgba(${color}, ${adjustedOpacity * 0.4})`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)

      ctx.beginPath()
      ctx.arc(x, y, radius * 5, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color}, ${Math.min(adjustedOpacity * 1.3, 1)})`
      ctx.fill()
    }

    const drawDiamondStar = (x: number, y: number, size: number, color: string, opacity: number, twinkle: number) => {
      const adjustedOpacity = opacity * brightness * (0.7 + Math.sin(twinkle) * 0.3)

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Math.PI / 4)

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 5)
      gradient.addColorStop(0, `rgba(${color}, ${adjustedOpacity})`)
      gradient.addColorStop(0.4, `rgba(${color}, ${adjustedOpacity * 0.4})`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)

      ctx.beginPath()
      ctx.moveTo(0, -size * 5)
      ctx.lineTo(size * 5, 0)
      ctx.lineTo(0, size * 5)
      ctx.lineTo(-size * 5, 0)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.fillStyle = `rgba(${color}, ${Math.min(adjustedOpacity * 1.3, 1)})`
      ctx.fillRect(-size * 0.5, -size * 0.5, size, size)

      ctx.restore()
    }

    const drawPlusStar = (x: number, y: number, size: number, color: string, opacity: number, twinkle: number) => {
      const adjustedOpacity = opacity * brightness * (0.7 + Math.sin(twinkle) * 0.3)
      const thickness = size * 0.25

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 5)
      gradient.addColorStop(0, `rgba(${color}, ${adjustedOpacity})`)
      gradient.addColorStop(0.4, `rgba(${color}, ${adjustedOpacity * 0.4})`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(x - size * 5, y - thickness * 1.5, size * 10, thickness * 3)
      ctx.fillRect(x - thickness * 1.5, y - size * 5, thickness * 3, size * 10)

      ctx.fillStyle = `rgba(${color}, ${Math.min(adjustedOpacity * 1.3, 1)})`
      ctx.fillRect(x - size, y - thickness / 2, size * 2, thickness)
      ctx.fillRect(x - thickness / 2, y - size, thickness, size * 2)
    }

    let animationFrameId: number
    let lastShootingStarTime = 0
    let lastGlareTime = 0

    const animate = (timestamp: number) => {
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      glares.forEach((glare, index) => {
        if (!glare.active) return

        if (glare.growing) {
          glare.opacity += glare.speed
          if (glare.opacity >= glare.maxOpacity) {
            glare.growing = false
          }
        } else {
          glare.opacity -= glare.speed * 0.5
          if (glare.opacity <= 0) {
            glare.active = false
            glares.splice(index, 1)
            return
          }
        }

        const gradient = ctx.createRadialGradient(glare.x, glare.y, 0, glare.x, glare.y, glare.radius)
        gradient.addColorStop(0, `rgba(${glare.color}, ${glare.opacity})`)
        gradient.addColorStop(0.5, `rgba(${glare.color}, ${glare.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(${glare.color}, 0)`)

        ctx.beginPath()
        ctx.arc(glare.x, glare.y, glare.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      stars.forEach((star) => {
        star.twinklePhase += star.blinkSpeed

        const scale = 1 + star.z * 0.2
        const adjustedSize = star.radius * scale

        switch (star.shape) {
          case "circle":
            drawCircleStar(star.x, star.y, adjustedSize, star.color, star.opacity, star.twinklePhase)
            break
          case "diamond":
            drawDiamondStar(star.x, star.y, adjustedSize, star.color, star.opacity, star.twinklePhase)
            break
          case "plus":
            drawPlusStar(star.x, star.y, adjustedSize, star.color, star.opacity, star.twinklePhase)
            break
        }
      })

      shootingStars.forEach((star, index) => {
        if (!star.active) return

        star.x += star.speed
        star.y += star.speed * 0.5
        star.opacity -= 0.01

        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          star.active = false
          shootingStars.splice(index, 1)
          return
        }

        const gradient = ctx.createLinearGradient(star.x, star.y, star.x - star.length, star.y - star.length * 0.5)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(0.5, `rgba(173, 216, 230, ${star.opacity * 0.5})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - star.length, star.y - star.length * 0.5)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.stroke()
      })

      if (timestamp - lastShootingStarTime > 800 / shootingStarFrequency && Math.random() > 0.75) {
        createShootingStar()
        lastShootingStarTime = timestamp
      }

      if (timestamp - lastGlareTime > 2000 / glareFrequency && Math.random() > 0.95) {
        createGlare()
        lastGlareTime = timestamp
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [density, shootingStarFrequency, glareFrequency, brightness])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" style={{ willChange: "contents" }} />
}
