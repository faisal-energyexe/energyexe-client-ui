import {
  Zap,
  Waves,
  Mountain,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  Shield,
  Plug,
  FileCheck,
  Wind,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WindfarmWithOwners, TurbineUnit } from '@/types/windfarm'

interface TechnicalSpecsProps {
  windfarm: WindfarmWithOwners
  turbineUnits?: TurbineUnit[]
}

export function TechnicalSpecs({ windfarm, turbineUnits }: TechnicalSpecsProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (
    amount: number | null | undefined,
    currency: string | null | undefined,
  ) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate turbine stats
  const uniqueModels = new Set(
    turbineUnits?.map((t) => t.turbine_model?.model).filter(Boolean),
  )
  const totalTurbines = turbineUnits?.length || 0
  const totalRatedPower =
    turbineUnits?.reduce(
      (sum, t) => sum + (t.turbine_model?.rated_power_kw || 0),
      0,
    ) || 0
  const avgHubHeight =
    turbineUnits && turbineUnits.length > 0
      ? turbineUnits.reduce((sum, t) => sum + (t.hub_height_m || 0), 0) /
        turbineUnits.length
      : null

  const specs = [
    {
      category: 'Capacity & Power',
      items: [
        {
          icon: Zap,
          label: 'Nameplate Capacity',
          value: windfarm.nameplate_capacity_mw
            ? `${windfarm.nameplate_capacity_mw.toFixed(1)} MW`
            : 'N/A',
        },
        {
          icon: Wind,
          label: 'Total Turbines',
          value: totalTurbines > 0 ? totalTurbines.toString() : 'N/A',
        },
        {
          icon: Zap,
          label: 'Total Rated Power',
          value:
            totalRatedPower > 0 ? `${(totalRatedPower / 1000).toFixed(1)} MW` : 'N/A',
        },
      ],
    },
    {
      category: 'Location & Type',
      items: [
        {
          icon: windfarm.location_type === 'offshore' ? Waves : Mountain,
          label: 'Location Type',
          value: windfarm.location_type || 'N/A',
          capitalize: true,
        },
        {
          icon: Building2,
          label: 'Foundation Type',
          value: windfarm.foundation_type || 'N/A',
          capitalize: true,
        },
        {
          icon: MapPin,
          label: 'Coordinates',
          value:
            windfarm.lat && windfarm.lng
              ? `${windfarm.lat.toFixed(4)}, ${windfarm.lng.toFixed(4)}`
              : 'N/A',
        },
      ],
    },
    {
      category: 'Turbine Fleet',
      items: [
        {
          icon: Wind,
          label: 'Turbine Models',
          value:
            uniqueModels.size > 0
              ? Array.from(uniqueModels).slice(0, 2).join(', ') +
                (uniqueModels.size > 2 ? ` +${uniqueModels.size - 2} more` : '')
              : 'N/A',
        },
        {
          icon: Building2,
          label: 'Avg Hub Height',
          value: avgHubHeight ? `${avgHubHeight.toFixed(1)} m` : 'N/A',
        },
        {
          icon: Wind,
          label: 'Supplier',
          value: turbineUnits?.[0]?.turbine_model?.supplier || 'N/A',
        },
      ],
    },
    {
      category: 'Key Dates',
      items: [
        {
          icon: Calendar,
          label: 'Commercial Operation Date',
          value: formatDate(windfarm.commercial_operational_date),
        },
        {
          icon: Calendar,
          label: 'First Power Date',
          value: formatDate(windfarm.first_power_date),
        },
      ],
    },
  ]

  const statusItems = [
    {
      icon: Shield,
      label: 'Environmental Assessment',
      value: windfarm.environmental_assessment_status,
      isStatus: true,
    },
    {
      icon: FileCheck,
      label: 'Permits Obtained',
      value: windfarm.permits_obtained ? 'Yes' : 'No',
      isBool: true,
      boolValue: windfarm.permits_obtained,
    },
    {
      icon: Plug,
      label: 'Grid Connection',
      value: windfarm.grid_connection_status,
      isStatus: true,
    },
  ]

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Technical Specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spec grids */}
        {specs.map((section) => (
          <div key={section.category}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {section.category}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p
                      className={`text-sm font-medium text-foreground truncate ${
                        'capitalize' in item && item.capitalize
                          ? 'capitalize'
                          : ''
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Status & Permits */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Status & Permits
          </h4>
          <div className="flex flex-wrap gap-3">
            {statusItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {item.label}:
                </span>
                {'isBool' in item && item.isBool ? (
                  <Badge
                    variant="outline"
                    className={
                      item.boolValue
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }
                  >
                    {item.value}
                  </Badge>
                ) : (
                  <span className="text-sm font-medium text-foreground capitalize">
                    {item.value || 'N/A'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Investment */}
        {windfarm.total_investment_amount && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Investment
            </h4>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-md bg-amber-500/10">
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Investment
                </p>
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(
                    windfarm.total_investment_amount,
                    windfarm.investment_currency,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
