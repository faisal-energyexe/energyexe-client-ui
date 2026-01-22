import { useMemo } from 'react'
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { WindSpeedDistribution } from '@/lib/weather-api'

interface WindDistributionChartProps {
  data: WindSpeedDistribution | undefined
  isLoading: boolean
}

export function WindDistributionChart({ data, isLoading }: WindDistributionChartProps) {
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data) return []

    // Calculate Weibull PDF from the parameters for proper overlay
    const k = data.weibullK
    const c = data.weibullC

    return data.speedBins.map((speed, index) => {
      // Calculate Weibull PDF: f(x) = (k/c) * (x/c)^(k-1) * exp(-(x/c)^k)
      let weibullPdf = 0
      if (speed > 0 && k > 0 && c > 0) {
        const xc = speed / c
        weibullPdf = (k / c) * Math.pow(xc, k - 1) * Math.exp(-Math.pow(xc, k))
        // Scale to match percentage histogram (multiply by bin width ~1 and 100 for %)
        weibullPdf = weibullPdf * 100
      }

      return {
        speedBin: `${speed}`,
        frequency: data.frequencyPercentage[index] || 0,
        weibullPdf: weibullPdf,
      }
    })
  }, [data])

  // Calculate max frequency for better Y-axis scaling
  const maxFrequency = useMemo(() => {
    if (!chartData.length) return 20
    const maxVal = Math.max(...chartData.map(d => Math.max(d.frequency, d.weibullPdf || 0)))
    return Math.ceil(maxVal * 1.2) // Add 20% headroom
  }, [chartData])

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; name: string; color: string; dataKey: string }>
    label?: string
  }) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">
          Wind Speed: {label} m/s
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.dataKey === 'frequency' ? 'Observed' : 'Weibull Fit'}:
            </span>
            <span className="font-medium text-foreground">
              {entry.value?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data || chartData.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Wind Speed Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No distribution data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Wind Speed Distribution
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              k = {data.weibullK.toFixed(2)}
            </span>
            <span>
              c = {data.weibullC.toFixed(2)} m/s
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(215, 20%, 40%)"
              opacity={0.3}
            />
            <XAxis
              dataKey="speedBin"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Wind Speed (m/s)',
                position: 'insideBottom',
                offset: -5,
                fill: 'hsl(215, 20%, 65%)',
                fontSize: 12,
              }}
            />
            <YAxis
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              domain={[0, maxFrequency]}
              label={{
                value: 'Frequency (%)',
                angle: -90,
                position: 'insideLeft',
                fill: 'hsl(215, 20%, 65%)',
                fontSize: 12,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">
                  {value === 'frequency' ? 'Observed' : value === 'weibullPdf' ? 'Weibull Fit' : value}
                </span>
              )}
            />
            <Bar
              dataKey="frequency"
              fill="hsl(221, 83%, 53%)"
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
              name="frequency"
            />
            <Line
              type="monotone"
              dataKey="weibullPdf"
              stroke="hsl(0, 85%, 60%)"
              strokeWidth={2}
              dot={false}
              name="weibullPdf"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Statistics summary */}
        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Mean</p>
            <p className="text-sm font-medium">{data.meanSpeed.toFixed(2)} m/s</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Median</p>
            <p className="text-sm font-medium">{data.medianSpeed.toFixed(2)} m/s</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mode</p>
            <p className="text-sm font-medium">{data.modeSpeed.toFixed(2)} m/s</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Std Dev</p>
            <p className="text-sm font-medium">{data.stdDev.toFixed(2)} m/s</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
