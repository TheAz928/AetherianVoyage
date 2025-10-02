export interface PlanetStatistics {
    // Habitability
    habitabilityScore?: number // 0-100 scale

    // Physical characteristics
    radius?: number // in km
    mass?: number // in Earth masses
    surfaceArea?: number // in km²
    gravity?: number // in m/s²

    // Orbital and rotational
    dayLength?: number // in Earth hours
    yearLength?: number // in Earth days
    distanceFromStar?: number // in AU (Astronomical Units)
    escapeVelocity?: number // in km/s

    // Atmospheric and environmental
    averageTemperature?: number // in Celsius
    atmosphereComposition?: string
    surfacePressure?: number // in Earth atmospheres

    // Additional properties
    moons?: number
    type?: string // e.g., "Terrestrial", "Gas Giant", "Ice Giant", "Dwarf Planet"
}

export interface CelestialImage {
    id: string
    name: string
    description: string
    dziUrl: string // DZI file URL for OpenSeadragon
    thumbnail: string
    date?: string
    mission?: string
}

export interface Planet {
    id: string
    name: string
    description: string
    color: string
    gradient: string
    images: CelestialImage[]
    statistics?: PlanetStatistics // Added optional statistics field
}

export interface SolarSystem {
    id: string
    name: string
    description: string
    color: string
    planets: Planet[]
}

export interface Galaxy {
    id: string
    name: string
    description: string
    color: string
    gradient: string
    solarSystems: SolarSystem[]
}

// Universe data structure with multiple galaxies
export const universeData: Galaxy[] = [
    {
        id: "milky-way",
        name: "Milky Way",
        description: "Our home galaxy containing our Solar System",
        color: "from-blue-400 via-purple-500 to-pink-500",
        gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
        solarSystems: [
            {
                id: "sol",
                name: "Solar System",
                description: "Our home solar system with 8 planets",
                color: "from-yellow-400 to-orange-500",
                planets: [
                    {
                        id: "earth",
                        name: "Earth",
                        description: "The Blue Marble - Our home planet",
                        color: "from-blue-500 to-green-500",
                        gradient: "bg-gradient-to-br from-blue-500/20 to-green-500/20",
                        statistics: {
                            habitabilityScore: 100,
                            radius: 6371,
                            mass: 1.0,
                            surfaceArea: 510100000,
                            gravity: 9.807,
                            dayLength: 24,
                            yearLength: 365.25,
                            distanceFromStar: 1.0,
                            escapeVelocity: 11.186,
                            averageTemperature: 15,
                            atmosphereComposition: "78% N₂, 21% O₂, 1% Ar, trace gases",
                            surfacePressure: 1.0,
                            moons: 1,
                            type: "Terrestrial",
                        },
                        images: [
                            {
                                id: "earth-1",
                                name: "Blue Marble 2012",
                                description: "Composite image of Earth from NASA/NOAA satellites",
                                dziUrl: "/dzi/earth/blue-marble.dzi",
                                thumbnail: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop",
                                date: "2012-01-25",
                                mission: "Suomi NPP",
                            },
                            {
                                id: "earth-2",
                                name: "Earth at Night",
                                description: "Night lights showing human civilization",
                                dziUrl: "/dzi/earth/night-lights.dzi",
                                thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
                                date: "2016-04-12",
                                mission: "Suomi NPP",
                            },
                        ],
                    },
                    {
                        id: "moon",
                        name: "Moon",
                        description: "Earth's natural satellite",
                        color: "from-gray-400 to-gray-600",
                        gradient: "bg-gradient-to-br from-gray-400/20 to-gray-600/20",
                        statistics: {
                            habitabilityScore: 0,
                            radius: 1737,
                            mass: 0.0123,
                            surfaceArea: 37900000,
                            gravity: 1.62,
                            dayLength: 708.7,
                            yearLength: 27.3,
                            distanceFromStar: 1.0,
                            escapeVelocity: 2.38,
                            averageTemperature: -23,
                            atmosphereComposition: "Trace amounts (virtually none)",
                            surfacePressure: 0.0000000003,
                            moons: 0,
                            type: "Natural Satellite",
                        },
                        images: [
                            {
                                id: "moon-1",
                                name: "Lunar Surface",
                                description: "High-resolution lunar surface mapping",
                                dziUrl: "/dzi/moon/surface.dzi",
                                thumbnail: "https://static.vecteezy.com/system/resources/previews/060/630/706/non_2x/a-close-up-view-of-a-full-moon-isolated-on-transparent-background-showing-intricate-details-of-the-lunar-surface-free-png.png",
                                date: "2009-06-18",
                                mission: "LRO",
                            },
                        ],
                    },
                    {
                        id: "mars",
                        name: "Mars",
                        description: "The Red Planet",
                        color: "from-red-500 to-orange-600",
                        gradient: "bg-gradient-to-br from-red-500/20 to-orange-600/20",
                        statistics: {
                            habitabilityScore: 35,
                            radius: 3389,
                            mass: 0.107,
                            surfaceArea: 144800000,
                            gravity: 3.721,
                            dayLength: 24.6,
                            yearLength: 687,
                            distanceFromStar: 1.524,
                            escapeVelocity: 5.027,
                            averageTemperature: -63,
                            atmosphereComposition: "95% CO₂, 3% N₂, 2% Ar",
                            surfacePressure: 0.006,
                            moons: 2,
                            type: "Terrestrial",
                        },
                        images: [
                            {
                                id: "mars-1",
                                name: "Valles Marineris",
                                description: "The largest canyon in the solar system",
                                dziUrl: "/dzi/mars/valles-marineris.dzi",
                                thumbnail: "https://pngimg.com/d/mars_planet_PNG7.png",
                                date: "2021-02-18",
                                mission: "Mars Reconnaissance Orbiter",
                            },
                        ],
                    },
                ],
            },
            {
                id: "alpha-centauri",
                name: "Alpha Centauri",
                description: "The closest star system to our Solar System",
                color: "from-orange-400 to-red-500",
                planets: [
                    {
                        id: "proxima-b",
                        name: "Proxima Centauri b",
                        description: "Exoplanet in the habitable zone",
                        color: "from-teal-500 to-cyan-600",
                        gradient: "bg-gradient-to-br from-teal-500/20 to-cyan-600/20",
                        statistics: {
                            habitabilityScore: 65,
                            radius: 7160,
                            mass: 1.27,
                            gravity: 11.0,
                            dayLength: 264,
                            yearLength: 11.2,
                            distanceFromStar: 0.0485,
                            averageTemperature: -39,
                            type: "Terrestrial (Exoplanet)",
                        },
                        images: [
                            {
                                id: "proxima-1",
                                name: "Artist Concept",
                                description: "Artistic rendering of Proxima Centauri b",
                                dziUrl: "/dzi/proxima/concept.dzi",
                                thumbnail: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400&h=400&fit=crop",
                                date: "2016-08-24",
                                mission: "ESO",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "andromeda",
        name: "Andromeda",
        description: "The nearest major galaxy to the Milky Way",
        color: "from-purple-400 via-pink-500 to-rose-500",
        gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
        solarSystems: [
            {
                id: "andromeda-core",
                name: "Andromeda Core",
                description: "The central region of Andromeda galaxy",
                color: "from-purple-400 to-pink-500",
                planets: [
                    {
                        id: "andromeda-view",
                        name: "Andromeda Galaxy",
                        description: "Full view of our neighboring galaxy",
                        color: "from-purple-500 to-pink-600",
                        gradient: "bg-gradient-to-br from-purple-500/20 to-pink-600/20",
                        images: [
                            {
                                id: "andromeda-1",
                                name: "Andromeda Galaxy M31",
                                description: "High-resolution composite of Andromeda",
                                dziUrl: "/dzi/andromeda/m31.dzi",
                                thumbnail: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&h=400&fit=crop",
                                date: "2019-01-05",
                                mission: "Hubble Space Telescope",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "deep-space",
        name: "Deep Space",
        description: "Distant galaxies and cosmic phenomena",
        color: "from-indigo-400 via-violet-500 to-purple-600",
        gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-600/20",
        solarSystems: [
            {
                id: "hubble-deep-field",
                name: "Hubble Deep Field",
                description: "Looking back in time to the early universe",
                color: "from-indigo-400 to-violet-500",
                planets: [
                    {
                        id: "deep-field",
                        name: "Ultra Deep Field",
                        description: "Thousands of galaxies in a tiny patch of sky",
                        color: "from-indigo-500 to-violet-600",
                        gradient: "bg-gradient-to-br from-indigo-500/20 to-violet-600/20",
                        images: [
                            {
                                id: "hubble-1",
                                name: "Hubble Ultra Deep Field",
                                description: "The deepest visible-light image of the cosmos",
                                dziUrl: "/dzi/hubble/ultra-deep-field.dzi",
                                thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
                                date: "2004-03-09",
                                mission: "Hubble Space Telescope",
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

export function getGalaxy(galaxyId: string): Galaxy | undefined {
    return universeData.find((g) => g.id === galaxyId)
}

export function getSolarSystem(galaxyId: string, solarSystemId: string): SolarSystem | undefined {
    const galaxy = getGalaxy(galaxyId)
    return galaxy?.solarSystems.find((s) => s.id === solarSystemId)
}

export function getPlanet(galaxyId: string, solarSystemId: string, planetId: string): Planet | undefined {
    const solarSystem = getSolarSystem(galaxyId, solarSystemId)
    return solarSystem?.planets.find((p) => p.id === planetId)
}

export function getImage(
    galaxyId: string,
    solarSystemId: string,
    planetId: string,
    imageId: string,
): CelestialImage | undefined {
    const planet = getPlanet(galaxyId, solarSystemId, planetId)
    return planet?.images.find((i) => i.id === imageId)
}