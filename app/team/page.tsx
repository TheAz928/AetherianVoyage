"use client"

import { Navbar } from "@/components/navbar"
import { Starfield } from "@/components/starfield"
import { LensFlare } from "@/components/lens-flare"
import { ShootingStars } from "@/components/shooting-stars"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, Linkedin, Mail, Sparkles, Award, Code, Database, TestTube, Mic } from "lucide-react"
import { motion } from "framer-motion"

const teamMembers = [
    {
        name: "K. Mishkatul Azim",
        role: "UI/UX & Backend",
        description: "Crafted the user interface and built the robust backend infrastructure powering the application.",
        image: "/azim.png",
        icon: Code,
        color: "from-blue-500 to-cyan-500",
        skills: ["React", "Next.js", "Node.js"],
    },
    {
        name: "Zarif Ahnaf Dhrubo",
        role: "Game Logic & Rendering",
        description: "Developed the interactive game mechanics and high-performance rendering systems.",
        image: "/dhrubo.png",
        icon: Sparkles,
        color: "from-purple-500 to-pink-500",
        skills: ["WebGL", "Three.js", "Canvas"],
    },
    {
        name: "Md. Muhiminul Islam",
        role: "Dataset Filtering & Importing",
        description: "Processed and integrated massive NASA datasets, ensuring data quality and accessibility.",
        image: "/mahim.png",
        icon: Database,
        color: "from-green-500 to-emerald-500",
        skills: ["Python", "Data Processing", "APIs"],
    },
    {
        name: "Seikh Shad Ibne Moni",
        role: "Research & Testing",
        description: "Conducted extensive research and quality assurance to ensure accuracy and reliability.",
        image: "/moni.png",
        icon: TestTube,
        color: "from-orange-500 to-red-500",
        skills: ["QA", "Testing", "Documentation"],
    },
    {
        name: "Zarin Anjum Sohana",
        role: "Voicing & Presentation",
        description: "Provided voice narration and crafted compelling presentations for the project.",
        image: "/sohana.png",
        icon: Mic,
        color: "from-pink-500 to-rose-500",
        skills: ["Voice Acting", "Presentation", "Communication"],
    },
]

export default function TeamPage() {
    return (
        <div className="relative min-h-screen bg-black/60">
            <Starfield density="sparse" />
            <LensFlare maxFlares={200} size={8} minDelay={1000} maxDelay={2000} />
            <ShootingStars frequency={18} />
            <Navbar />

            <main className="container relative mx-auto px-4 pt-24 pb-20">
                <Link href="/">
                    <Button
                        variant="outline"
                        size="sm"
                        className="mb-8 bg-black/60 backdrop-blur-sm border-white/20 hover:bg-black/80 hover:border-primary/50 transition-all"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <motion.h1
                        className="font-[family-name:var(--font-orbitron)] text-5xl sm:text-6xl font-bold mb-4"
                        animate={{
                            textShadow: [
                                "0 0 20px rgba(139, 92, 246, 0.3)",
                                "0 0 60px rgba(139, 92, 246, 0.6)",
                                "0 0 20px rgba(139, 92, 246, 0.3)",
                            ],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Meet Our Team
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed"
                    >
                        The brilliant minds behind The Aetherian Voyage, working together to bring the cosmos to your screen.
                    </motion.p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {teamMembers.map((member, index) => {
                        const Icon = member.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                whileHover={{ y: -12, scale: 1.03 }}
                                className="group relative bg-black/70 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-primary/60 transition-all duration-500 overflow-hidden"
                            >
                                {/* Animated gradient background */}
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                                    animate={{
                                        scale: [1, 1.25, 1],
                                        rotate: [0, 6, 0],
                                    }}
                                    transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                />

                                {/* Floating icon decoration */}
                                <motion.div
                                    className="absolute -top-6 -right-6 opacity-15"
                                    animate={{
                                        y: [0, -15, 0],
                                        rotate: [0, 15, 0],
                                    }}
                                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                >
                                    <Icon className="h-40 w-40 text-primary" />
                                </motion.div>

                                <div className="relative flex flex-col items-center">
                                    {/* Profile image container */}
                                    <div className="relative mb-7">
                                        <motion.div
                                            className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 group-hover:border-primary/70 transition-all duration-500 relative"
                                            whileHover={{ scale: 1.12 }} // 🔹 Only zooms now, no tilt
                                        >
                                            <motion.div
                                                className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                                            />
                                            <img
                                                src={member.image || "/placeholder.svg"}
                                                alt={member.name}
                                                className="w-full h-full object-cover relative z-10"
                                            />
                                        </motion.div>

                                        {/* Role icon badge */}
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 300 }}
                                            className={`absolute -top-4 -right-4 bg-gradient-to-r ${member.color} p-3 rounded-full border-2 border-black/80 shadow-xl z-20`}
                                        >
                                            <Icon className="h-8 w-8 text-white" />
                                        </motion.div>
                                    </div>

                                    <motion.h3
                                        className="font-[family-name:var(--font-orbitron)] text-2xl font-bold text-white text-center mb-3 group-hover:text-primary transition-colors"
                                        whileHover={{ scale: 1.04 }}
                                    >
                                        {member.name}
                                    </motion.h3>

                                    {/* University badge */}
                                    <div className="mb-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                                        <p className="text-[11px] text-white/60 font-medium tracking-wide text-center leading-tight">
                                            Bangladesh Army University of Engineering & Technology
                                        </p>
                                    </div>

                                    <p
                                        className={`bg-gradient-to-r ${member.color} bg-clip-text text-transparent text-lg font-bold text-center mb-5`}
                                    >
                                        {member.role}
                                    </p>

                                    <p className="text-white/70 text-sm text-center leading-relaxed mb-7 px-4">
                                        {member.description}
                                    </p>

                                    {/* Skill badges */}
                                    <div className="flex flex-wrap justify-center gap-2.5 mb-6">
                                        {member.skills.map((skill, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.15 + 0.4 + i * 0.1 }}
                                                whileHover={{ scale: 1.2 }}
                                                className="px-4 py-2 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-white/80 hover:bg-white/10 hover:border-primary/50 transition-all"
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>

                                    {/* Social links */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15 + 0.6 }}
                                        className="flex justify-center gap-4"
                                    >
                                        <motion.div whileHover={{ scale: 1.3, rotate: 360 }} transition={{ duration: 0.3 }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-12 w-12 text-white/60 hover:text-primary hover:bg-white/10 border border-white/10 hover:border-primary/50"
                                            >
                                                <Github className="h-5 w-5" />
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.3, rotate: 360 }} transition={{ duration: 0.3 }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-12 w-12 text-white/60 hover:text-primary hover:bg-white/10 border border-white/10 hover:border-primary/50"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.3, rotate: 360 }} transition={{ duration: 0.3 }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-12 w-12 text-white/60 hover:text-primary hover:bg-white/10 border border-white/10 hover:border-primary/50"
                                            >
                                                <Mail className="h-5 w-5" />
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-28 max-w-4xl mx-auto bg-black/70 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center relative overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"
                        animate={{
                            opacity: [0.1, 0.25, 0.1],
                            scale: [1, 1.08, 1],
                        }}
                        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="inline-block mb-5"
                    >
                        <Award className="h-14 w-14 text-primary mx-auto" />
                    </motion.div>
                    <h2 className="font-[family-name:var(--font-orbitron)] text-3xl font-bold text-white mb-7 relative">
                        Acknowledgments
                    </h2>
                    <p className="text-white/80 leading-relaxed text-lg relative">
                        This project was made possible through the collaborative efforts of our talented team. Special thanks to
                        NASA for providing open access to their incredible datasets, enabling us to create this immersive space
                        exploration experience.
                    </p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-10 pt-7 border-t border-white/10 relative"
                    >
                        <p className="text-white/60 font-medium">© 2025 Team CosmonovaBD. All rights reserved.</p>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    )
}
