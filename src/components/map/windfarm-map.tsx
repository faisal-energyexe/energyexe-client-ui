/**
 * WindfarmMap - Interactive map view of wind farm portfolio.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Map,
  Filter,
  ZoomIn,
  ZoomOut,
  LocateFixed,
  Wind,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useWindfarms } from '@/lib/windfarms-api'
import type { WindfarmListItem } from '@/types/windfarm'

// Dynamic import for Leaflet to avoid SSR issues
let L: typeof import('leaflet') | null = null

// Status colors
const STATUS_COLORS: Record<string, string> = {
  operational: '#22c55e',
  under_installation: '#3b82f6',
  decommissioned: '#6b7280',
  repowered: '#8b5cf6',
}

// Location type colors
const LOCATION_TYPE_COLORS: Record<string, string> = {
  onshore: '#f59e0b',
  offshore: '#06b6d4',
}

interface MapFilters {
  status: string
  locationType: string
  colorBy: 'status' | 'location_type' | 'capacity'
  showLabels: boolean
}

export function WindfarmMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  const [filters, setFilters] = useState<MapFilters>({
    status: 'all',
    locationType: 'all',
    colorBy: 'status',
    showLabels: false,
  })

  const [selectedFarm, setSelectedFarm] = useState<WindfarmListItem | null>(null)
  const [mapReady, setMapReady] = useState(false)

  const { data: windfarms, isLoading, error } = useWindfarms({ limit: 500 })

  // Filter windfarms
  const filteredWindfarms = (windfarms || []).filter((farm) => {
    if (!farm.lat || !farm.lng) return false
    if (filters.status !== 'all' && farm.status !== filters.status) return false
    if (filters.locationType !== 'all' && farm.location_type !== filters.locationType) return false
    return true
  })

  // Get marker color based on colorBy setting
  const getMarkerColor = useCallback(
    (farm: WindfarmListItem) => {
      switch (filters.colorBy) {
        case 'status':
          return STATUS_COLORS[farm.status || 'operational'] || '#6b7280'
        case 'location_type':
          return LOCATION_TYPE_COLORS[farm.location_type || 'onshore'] || '#6b7280'
        case 'capacity':
          const capacity = farm.nameplate_capacity_mw || 0
          if (capacity > 500) return '#22c55e'
          if (capacity > 200) return '#3b82f6'
          if (capacity > 50) return '#f59e0b'
          return '#6b7280'
        default:
          return '#3b82f6'
      }
    },
    [filters.colorBy]
  )

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initMap = async () => {
      const leaflet = await import('leaflet')
      L = leaflet.default || leaflet
      await import('leaflet/dist/leaflet.css')

      if (!mapRef.current || mapInstanceRef.current || !L) return

      const map = L.map(mapRef.current, {
        center: [54.5, 5],
        zoom: 4,
        zoomControl: false,
        attributionControl: true,
      })

      mapInstanceRef.current = map
      markersRef.current = L.layerGroup().addTo(map)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map)

      setMapReady(true)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = null
      }
    }
  }, [])

  // Update markers when data or filters change
  useEffect(() => {
    if (!mapReady || !L || !markersRef.current) return

    markersRef.current.clearLayers()

    filteredWindfarms.forEach((farm) => {
      if (!farm.lat || !farm.lng) return

      const color = getMarkerColor(farm)
      const size = Math.max(12, Math.min(30, (farm.nameplate_capacity_mw || 50) / 20 + 10))

      const icon = L!.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border: 2px solid rgba(255,255,255,0.8);
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            ${filters.showLabels ? `<span style="position:absolute;top:${size + 4}px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:10px;color:white;text-shadow:0 1px 2px black;">${farm.name}</span>` : ''}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const marker = L!.marker([farm.lat, farm.lng], { icon })
        .addTo(markersRef.current!)
        .on('click', () => setSelectedFarm(farm))

      marker.bindPopup(`
        <div style="min-width: 200px; color: #1f2937;">
          <strong style="font-size: 14px;">${farm.name}</strong>
          <div style="margin-top: 8px; font-size: 12px;">
            ${farm.nameplate_capacity_mw ? `<div><strong>Capacity:</strong> ${farm.nameplate_capacity_mw.toFixed(1)} MW</div>` : ''}
            ${farm.country?.name ? `<div><strong>Country:</strong> ${farm.country.name}</div>` : ''}
            ${farm.location_type ? `<div><strong>Type:</strong> ${farm.location_type}</div>` : ''}
            ${farm.status ? `<div><strong>Status:</strong> ${farm.status}</div>` : ''}
          </div>
          <div style="margin-top: 8px;">
            <a href="/wind-farms/${farm.id}" style="color: #3b82f6; text-decoration: underline;">View Details</a>
          </div>
        </div>
      `)
    })
  }, [mapReady, filteredWindfarms, filters.showLabels, getMarkerColor])

  // Map controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()
  const handleFitBounds = () => {
    if (!mapInstanceRef.current || !L || filteredWindfarms.length === 0) return
    const bounds = L.latLngBounds(
      filteredWindfarms
        .filter((f) => f.lat && f.lng)
        .map((f) => [f.lat!, f.lng!])
    )
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
  }

  // Stats
  const totalCapacity = filteredWindfarms.reduce(
    (sum, f) => sum + (f.nameplate_capacity_mw || 0),
    0
  )
  const onshoreCount = filteredWindfarms.filter(
    (f) => f.location_type === 'onshore'
  ).length
  const offshoreCount = filteredWindfarms.filter(
    (f) => f.location_type === 'offshore'
  ).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Failed to load wind farms</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Map className="h-6 w-6 text-primary" />
            Wind Farm Map
          </h2>
          <p className="text-muted-foreground mt-1">
            Interactive map of your wind farm portfolio
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Wind className="h-3 w-3 mr-1" />
            {filteredWindfarms.length} Farms
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <MapPin className="h-3 w-3 mr-1" />
            {totalCapacity.toFixed(0)} MW
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="under_installation">Under Installation</SelectItem>
                  <SelectItem value="decommissioned">Decommissioned</SelectItem>
                  <SelectItem value="repowered">Repowered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Location Type</Label>
              <Select
                value={filters.locationType}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, locationType: value }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="onshore">Onshore</SelectItem>
                  <SelectItem value="offshore">Offshore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Color By</Label>
              <Select
                value={filters.colorBy}
                onValueChange={(value: 'status' | 'location_type' | 'capacity') =>
                  setFilters((prev) => ({ ...prev, colorBy: value }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="location_type">Location Type</SelectItem>
                  <SelectItem value="capacity">Capacity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label className="text-xs">Show Labels</Label>
              <Switch
                checked={filters.showLabels}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, showLabels: checked }))
                }
              />
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-border/50">
              <Label className="text-xs mb-2 block">Legend</Label>
              {filters.colorBy === 'status' && (
                <div className="space-y-1 text-xs">
                  {Object.entries(STATUS_COLORS).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              )}
              {filters.colorBy === 'location_type' && (
                <div className="space-y-1 text-xs">
                  {Object.entries(LOCATION_TYPE_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              )}
              {filters.colorBy === 'capacity' && (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span>&gt; 500 MW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>200-500 MW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>50-200 MW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-500" />
                    <span>&lt; 50 MW</span>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="pt-4 border-t border-border/50 space-y-2">
              <Label className="text-xs mb-2 block">Summary</Label>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Total Farms:</span>
                  <span className="font-medium">{filteredWindfarms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Capacity:</span>
                  <span className="font-medium">{totalCapacity.toFixed(0)} MW</span>
                </div>
                <div className="flex justify-between">
                  <span>Onshore:</span>
                  <span className="font-medium">{onshoreCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Offshore:</span>
                  <span className="font-medium">{offshoreCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 lg:col-span-3 relative overflow-hidden">
          <CardContent className="p-0">
            <div
              ref={mapRef}
              className="h-[600px] w-full"
              style={{ background: 'var(--color-muted)' }}
            />

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
              <Button
                size="icon"
                variant="secondary"
                onClick={handleZoomIn}
                className="h-8 w-8 bg-card/90 backdrop-blur-sm"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleZoomOut}
                className="h-8 w-8 bg-card/90 backdrop-blur-sm"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleFitBounds}
                className="h-8 w-8 bg-card/90 backdrop-blur-sm"
                title="Fit to bounds"
              >
                <LocateFixed className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Farm Info */}
            {selectedFarm && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[1000]">
                <Card className="bg-card/95 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-medium">{selectedFarm.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {selectedFarm.country?.name}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setSelectedFarm(null)}
                      >
                        <span className="sr-only">Close</span>
                        &times;
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      {selectedFarm.nameplate_capacity_mw && (
                        <div>
                          <span className="text-muted-foreground">Capacity</span>
                          <p className="font-medium">
                            {selectedFarm.nameplate_capacity_mw.toFixed(1)} MW
                          </p>
                        </div>
                      )}
                      {selectedFarm.status && (
                        <div>
                          <span className="text-muted-foreground">Status</span>
                          <p className="font-medium capitalize">
                            {selectedFarm.status.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                      {selectedFarm.location_type && (
                        <div>
                          <span className="text-muted-foreground">Type</span>
                          <p className="font-medium capitalize">
                            {selectedFarm.location_type}
                          </p>
                        </div>
                      )}
                    </div>

                    <Link
                      to="/wind-farms/$windfarmId"
                      params={{ windfarmId: selectedFarm.id.toString() }}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View Details
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
