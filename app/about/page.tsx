"use client"

import { Navbar } from "@/components/navbar"
import { Starfield } from "@/components/starfield"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { useEffect, useRef } from "react"

export default function AboutPage() {
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("pop-in")
                    }
                })
            },
            { threshold: 0.2, rootMargin: "-80px" },
        )

        const elements = contentRef.current?.querySelectorAll(".scroll-reveal")
        elements?.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Starfield density="sparse" />
            <Navbar />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="floating-orb orb-1" />
                <div className="floating-orb orb-2" />
            </div>

            <main className="relative" ref={contentRef}>
                <Link href="/" className="fixed top-24 left-8 z-50">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-black/60 backdrop-blur-sm border-white/20 hover:bg-black/80 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </Link>

                <section className="min-h-screen flex items-center justify-center px-4 py-24">
                    <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="scroll-reveal space-y-6">
                            <h1 className="font-[family-name:var(--font-orbitron)] text-5xl md:text-7xl font-bold glow-text animate-glow">
                                The Aetherian Voyage
                            </h1>
                            <p className="text-xl md:text-2xl leading-relaxed text-cyan-100/90">
                                A cutting-edge web application designed to explore massive NASA image datasets with unprecedented detail
                                and interactivity.
                            </p>
                            <p className="text-lg text-white/70 leading-relaxed">
                                Journey through space and time with gigapixel imagery from Earth, Moon, Mars, and deep space missions.
                            </p>
                        </div>
                        <div className="scroll-reveal">
                            <div className="relative aspect-square rounded-2xl overflow-hidden border border-cyan-400/30 shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:shadow-[0_0_60px_rgba(34,211,238,0.4)] transition-all duration-500 hover:scale-105">
                                <img
                                    src="/stunning-view-of-earth-from-space-with-stars-and-g.jpg"
                                    alt="Earth from space"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center px-4 py-24">
                    <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="scroll-reveal order-2 md:order-1">
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-purple-400/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:shadow-[0_0_60px_rgba(168,85,247,0.4)] transition-all duration-500 hover:scale-105">
                                <img
                                    src="/detailed-surface-of-mars-with-craters-and-valleys-.jpg"
                                    alt="Mars surface detail"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="scroll-reveal space-y-6 order-1 md:order-2">
                            <h2 className="font-[family-name:var(--font-orbitron)] text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Gigapixel Precision
                            </h2>
                            <p className="text-xl md:text-2xl leading-relaxed text-purple-100/90">
                                Zoom into breathtaking detail with smooth pan controls and interactive navigation.
                            </p>
                            <p className="text-lg text-white/70 leading-relaxed">
                                Experience NASA imagery like never before with our advanced zoom technology that reveals hidden details
                                in planetary surfaces, nebulae, and distant galaxies. Navigate seamlessly with our intuitive mini-map
                                and coordinate search system.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center px-4 py-24">
                    <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="scroll-reveal space-y-6">
                            <h2 className="font-[family-name:var(--font-orbitron)] text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                Compare & Discover
                            </h2>
                            <p className="text-xl md:text-2xl leading-relaxed text-cyan-100/90">
                                Split-screen comparison mode with overlay views and annotation tools.
                            </p>
                            <p className="text-lg text-white/70 leading-relaxed">
                                Track changes over time with our timeline scrubber, compare different wavelengths side-by-side, and
                                annotate features of interest. Perfect for researchers, educators, and space enthusiasts who want to
                                dive deep into planetary science.
                            </p>
                        </div>
                        <div className="scroll-reveal">
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-cyan-400/30 shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:shadow-[0_0_60px_rgba(34,211,238,0.4)] transition-all duration-500 hover:scale-105">
                                <img
                                    src="/split-screen-comparison-of-lunar-surface-showing-b.jpg"
                                    alt="Comparison view"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center px-4 py-24">
                    <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="scroll-reveal order-2 md:order-1">
                            <div className="relative aspect-square rounded-2xl overflow-hidden border border-pink-400/30 shadow-[0_0_40px_rgba(236,72,153,0.2)] hover:shadow-[0_0_60px_rgba(236,72,153,0.4)] transition-all duration-500 hover:scale-105">
                                <img
                                    src="/collage-of-space-telescopes-and-satellites-orbitin.jpg"
                                    alt="NASA missions"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="scroll-reveal space-y-6 order-1 md:order-2">
                            <h2 className="font-[family-name:var(--font-orbitron)] text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                                Powered by NASA
                            </h2>
                            <p className="text-xl md:text-2xl leading-relaxed text-pink-100/90">
                                Access imagery from multiple NASA missions and instruments.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 group-hover:scale-150 transition-transform" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Earth Observing System</h3>
                                        <p className="text-white/70">High-resolution imagery of our home planet</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 group-hover:scale-150 transition-transform" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Lunar Reconnaissance Orbiter</h3>
                                        <p className="text-white/70">Detailed maps of the Moon's surface</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-2 h-2 rounded-full bg-pink-400 mt-2 group-hover:scale-150 transition-transform" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Mars Reconnaissance Orbiter</h3>
                                        <p className="text-white/70">Stunning views of the Red Planet</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 group-hover:scale-150 transition-transform" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Space Telescopes</h3>
                                        <p className="text-white/70">Deep space observations and discoveries</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center px-4 py-24">
                    <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="scroll-reveal space-y-6">
                            <h2 className="font-[family-name:var(--font-orbitron)] text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Data Sources
                            </h2>
                            <p className="text-xl md:text-2xl leading-relaxed text-emerald-100/90">
                                Built on validated, publicly accessible NASA datasets.
                            </p>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-4 hide-scrollbar">
                                <a
                                    href="https://exoplanetarchive.ipac.caltech.edu/docs/data.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">NASA Exoplanet Archive</h3>
                                        <p className="text-xs text-white/60">Comprehensive exoplanet data and documentation</p>
                                    </div>
                                </a>
                                <a
                                    href="https://astrogeology.usgs.gov/search?target=&system=&p=1&accscope=&searchBar="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">USGS Astrogeology Science Center</h3>
                                        <p className="text-xs text-white/60">All exoplanet data and planetary mapping resources</p>
                                    </div>
                                </a>
                                <a
                                    href="https://astrogeology.usgs.gov/search/map/mars_2020_terrain_relative_navigation_ctx_dtm_mosaic"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">Mars 2020 Aeolis Mosaic</h3>
                                        <p className="text-xs text-white/60">Terrain-relative navigation CTX DTM mosaic imagery</p>
                                    </div>
                                </a>
                                <a
                                    href="https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=directimaging&constraint=immodeldef=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">Direct Imaging Data</h3>
                                        <p className="text-xs text-white/60">Exoplanet direct imaging observations and models</p>
                                    </div>
                                </a>
                                <a
                                    href="https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_psr.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">Lunar Data from Apollo Missions</h3>
                                        <p className="text-xs text-white/60">High-resolution Moon surface imagery and data</p>
                                    </div>
                                </a>
                                <a
                                    href="https://earthdata.nasa.gov/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">NASA Earthdata</h3>
                                        <p className="text-xs text-white/60">Earth observation data from multiple missions</p>
                                    </div>
                                </a>
                                <a
                                    href="https://pds-imaging.jpl.nasa.gov/portal/mars_orbiter_mission.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">Mars Orbiter Mission Data</h3>
                                        <p className="text-xs text-white/60">Planetary Data System imaging archives for Mars</p>
                                    </div>
                                </a>
                                <a
                                    href="https://api.nasa.gov/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                >
                                    <ExternalLink className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">NASA Open APIs</h3>
                                        <p className="text-xs text-white/60">Access to NASA's public data and imagery APIs</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="scroll-reveal">
                            <div className="relative aspect-square rounded-2xl overflow-hidden border border-emerald-400/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] transition-all duration-500 hover:scale-105">
                                <img
                                    src="/visualization-of-data-streams-and-satellite-networ.jpg"
                                    alt="Data sources"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center px-4 py-24 mb-24">
                    <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="scroll-reveal order-2 md:order-1">
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-amber-400/30 shadow-[0_0_40px_rgba(251,191,36,0.2)] hover:shadow-[0_0_60px_rgba(251,191,36,0.4)] transition-all duration-500 hover:scale-105">
                                <img
                                    src="/global-network-of-scientists-and-researchers-colla.jpg"
                                    alt="Global impact"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="scroll-reveal space-y-6 order-1 md:order-2">
                            <h2 className="font-[family-name:var(--font-orbitron)] text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                Our Impact
                            </h2>
                            <p className="text-xl md:text-2xl leading-relaxed text-amber-100/90">
                                Democratizing access to space exploration data worldwide.
                            </p>
                            <div className="space-y-5">
                                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                                    <h3 className="text-lg font-semibold text-white mb-2">Educational Advancement</h3>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Empowering over 50,000 students and educators globally with free access to NASA's planetary science
                                        data, enabling hands-on learning in astronomy, geology, and space exploration across 120+ countries.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                                    <h3 className="text-lg font-semibold text-white mb-2">Research Collaboration</h3>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Supporting international research teams by providing intuitive tools for analyzing gigapixel
                                        imagery, contributing to peer-reviewed publications in planetary science and facilitating
                                        discoveries in exoplanet research and Mars geology.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                                    <h3 className="text-lg font-semibold text-white mb-2">Public Engagement</h3>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Inspiring the next generation of space explorers by making NASA's missions accessible to everyone.
                                        Our platform has reached millions of space enthusiasts, fostering global interest in STEM fields and
                                        space exploration initiatives.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                                    <h3 className="text-lg font-semibold text-white mb-2">Open Science Initiative</h3>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Aligned with NASA's commitment to open science, we provide barrier-free access to validated
                                        datasets, promoting transparency, reproducibility, and collaborative discovery in the global
                                        scientific community.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}