/**
 * BenchmarkingTab - Shows peer comparison and benchmarking data for a wind farm.
 * Compares the current wind farm against peers in the same bidzone or country.
 */

import { useState, useMemo } from 'react'
import { RefreshCw, Scale, TrendingUp, TrendingDown, Minus, Info, Medal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DateRangePicker } from '@/components/generation/date-range-picker'
import { getDateRangePreset } from '@/lib/generation-api'
import { useComparisonStatistics, useWindfarmsForComparison } from '@/lib/comparison-api'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface BenchmarkingTabProps {
  windfarmId: number
  windfarmName: string
  bidzoneId?: number | null  // Reserved for future scope filtering
  countryId?: number | null  // Reserved for future scope filtering
}

// Note: Scope filtering requires additional API support
// Currently comparing all available wind farms with data

interface PeerRanking {
  windfarmId: number
  windfarmName: string
  capacityFactor: number
  captureRate?: number
  rank: number
  isCurrentFarm: boolean
}

export function BenchmarkingTab({
  windfarmId,
  windfarmName,
  // bidzoneId and countryId reserved for future scope filtering
  // bidzoneId,
  // countryId,
}: BenchmarkingTabProps) {
  // Date range state
  const [preset, setPreset] = useState('90D')
  const [dateRange, setDateRange] = useState(() => getDateRangePreset('90D'))

  // Fetch all windfarms available for comparison
  const { data: allWindfarms } = useWindfarmsForComparison()

  // Determine peer windfarms based on scope
  // Note: The comparison API doesn't have bidzone/country info, so we use all windfarms with data
  const peerWindfarmIds = useMemo(() => {
    if (!allWindfarms || allWindfarms.length === 0) return [windfarmId]

    // Filter to only windfarms with data
    const withData = allWindfarms.filter(wf => wf.has_data)

    // Always include current windfarm
    const ids = withData.map(wf => wf.id)
    if (!ids.includes(windfarmId)) {
      ids.push(windfarmId)
    }

    // Limit to max 10 peers for performance
    return ids.slice(0, 10)
  }, [allWindfarms, windfarmId])

  // Calculate period days from date range
  const periodDays = useMemo(() => {
    const start = new Date(dateRange.startDate)
    const end = new Date(dateRange.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }, [dateRange])

  // Fetch comparison statistics
  const {
    data: comparisonData,
    isLoading,
    refetch,
    isFetching,
  } = useComparisonStatistics(peerWindfarmIds, periodDays)

  // Handle date range change
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate })
  }

  // Calculate rankings from comparison data
  const rankings: PeerRanking[] = useMemo(() => {
    if (!comparisonData || comparisonData.length === 0) return []

    const sorted = [...comparisonData]
      .filter(item => item.avg_capacity_factor !== null && item.avg_capacity_factor !== undefined)
      .sort((a, b) => (b.avg_capacity_factor ?? 0) - (a.avg_capacity_factor ?? 0))
      .map((item, index) => ({
        windfarmId: item.windfarm_id,
        windfarmName: item.windfarm_name,
        capacityFactor: (item.avg_capacity_factor ?? 0) * 100, // Convert to percentage
        captureRate: undefined,
        rank: index + 1,
        isCurrentFarm: item.windfarm_id === windfarmId,
      }))

    return sorted
  }, [comparisonData, windfarmId])

  // Get current farm's ranking
  const currentFarmRanking = rankings.find(r => r.isCurrentFarm)
  const totalPeers = rankings.length
  const percentile = currentFarmRanking
    ? Math.round(((totalPeers - currentFarmRanking.rank + 1) / totalPeers) * 100)
    : null

  // Prepare radar chart data
  const radarData = useMemo(() => {
    if (!comparisonData || comparisonData.length === 0) return []

    const currentFarm = comparisonData.find(i => i.windfarm_id === windfarmId)
    if (!currentFarm) return []

    // Calculate averages for peers
    const peers = comparisonData.filter(i => i.windfarm_id !== windfarmId)
    const avgCF = peers.length > 0
      ? peers.reduce((sum, p) => sum + (p.avg_capacity_factor ?? 0), 0) / peers.length
      : 0
    const avgAvailability = peers.length > 0
      ? peers.reduce((sum, p) => sum + (p.availability_percent ?? 0), 0) / peers.length
      : 0
    const avgGeneration = peers.length > 0
      ? peers.reduce((sum, p) => sum + (p.total_generation ?? 0), 0) / peers.length
      : 0

    // Normalize values to 0-100 scale
    const maxCF = Math.max(...comparisonData.map(i => i.avg_capacity_factor ?? 0))
    const maxAvailability = Math.max(...comparisonData.map(i => i.availability_percent ?? 0), 1)
    const maxGen = Math.max(...comparisonData.map(i => i.total_generation ?? 0))

    return [
      {
        metric: 'Capacity Factor',
        current: maxCF > 0 ? ((currentFarm.avg_capacity_factor ?? 0) / maxCF) * 100 : 0,
        peerAvg: maxCF > 0 ? (avgCF / maxCF) * 100 : 0,
      },
      {
        metric: 'Availability',
        current: maxAvailability > 0 ? ((currentFarm.availability_percent ?? 0) / maxAvailability) * 100 : 0,
        peerAvg: maxAvailability > 0 ? (avgAvailability / maxAvailability) * 100 : 0,
      },
      {
        metric: 'Generation',
        current: maxGen > 0 ? ((currentFarm.total_generation ?? 0) / maxGen) * 100 : 0,
        peerAvg: maxGen > 0 ? (avgGeneration / maxGen) * 100 : 0,
      },
    ]
  }, [comparisonData, windfarmId])

  // Get performance badge
  const getPerformanceBadge = () => {
    if (!percentile) return null

    if (percentile >= 90) {
      return { label: 'Top Performer', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', icon: Medal }
    }
    if (percentile >= 70) {
      return { label: 'Above Average', color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', icon: TrendingUp }
    }
    if (percentile >= 30) {
      return { label: 'Average', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', icon: Minus }
    }
    return { label: 'Below Average', color: 'text-orange-500', bgColor: 'bg-orange-500/10', icon: TrendingDown }
  }

  const performanceBadge = getPerformanceBadge()

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scale className="h-4 w-4 text-primary" />
            <span>Peer Benchmarking</span>
          </div>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
            preset={preset}
            onPresetChange={setPreset}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-card/50 border-border/50 gap-2"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <>
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rank Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">
                    #{currentFarmRanking?.rank ?? '-'}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    of {totalPeers} wind farms
                  </p>
                  {performanceBadge && (
                    <Badge className={`mt-3 ${performanceBadge.color} ${performanceBadge.bgColor} border-0`}>
                      <performanceBadge.icon className="h-3 w-3 mr-1" />
                      {performanceBadge.label}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Percentile Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {percentile ?? '-'}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Percentile Ranking
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground cursor-help">
                          <Info className="h-3 w-3" />
                          Based on capacity factor
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Higher percentile means better performance relative to peers</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            {/* Capacity Factor Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">
                    {currentFarmRanking?.capacityFactor.toFixed(1) ?? '-'}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Capacity Factor
                  </p>
                  {rankings.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Peer avg: {(rankings.reduce((sum, r) => sum + r.capacityFactor, 0) / rankings.length).toFixed(1)}%
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                {radarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(215, 20%, 40%)" />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 10 }}
                      />
                      <Radar
                        name={windfarmName}
                        dataKey="current"
                        stroke="hsl(221, 83%, 53%)"
                        fill="hsl(221, 83%, 53%)"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Peer Average"
                        dataKey="peerAvg"
                        stroke="hsl(215, 20%, 65%)"
                        fill="hsl(215, 20%, 65%)"
                        fillOpacity={0.1}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No comparison data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Peer Ranking Table */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Peer Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {rankings.length > 0 ? (
                    rankings.map((peer) => (
                      <div
                        key={peer.windfarmId}
                        className={`p-3 rounded-lg border ${
                          peer.isCurrentFarm
                            ? 'bg-primary/10 border-primary/30'
                            : 'bg-background/50 border-border/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              peer.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                              peer.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                              peer.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {peer.rank}
                            </div>
                            <div>
                              <p className={`font-medium ${peer.isCurrentFarm ? 'text-primary' : 'text-foreground'}`}>
                                {peer.windfarmName}
                                {peer.isCurrentFarm && <span className="text-xs ml-2">(This farm)</span>}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">
                              {peer.capacityFactor.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">CF</p>
                          </div>
                        </div>
                        <Progress
                          value={peer.capacityFactor}
                          className="h-1.5 mt-2"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No peer data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data freshness indicator */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Comparing {totalPeers} wind farms from {new Date(dateRange.startDate).toLocaleDateString()} to{' '}
                {new Date(dateRange.endDate).toLocaleDateString()}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              All Wind Farms
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default BenchmarkingTab
