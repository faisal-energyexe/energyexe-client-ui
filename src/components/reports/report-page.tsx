/**
 * ReportPage - Main report view for a windfarm.
 */

import { useState } from 'react'
import {
  FileText,
  RefreshCw,
  Calendar,
  Sparkles,
  Printer,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RampUpToggle } from '@/components/ui/ramp-up-toggle'
import { DateRangePicker } from '@/components/generation/date-range-picker'
import { getDateRangePreset } from '@/lib/generation-api'
import { cn } from '@/lib/utils'
import {
  useReportData,
  useGenerateAllCommentary,
  COMMENTARY_SECTION_TYPES,
} from '@/lib/reports-api'
import { ReportSummary } from './report-summary'
import { RankingsTable } from './rankings-table'
import { ReportHighlights } from './report-highlights'
import { CommentarySection } from './commentary-section'

interface ReportPageProps {
  windfarmId: number
  windfarmName: string
}

export function ReportPage({ windfarmId, windfarmName }: ReportPageProps) {
  // Default to last 12 months
  const defaultRange = getDateRangePreset('1Y')
  const [startDate, setStartDate] = useState(defaultRange.startDate)
  const [endDate, setEndDate] = useState(defaultRange.endDate)
  const [datePreset, setDatePreset] = useState('1Y')
  const [activeTab, setActiveTab] = useState('overview')
  const [excludeRampUp, setExcludeRampUp] = useState(true)
  const [selectedPeerGroups] = useState<string[]>([
    'bidzone',
    'country',
  ])

  const {
    data: reportData,
    isLoading,
    error,
    refetch,
  } = useReportData(windfarmId, startDate, endDate, {
    includePeerGroups: selectedPeerGroups,
    generateCommentary: false,
    excludeRampUp,
  })

  const generateAllMutation = useGenerateAllCommentary()

  const handleGenerateAllCommentary = async () => {
    await generateAllMutation.mutateAsync({
      windfarmId,
      request: {
        section_types: COMMENTARY_SECTION_TYPES,
        start_date: startDate,
        end_date: endDate,
        regenerate: false,
      },
    })
    refetch()
  }

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-12 text-center">
          <p className="text-destructive mb-4">Failed to load report data</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
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
            <FileText className="h-6 w-6 text-primary" />
            Performance Report
          </h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive analysis for {windfarmName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RampUpToggle checked={excludeRampUp} onCheckedChange={setExcludeRampUp} />

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            preset={datePreset}
            onPresetChange={setDatePreset}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateAllCommentary}
            disabled={generateAllMutation.isPending || isLoading}
            className="gap-2"
          >
            <Sparkles
              className={cn('h-4 w-4', generateAllMutation.isPending && 'animate-pulse')}
            />
            Generate AI Commentary
          </Button>

          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Report Period Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(startDate).toLocaleDateString()} -{' '}
          {new Date(endDate).toLocaleDateString()}
        </Badge>
        {reportData && (
          <Badge variant="secondary">{reportData.summary.total_months} months</Badge>
        )}
      </div>

      {isLoading ? (
        <ReportSkeleton />
      ) : reportData ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card/50 border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="commentary">AI Commentary</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Summary */}
            <ReportSummary summary={reportData.summary} />

            {/* Highlights */}
            {reportData.highlights.length > 0 && (
              <ReportHighlights highlights={reportData.highlights} />
            )}

            {/* Quick Rankings */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {reportData.rankings.bidzone_rank && (
                    <QuickRank
                      label="In Bidzone"
                      rank={reportData.rankings.bidzone_rank}
                      total={reportData.rankings.bidzone_total!}
                    />
                  )}
                  {reportData.rankings.country_rank && (
                    <QuickRank
                      label="In Country"
                      rank={reportData.rankings.country_rank}
                      total={reportData.rankings.country_total!}
                    />
                  )}
                  {reportData.rankings.owner_rank && (
                    <QuickRank
                      label="In Portfolio"
                      rank={reportData.rankings.owner_rank}
                      total={reportData.rankings.owner_total!}
                    />
                  )}
                  {reportData.rankings.turbine_rank && (
                    <QuickRank
                      label="Turbine Class"
                      rank={reportData.rankings.turbine_rank}
                      total={reportData.rankings.turbine_total!}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Executive Summary Commentary */}
            {reportData.commentaries.executive_summary && (
              <CommentarySection
                sectionType="executive_summary"
                commentary={reportData.commentaries.executive_summary}
                windfarmId={windfarmId}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </TabsContent>

          {/* Rankings Tab */}
          <TabsContent value="rankings" className="mt-6">
            <RankingsTable
              rankings={reportData.rankings}
              windfarmName={windfarmName}
            />
          </TabsContent>

          {/* Commentary Tab */}
          <TabsContent value="commentary" className="mt-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">AI-Generated Commentary</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAllCommentary}
                disabled={generateAllMutation.isPending}
                className="gap-2"
              >
                <Sparkles
                  className={cn(
                    'h-4 w-4',
                    generateAllMutation.isPending && 'animate-pulse'
                  )}
                />
                Generate All Sections
              </Button>
            </div>

            {COMMENTARY_SECTION_TYPES.map((sectionType) => (
              <CommentarySection
                key={sectionType}
                sectionType={sectionType}
                commentary={reportData.commentaries[sectionType]}
                windfarmId={windfarmId}
                startDate={startDate}
                endDate={endDate}
              />
            ))}
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}

interface QuickRankProps {
  label: string
  rank: number
  total: number
}

function QuickRank({ label, rank, total }: QuickRankProps) {
  const percentile = ((total - rank + 1) / total) * 100
  const isTop = percentile >= 75

  return (
    <div
      className={cn(
        'p-3 rounded-lg border text-center',
        isTop ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-background/50 border-border/30'
      )}
    >
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="flex items-baseline justify-center gap-1">
        <span className={cn('text-2xl font-bold', isTop && 'text-emerald-400')}>
          #{rank}
        </span>
        <span className="text-sm text-muted-foreground">/ {total}</span>
      </div>
    </div>
  )
}

function ReportSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Skeleton */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Highlights Skeleton */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rankings Skeleton */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportPage
