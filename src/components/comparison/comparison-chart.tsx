import { useMemo, useState, useCallback, lazy, Suspense } from 'react'

const Plot = lazy(() => import('react-plotly.js'))
import { TrendingUp, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useComparisonData,
  type ComparisonDataPoint,
  getChartColor,
} from '@/lib/comparison-api'

interface ComparisonChartProps {
  selectedIds: number[]
  startDate: string | null
  endDate: string | null
  excludeRampUp?: boolean
  includeRampUp?: boolean
}

type MetricType = 'generation' | 'capacity_factor'
type Granularity = 'hourly' | 'daily' | 'weekly' | 'monthly'

export function ComparisonChart({
  selectedIds,
  startDate,
  endDate,
  excludeRampUp = true,
  includeRampUp = false,
}: ComparisonChartProps) {
  const [metricType, setMetricType] = useState<MetricType>('generation')
  const [granularity, setGranularity] = useState<Granularity>('daily')

  const { data, isLoading, error } = useComparisonData(
    selectedIds,
    startDate,
    endDate,
    granularity,
    excludeRampUp,
  )

  // Get unique windfarm info preserving selection order
  const windfarmInfo = useMemo(() => {
    if (!data?.data) return []
    const seen = new Set<number>()
    const info: Array<{ id: number; name: string }> = []
    data.data.forEach((point: ComparisonDataPoint) => {
      if (!seen.has(point.windfarm_id)) {
        seen.add(point.windfarm_id)
        info.push({ id: point.windfarm_id, name: point.windfarm_name })
      }
    })
    return selectedIds
      .map((id) => info.find((i) => i.id === id))
      .filter((i): i is { id: number; name: string } => i != null)
  }, [data, selectedIds])

  // Group data by windfarm, sorted by period
  const perWinffarm = useMemo(() => {
    if (!data?.data) return new Map<number, ComparisonDataPoint[]>()
    const map = new Map<number, ComparisonDataPoint[]>()
    data.data.forEach((pt) => {
      if (!map.has(pt.windfarm_id)) map.set(pt.windfarm_id, [])
      map.get(pt.windfarm_id)!.push(pt)
    })
    // Sort each windfarm's data by period
    for (const arr of map.values()) {
      arr.sort((a, b) => a.period.localeCompare(b.period))
    }
    return map
  }, [data])

  // Build ramp-up highlight shapes (vertical bands over periods with ramp-up data)
  const rampUpShapes = useMemo(() => {
    if (!includeRampUp || !data?.data) return []

    // Collect periods that have any ramp-up points across any windfarm
    const rampUpPeriods = new Set<string>()
    data.data.forEach((pt) => {
      if (pt.ramp_up_points > 0) rampUpPeriods.add(pt.period)
    })

    if (rampUpPeriods.size === 0) return []

    // Sort periods to find contiguous ranges
    const sorted = Array.from(rampUpPeriods).sort()

    // Build contiguous ranges for cleaner shapes
    const ranges: Array<{ start: string; end: string }> = []
    let rangeStart = sorted[0]
    let prev = sorted[0]

    for (let i = 1; i < sorted.length; i++) {
      const cur = sorted[i]
      // Check if consecutive (within 2x the expected gap)
      const prevDate = new Date(prev)
      const curDate = new Date(cur)
      const gapMs = curDate.getTime() - prevDate.getTime()
      const maxGapMs =
        granularity === 'hourly'
          ? 2 * 3600 * 1000
          : granularity === 'daily'
            ? 2 * 86400 * 1000
            : granularity === 'weekly'
              ? 2 * 7 * 86400 * 1000
              : 2 * 31 * 86400 * 1000

      if (gapMs > maxGapMs) {
        ranges.push({ start: rangeStart, end: prev })
        rangeStart = cur
      }
      prev = cur
    }
    ranges.push({ start: rangeStart, end: prev })

    return ranges.map((r) => ({
      type: 'rect' as const,
      xref: 'x' as const,
      yref: 'paper' as const,
      x0: r.start,
      x1: r.end,
      y0: 0,
      y1: 1,
      fillcolor: 'rgba(251, 191, 36, 0.12)',
      line: { width: 1, color: 'rgba(251, 191, 36, 0.3)', dash: 'dot' as const },
      layer: 'below' as const,
    }))
  }, [includeRampUp, data, granularity])

  // Build ramp-up annotation
  const rampUpAnnotations = useMemo(() => {
    if (rampUpShapes.length === 0) return []
    // Place one label on the first ramp-up region
    const first = rampUpShapes[0]
    return [
      {
        x: first.x0,
        y: 1,
        xref: 'x' as const,
        yref: 'paper' as const,
        text: 'Ramp-up period',
        showarrow: false,
        font: { size: 11, color: 'rgb(251, 191, 36)' },
        bgcolor: 'rgba(251, 191, 36, 0.15)',
        bordercolor: 'rgba(251, 191, 36, 0.4)',
        borderwidth: 1,
        borderpad: 3,
        xanchor: 'left' as const,
        yanchor: 'top' as const,
        yshift: -4,
      },
    ]
  }, [rampUpShapes])

  // Build Plotly traces
  const traces = useMemo(() => {
    if (!windfarmInfo.length) return []

    return windfarmInfo.map((wf, index) => {
      const points = perWinffarm.get(wf.id) || []
      const x = points.map((p) => p.period)
      const color = getChartColor(index)

      if (metricType === 'generation') {
        const y = points.map((p) => p.total_generation)
        return {
          x,
          y,
          type: 'bar' as const,
          name: wf.name,
          marker: { color, opacity: 0.85 },
          hovertemplate:
            '<b>%{fullData.name}</b><br>%{x}<br>Generation: %{y:,.1f} MWh<extra></extra>',
        }
      } else {
        const y = points.map((p) =>
          p.avg_capacity_factor != null ? p.avg_capacity_factor * 100 : null,
        )
        return {
          x,
          y,
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: wf.name,
          line: { color, width: 2 },
          connectgaps: false,
          hovertemplate:
            '<b>%{fullData.name}</b><br>%{x}<br>CF: %{y:.1f}%<extra></extra>',
        }
      }
    })
  }, [windfarmInfo, perWinffarm, metricType])

  const layout = useMemo(
    () => ({
      autosize: true,
      margin: { t: 10, r: 20, b: 50, l: 70 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: 'hsl(215, 20%, 65%)', size: 12 },
      xaxis: {
        gridcolor: 'rgba(100,116,139,0.15)',
        linecolor: 'rgba(100,116,139,0.3)',
        tickangle: granularity === 'hourly' ? -45 : 0,
      },
      yaxis: {
        title: { text: metricType === 'generation' ? 'Generation (MWh)' : 'Capacity Factor (%)' },
        gridcolor: 'rgba(100,116,139,0.15)',
        linecolor: 'rgba(100,116,139,0.3)',
        rangemode: 'tozero' as const,
      },
      barmode: 'group' as const,
      bargap: 0.15,
      bargroupgap: 0.05,
      legend: {
        orientation: 'h' as const,
        y: -0.15,
        x: 0.5,
        xanchor: 'center' as const,
        font: { size: 11 },
      },
      hovermode: 'x unified' as const,
      shapes: rampUpShapes,
      annotations: rampUpAnnotations,
    }),
    [metricType, granularity, rampUpShapes, rampUpAnnotations],
  )

  const config = useMemo(
    () => ({
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: [
        'lasso2d' as const,
        'select2d' as const,
        'autoScale2d' as const,
      ],
    }),
    [],
  )

  const handleRelayout = useCallback(() => {
    // Placeholder for future zoom/pan handling
  }, [])

  if (selectedIds.length < 2) return null

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {metricType === 'generation' ? 'Generation Comparison' : 'Capacity Factor Comparison'}
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            <Button
              variant={metricType === 'generation' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMetricType('generation')}
              className="rounded-none"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Generation
            </Button>
            <Button
              variant={metricType === 'capacity_factor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMetricType('capacity_factor')}
              className="rounded-none"
            >
              CF %
            </Button>
          </div>

          {/* Granularity Selector */}
          <Select value={granularity} onValueChange={(v) => setGranularity(v as Granularity)}>
            <SelectTrigger className="w-[120px] bg-muted/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : error || !traces.length ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {error ? 'Failed to load comparison data' : 'No data available for the selected period'}
          </div>
        ) : (
          <div className="h-[400px]">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <Plot
                data={traces}
                layout={layout}
                config={config}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
                onRelayout={handleRelayout}
              />
            </Suspense>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
