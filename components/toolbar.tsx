"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Layers, GitCompare, Tag, Clock, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface ToolbarProps {
  dataset: string
  onAnnotationToggle?: (active: boolean) => void
}

const FEATURES: Record<string, Array<{ name: string; coords: string; description: string }>> = {
  earth: [
    { name: "Mount Everest", coords: "27.9881°N, 86.9250°E", description: "Highest mountain on Earth" },
    { name: "Amazon Rainforest", coords: "3.4653°S, 62.2159°W", description: "Largest tropical rainforest" },
    { name: "Great Barrier Reef", coords: "18.2871°S, 147.6992°E", description: "World's largest coral reef" },
    { name: "Sahara Desert", coords: "23.4162°N, 25.6628°E", description: "Largest hot desert" },
  ],
  moon: [
    { name: "Tycho Crater", coords: "43.3°S, 11.4°W", description: "Prominent impact crater" },
    { name: "Mare Tranquillitatis", coords: "8.5°N, 31.4°E", description: "Apollo 11 landing site" },
    { name: "Copernicus Crater", coords: "9.7°N, 20.1°W", description: "Large impact crater" },
    { name: "South Pole-Aitken", coords: "53°S, 169°W", description: "Largest impact basin" },
  ],
  mars: [
    { name: "Olympus Mons", coords: "18.65°N, 226.2°E", description: "Largest volcano in solar system" },
    { name: "Valles Marineris", coords: "14°S, 59°W", description: "Massive canyon system" },
    { name: "Hellas Planitia", coords: "42.7°S, 70°E", description: "Large impact crater" },
    { name: "Gale Crater", coords: "5.4°S, 137.8°E", description: "Curiosity rover location" },
  ],
  space: [
    { name: "Pillars of Creation", coords: "M16 Eagle Nebula", description: "Star-forming region" },
    { name: "Crab Nebula", coords: "M1", description: "Supernova remnant" },
    { name: "Andromeda Galaxy", coords: "M31", description: "Nearest major galaxy" },
    { name: "Orion Nebula", coords: "M42", description: "Stellar nursery" },
  ],
}

const TIMELINES: Record<string, string[]> = {
  earth: ["2024", "2023", "2022", "2021", "2020"],
  moon: ["LRO 2024", "LRO 2023", "Apollo Era", "Clementine 1994"],
  mars: ["Perseverance 2024", "Curiosity 2023", "MRO 2022", "Viking 1976"],
  space: ["JWST 2024", "Hubble 2023", "Hubble 2022", "Hubble 2021"],
}

export function Toolbar({ dataset, onAnnotationToggle }: ToolbarProps) {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ name: string; coords: string; description: string }>>([])
  const [isAnnotationActive, setIsAnnotationActive] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const features = FEATURES[dataset] || []
      const results = features.filter(
        (feature) =>
          feature.name.toLowerCase().includes(query.toLowerCase()) ||
          feature.description.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleDatasetChange = (newDataset: string) => {
    router.push(`/explore?dataset=${newDataset}`)
  }

  const handleAnnotationToggle = () => {
    const newState = !isAnnotationActive
    setIsAnnotationActive(newState)
    onAnnotationToggle?.(newState)
  }

  return (
    <>
      {/* Left Toolbar */}
      <div className="absolute left-4 top-32 z-20 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={`border-primary/50 bg-background/80 backdrop-blur-sm ${isSearchOpen ? "glow" : ""}`}
        >
          <Search className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-primary/50 bg-background/80 backdrop-blur-sm">
              <Layers className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-48">
            <DropdownMenuItem onClick={() => handleDatasetChange("earth")}>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-green-500" />
                <span className="font-medium">Earth</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDatasetChange("moon")}>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600" />
                <span className="font-medium">Moon</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDatasetChange("mars")}>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-red-500 to-orange-600" />
                <span className="font-medium">Mars</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDatasetChange("space")}>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
                <span className="font-medium">Space</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="icon"
          className="border-primary/50 bg-background/80 backdrop-blur-sm"
          onClick={() => router.push("/compare")}
        >
          <GitCompare className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={`border-primary/50 bg-background/80 backdrop-blur-sm ${isAnnotationActive ? "glow" : ""}`}
          onClick={handleAnnotationToggle}
        >
          <Tag className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-primary/50 bg-background/80 backdrop-blur-sm">
              <Clock className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Timeline</div>
            {(TIMELINES[dataset] || []).map((timeline) => (
              <DropdownMenuItem key={timeline}>
                <span className="font-medium">{timeline}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Panel */}
      {isSearchOpen && (
        <div className="absolute left-20 top-32 z-20 w-96 rounded-lg border border-primary/50 bg-background/95 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">Search & Navigate</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsSearchOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Input
            placeholder="Enter feature name or coordinates..."
            className="mb-3 border-primary/30"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Search Results:</p>
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.name}
                    className="w-full rounded-md border border-primary/20 bg-muted/50 p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted"
                  >
                    <div className="font-medium text-foreground">{result.name}</div>
                    <div className="text-xs text-muted-foreground">{result.coords}</div>
                    <div className="mt-1 text-xs text-foreground/70">{result.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : searchQuery ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No results found</div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Popular Features:</p>
              <div className="space-y-1">
                {(FEATURES[dataset] || []).slice(0, 3).map((feature) => (
                  <button
                    key={feature.name}
                    className="w-full rounded-md bg-muted/50 p-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="font-medium text-foreground">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">{feature.coords}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
