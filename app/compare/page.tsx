"use client"

import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Starfield } from "@/components/starfield"
import { CompareViewer } from "@/components/compare-viewer"

function CompareContent() {
  return (
    <div className="relative min-h-screen">
      <Starfield />
      <Navbar />
      <CompareViewer />
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  )
}
