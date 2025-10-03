"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, MapPin } from "lucide-react"

interface Annotation {
    id: string
    x: number
    y: number
    label: string
    color: string
}

interface AnnotationLayerProps {
    isActive: boolean
    zoom: number
    position: { x: number; y: number }
}

export function AnnotationLayer({ isActive, zoom, position }: AnnotationLayerProps) {
    const [annotations, setAnnotations] = useState<Annotation[]>([])
    const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null)
    const [editLabel, setEditLabel] = useState("")

    // Handle click on canvas to create a pending annotation
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isActive || editingAnnotation) return // prevent multiple pending annotations

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const newAnnotation: Annotation = {
            id: Date.now().toString(),
            x,
            y,
            label: "",
            color: "#9B59B6",
        }

        setEditingAnnotation(newAnnotation)
        setEditLabel("")
    }

    // Save the typed label
    const handleSaveLabel = () => {
        if (!editingAnnotation) return
        const savedAnnotation: Annotation = { ...editingAnnotation, label: editLabel || "Unnamed" }
        setAnnotations([...annotations, savedAnnotation])
        setEditingAnnotation(null)
        setEditLabel("")
    }

    // Cancel editing
    const handleCancelLabel = () => {
        setEditingAnnotation(null)
        setEditLabel("")
    }

    // Delete existing annotation
    const handleDeleteAnnotation = (id: string) => {
        setAnnotations(annotations.filter((ann) => ann.id !== id))
    }

    return (
        <>
            {/* Annotation Canvas */}
            <div
                className="absolute inset-0 z-10"
                onClick={handleClick}
                style={{
                    cursor: isActive ? "crosshair" : "default",
                    pointerEvents: isActive ? "auto" : "none",
                }}
            >
                {/* Render existing annotations */}
                {annotations.map((annotation) => (
                    <div
                        key={annotation.id}
                        className="absolute"
                        style={{
                            left: annotation.x,
                            top: annotation.y,
                            transform: `translate(-50%, -100%)`,
                        }}
                    >
                        <div className="relative">
                            <MapPin className="h-8 w-8 drop-shadow-lg" style={{ color: annotation.color }} fill={annotation.color} />
                            <div className="absolute left-1/2 top-full mt-2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-primary/50 bg-background/95 px-3 py-1.5 backdrop-blur-sm">
                                <span className="text-sm font-medium">{annotation.label}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setEditingAnnotation(annotation)
                                        setEditLabel(annotation.label)
                                        setAnnotations(annotations.filter((a) => a.id !== annotation.id)) // remove temporarily from list
                                    }}
                                    className="text-xs text-primary hover:text-primary/80"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteAnnotation(annotation.id)
                                    }}
                                    className="text-destructive hover:text-destructive/80"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Render pending editing annotation */}
                {editingAnnotation && (
                    <div
                        className="absolute"
                        style={{
                            left: editingAnnotation.x,
                            top: editingAnnotation.y,
                            transform: `translate(-50%, -100%)`,
                        }}
                    >
                        <div className="relative">
                            <MapPin
                                className="h-8 w-8 drop-shadow-lg"
                                style={{ color: editingAnnotation.color }}
                                fill={editingAnnotation.color}
                            />
                            <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-lg border border-primary/50 bg-background/95 p-2 backdrop-blur-sm">
                                <Input
                                    value={editLabel}
                                    onChange={(e) => setEditLabel(e.target.value)}
                                    className="mb-2 w-48 border-primary/30"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveLabel()
                                        if (e.key === "Escape") handleCancelLabel()
                                    }}
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleSaveLabel}>
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelLabel}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Annotation List */}
            {annotations.length > 0 && (
                <div className="absolute right-4 top-32 z-20 w-64 rounded-lg border border-primary/50 bg-background/95 p-3 backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            Annotations ({annotations.length})
                        </h3>
                        <Button size="sm" variant="ghost" onClick={() => setAnnotations([])} className="h-6 px-2 text-xs">
                            Clear All
                        </Button>
                    </div>
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                        {annotations.map((annotation) => (
                            <div
                                key={annotation.id}
                                className="flex items-center justify-between rounded-md border border-primary/20 bg-muted/50 p-2"
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" style={{ color: annotation.color }} />
                                    <span className="text-sm">{annotation.label}</span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => handleDeleteAnnotation(annotation.id)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
