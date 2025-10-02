import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Orbitron } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { BackgroundAudio } from "@/components/background-audio"
import { ClickSounds } from "@/components/click-sounds"

const orbitron = Orbitron({
    subsets: ["latin"],
    variable: "--font-orbitron",
    display: "swap",
})

export const metadata: Metadata = {
    title: "The Aetherian Voyage | NASA Image Explorer",
    description:
        "Explore massive NASA image datasets with gigapixel zoom - Earth, Moon, Mars, and beyond",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark hide-scrollbar">
        <body
            className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${orbitron.variable}`}
        >
        <BackgroundAudio />
        <ClickSounds />
        <Suspense fallback={null}>{children}</Suspense>
        </body>
        </html>
    )
}
