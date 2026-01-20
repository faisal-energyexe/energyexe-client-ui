import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { windfarmLocations } from '@/lib/mock-data'

// Dynamic import for Leaflet to avoid SSR issues
let L: typeof import('leaflet') | null = null

export function MapPreview() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const initMap = async () => {
      // Dynamically import Leaflet
      const leaflet = await import('leaflet')
      L = leaflet.default || leaflet

      // Import Leaflet CSS
      await import('leaflet/dist/leaflet.css')

      if (!mapRef.current || mapInstanceRef.current || !L) return

      // Initialize map centered on North Sea
      const map = L.map(mapRef.current, {
        center: [54.5, 2],
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
      })

      mapInstanceRef.current = map

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      // Add markers for each windfarm
      // Capture L in local variable to avoid null check issues
      const leafletLib = L
      windfarmLocations.forEach((farm) => {
        const color = farm.status === 'operational' ? '#22c55e' : '#eab308'

        const icon = leafletLib.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background-color: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        leafletLib.marker([farm.lat, farm.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 150px;">
              <strong>${farm.name}</strong><br/>
              Capacity: ${farm.capacity}<br/>
              Turbines: ${farm.turbines}<br/>
              Status: ${farm.status}
            </div>
          `)
      })
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Wind Farm Locations</CardTitle>
            <CardDescription>Active monitoring sites</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
              {windfarmLocations.filter((f) => f.status === 'operational').length} Operational
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
              {windfarmLocations.filter((f) => f.status === 'maintenance').length} Maintenance
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="h-[250px] w-full rounded-lg border border-border overflow-hidden"
          style={{ background: 'var(--color-muted)' }}
        />
      </CardContent>
    </Card>
  )
}
