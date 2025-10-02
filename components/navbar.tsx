"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Maximize, Minimize } from "lucide-react"
import { useTheme } from "next-themes"

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"

    const navItems = [
        { name: "Universe", href: "/universe" },
        { name: "About", href: "/about" },
        { name: "Team", href: "/team" },
    ]

    // Handle resizing to close mobile menu
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false)
            }
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }, [])

    // Toggle theme
    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error("Failed to enter fullscreen:", err)
            })
        } else {
            document.exitFullscreen().catch((err) => {
                console.error("Failed to exit fullscreen:", err)
            })
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-border/20 bg-gradient-to-br from-primary/10 to-accent/10 shadow-sm transition-transform duration-300 group-hover:scale-105">
                            <img
                                src="/logo.png"
                                alt="The Aetherian Voyage Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <span className="font-[family-name:var(--font-orbitron)] text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent glow-text">
                            The Aetherian Voyage
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative px-3 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:text-foreground group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                            </Link>
                        ))}

                        {/* Fullscreen toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="ml-2 rounded px-2 py-1 hover:bg-muted/30 transition"
                            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-foreground/80 hover:text-foreground hover:bg-muted/50"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="border-t border-border/20 bg-background/95 backdrop-blur-xl md:hidden animate-in slide-in-from-top-12 duration-300">
                    <div className="space-y-1 px-4 pb-4 pt-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block rounded-lg px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-muted/60 hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Theme toggle in mobile menu */}
                        <div className="flex items-center gap-2 mt-2">
                            {/* Fullscreen toggle in mobile menu */}
                            <button
                                onClick={toggleFullscreen}
                                className="rounded px-2 py-1 hover:bg-muted/30 transition"
                                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            >
                                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
