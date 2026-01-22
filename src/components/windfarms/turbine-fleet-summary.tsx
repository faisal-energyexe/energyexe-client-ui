/**
 * TurbineFleetSummary - Shows detailed breakdown of turbine fleet by model.
 * Displays count, rated power, hub height, and rotor diameter for each model.
 */

import { Wind, Factory, Ruler, Circle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { TurbineUnit } from '@/types/windfarm'

interface TurbineFleetSummaryProps {
  turbineUnits?: TurbineUnit[]
  nameplateCapacityMw?: number | null
  isLoading?: boolean
}

interface TurbineModelSummary {
  model: string
  supplier: string
  count: number
  ratedPowerKw: number
  totalCapacityKw: number
  avgHubHeight: number
  avgRotorDiameter: number
}

export function TurbineFleetSummary({
  turbineUnits = [],
  nameplateCapacityMw,
  isLoading,
}: TurbineFleetSummaryProps) {
  // Group turbines by model
  const modelSummaries: TurbineModelSummary[] = []

  if (turbineUnits.length > 0) {
    const modelGroups = new Map<string, TurbineUnit[]>()

    turbineUnits.forEach((unit) => {
      const modelKey = unit.turbine_model?.model || 'Unknown'
      if (!modelGroups.has(modelKey)) {
        modelGroups.set(modelKey, [])
      }
      modelGroups.get(modelKey)!.push(unit)
    })

    modelGroups.forEach((units, model) => {
      const firstUnit = units[0]
      const ratedPowerKw = firstUnit.turbine_model?.rated_power_kw || 0
      const totalCapacityKw = units.length * ratedPowerKw

      const avgHubHeight =
        units.reduce((sum, u) => sum + (u.hub_height_m || 0), 0) / units.length
      const avgRotorDiameter =
        units.reduce((sum, u) => sum + (u.turbine_model?.rotor_diameter_m || 0), 0) /
        units.length

      modelSummaries.push({
        model,
        supplier: firstUnit.turbine_model?.supplier || 'Unknown',
        count: units.length,
        ratedPowerKw,
        totalCapacityKw,
        avgHubHeight,
        avgRotorDiameter,
      })
    })

    // Sort by total capacity descending
    modelSummaries.sort((a, b) => b.totalCapacityKw - a.totalCapacityKw)
  }

  // Calculate totals
  const totalTurbines = turbineUnits.length
  const totalCapacityKw = modelSummaries.reduce((sum, m) => sum + m.totalCapacityKw, 0)
  const totalCapacityMw = totalCapacityKw / 1000
  const capacityMatch = nameplateCapacityMw
    ? ((totalCapacityMw / nameplateCapacityMw) * 100).toFixed(0)
    : null

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wind className="h-5 w-5 text-primary" />
            Turbine Fleet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-muted/50 rounded animate-pulse" />
            <div className="h-24 bg-muted/50 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (turbineUnits.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wind className="h-5 w-5 text-primary" />
            Turbine Fleet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">No turbine data available</p>
              <p className="text-xs mt-1">
                Turbine unit information has not been added for this wind farm.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wind className="h-5 w-5 text-primary" />
          Turbine Fleet
          <Badge variant="outline" className="ml-auto">
            {totalTurbines} turbine{totalTurbines !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-muted/30">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totalTurbines}</p>
            <p className="text-xs text-muted-foreground">Total Units</p>
          </div>
          <div className="text-center border-x border-border/30">
            <p className="text-2xl font-bold text-foreground">
              {totalCapacityMw.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Rated MW</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {modelSummaries.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Model{modelSummaries.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Capacity Comparison */}
        {nameplateCapacityMw && capacityMatch && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Turbine vs Nameplate Capacity</span>
              <span className="font-medium">
                {totalCapacityMw.toFixed(1)} / {nameplateCapacityMw.toFixed(1)} MW
              </span>
            </div>
            <Progress
              value={Math.min(parseFloat(capacityMatch), 100)}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground text-right">
              {capacityMatch}% of nameplate capacity
            </p>
          </div>
        )}

        {/* Model Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Model Breakdown
          </h4>
          {modelSummaries.map((summary) => (
            <div
              key={summary.model}
              className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{summary.model}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Factory className="h-3 w-3" />
                    {summary.supplier}
                  </p>
                </div>
                <Badge variant="secondary">
                  {summary.count} unit{summary.count !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Wind className="h-3.5 w-3.5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Rated Power</p>
                    <p className="font-medium">
                      {(summary.ratedPowerKw / 1000).toFixed(1)} MW
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="h-3.5 w-3.5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Hub Height</p>
                    <p className="font-medium">
                      {summary.avgHubHeight > 0
                        ? `${summary.avgHubHeight.toFixed(0)} m`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="h-3.5 w-3.5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Rotor</p>
                    <p className="font-medium">
                      {summary.avgRotorDiameter > 0
                        ? `${summary.avgRotorDiameter.toFixed(0)} m`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacity bar */}
              {totalCapacityKw > 0 && (
                <div className="space-y-1">
                  <Progress
                    value={(summary.totalCapacityKw / totalCapacityKw) * 100}
                    className="h-1.5"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {((summary.totalCapacityKw / totalCapacityKw) * 100).toFixed(0)}% of fleet capacity
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TurbineFleetSummary
