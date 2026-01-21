import { MapPin, Globe, Building2, Map } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WindfarmWithOwners } from '@/types/windfarm'

interface LocationCardProps {
  windfarm: WindfarmWithOwners
}

export function LocationCard({ windfarm }: LocationCardProps) {
  // Build location hierarchy
  const locationParts = [
    windfarm.country?.name,
    windfarm.state?.name,
    windfarm.region?.name,
  ].filter(Boolean)

  const hasCoordinates = windfarm.lat && windfarm.lng

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map placeholder */}
        {hasCoordinates ? (
          <div className="relative h-40 rounded-lg overflow-hidden bg-muted/30 border border-border/50">
            {/* Simple map placeholder - in production, use Leaflet or similar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {windfarm.lat?.toFixed(4)}, {windfarm.lng?.toFixed(4)}
                </div>
              </div>
            </div>
            {/* Map pin overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary fill-primary/20 drop-shadow-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-full w-1 h-4 bg-primary/20 rounded-full blur-sm" />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-32 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center text-muted-foreground">
            No coordinates available
          </div>
        )}

        {/* Location hierarchy */}
        <div className="space-y-3">
          {/* Address if available */}
          {windfarm.address && (
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm text-foreground">
                  {windfarm.address}
                  {windfarm.postal_code && `, ${windfarm.postal_code}`}
                </p>
              </div>
            </div>
          )}

          {/* Geographic hierarchy */}
          <div className="flex items-start gap-3">
            <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Geographic Location</p>
              <p className="text-sm text-foreground">
                {locationParts.length > 0
                  ? locationParts.join(' > ')
                  : 'Location not specified'}
              </p>
            </div>
          </div>

          {/* Coordinates */}
          {hasCoordinates && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Coordinates</p>
                <p className="text-sm text-foreground font-mono">
                  {windfarm.lat?.toFixed(6)}, {windfarm.lng?.toFixed(6)}
                </p>
              </div>
            </div>
          )}

          {/* Grid location */}
          {(windfarm.bidzone?.name || windfarm.market_balance_area?.name) && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">
                Grid Location
              </p>
              <div className="flex flex-wrap gap-2">
                {windfarm.bidzone?.name && (
                  <div className="px-2 py-1 rounded bg-primary/10 text-xs">
                    <span className="text-muted-foreground">Bidzone:</span>{' '}
                    <span className="text-foreground">{windfarm.bidzone.name}</span>
                  </div>
                )}
                {windfarm.market_balance_area?.name && (
                  <div className="px-2 py-1 rounded bg-cyan-500/10 text-xs">
                    <span className="text-muted-foreground">MBA:</span>{' '}
                    <span className="text-foreground">
                      {windfarm.market_balance_area.name}
                    </span>
                  </div>
                )}
                {windfarm.control_area?.name && (
                  <div className="px-2 py-1 rounded bg-emerald-500/10 text-xs">
                    <span className="text-muted-foreground">Control Area:</span>{' '}
                    <span className="text-foreground">
                      {windfarm.control_area.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
