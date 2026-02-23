import { useMemo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { Gauge } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useComparisonStatistics,
  type WindfarmStatistics,
  getChartColor,
} from '@/lib/comparison-api'

interface RadarComparisonProps {
  selectedIds: number[]
  periodDays?: number
  excludeRampUp?: boolean
}

interface RadarDataPoint {
  metric: string
  fullMark: number
  [key: string]: number | string
}

export function RadarComparison({ selectedIds, periodDays = 30, excludeRampUp = true }: RadarComparisonProps) {
  const { data: statistics, isLoading, error } = useComparisonStatistics(selectedIds, periodDays, excludeRampUp)

  // Transform data for radar chart
  const { radarData, windfarmInfo } = useMemo(() => {
    if (!statistics || statistics.length === 0) {
      return { radarData: [], windfarmInfo: [] }
    }

    // Sort statistics by selectedIds order
    const sortedStats = selectedIds
      .map((id) => statistics.find((s) => s.windfarm_id === id))
      .filter((s): s is WindfarmStatistics => s != null)

    const wfInfo = sortedStats.map((s) => ({
      id: s.windfarm_id,
      name: s.windfarm_name,
    }))

    // Calculate normalized scores (0-100) for each metric
    const metrics: Array<{
      key: keyof WindfarmStatistics
      label: string
      higherIsBetter: boolean
    }> = [
      { key: 'avg_capacity_factor', label: 'Capacity Factor', higherIsBetter: true },
      { key: 'availability_percent', label: 'Availability', higherIsBetter: true },
      { key: 'data_completeness', label: 'Data Quality', higherIsBetter: true },
      { key: 'avg_generation', label: 'Avg Generation', higherIsBetter: true },
      { key: 'peak_generation', label: 'Peak Power', higherIsBetter: true },
    ]

    const data: RadarDataPoint[] = metrics.map(({ key, label, higherIsBetter }) => {
      const values = sortedStats.map((s) => {
        const val = s[key]
        return typeof val === 'number' ? val : 0
      })

      const maxVal = Math.max(...values, 0.001) // Avoid division by zero
      const minVal = Math.min(...values)

      const dataPoint: RadarDataPoint = {
        metric: label,
        fullMark: 100,
      }

      sortedStats.forEach((stat) => {
        const rawValue = typeof stat[key] === 'number' ? (stat[key] as number) : 0
        // Normalize to 0-100 scale
        let normalized: number
        if (maxVal === minVal) {
          normalized = 50 // All same value
        } else if (higherIsBetter) {
          normalized = ((rawValue - minVal) / (maxVal - minVal)) * 80 + 20 // Scale to 20-100
        } else {
          normalized = ((maxVal - rawValue) / (maxVal - minVal)) * 80 + 20
        }
        dataPoint[`wf_${stat.windfarm_id}`] = Math.round(normalized)
      })

      return dataPoint
    })

    return { radarData: data, windfarmInfo: wfInfo }
  }, [statistics, selectedIds])

  if (selectedIds.length < 2) {
    return null
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          Multi-Dimensional Comparison
        </CardTitle>
        <CardDescription>
          Normalized performance scores across key metrics (higher is better)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : error || radarData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Failed to load comparison data
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="hsl(215, 20%, 40%)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(215, 20%, 40%)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(215, 20%, 40%)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value, name) => {
                    const strName = String(name ?? '')
                    const wfInfo = windfarmInfo.find((i) => `wf_${i.id}` === strName)
                    return [`Score: ${value ?? 'N/A'}`, wfInfo?.name || strName]
                  }}
                />
                <Legend
                  formatter={(value) => {
                    const wfInfo = windfarmInfo.find((i) => `wf_${i.id}` === value)
                    return wfInfo?.name || value
                  }}
                />
                {windfarmInfo.map((wf, index) => (
                  <Radar
                    key={wf.id}
                    name={`wf_${wf.id}`}
                    dataKey={`wf_${wf.id}`}
                    stroke={getChartColor(index)}
                    fill={getChartColor(index)}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
