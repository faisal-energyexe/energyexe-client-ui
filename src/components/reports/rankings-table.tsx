/**
 * RankingsTable - Display windfarm rankings within peer groups.
 */

import { Trophy, Award, Medal, MapPin, Building2, Cpu, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { type WindfarmRankings, type RankingRow } from '@/lib/reports-api'

interface RankingsTableProps {
  rankings: WindfarmRankings
  windfarmName?: string
  className?: string
}

export function RankingsTable({
  rankings,
  windfarmName,
  className,
}: RankingsTableProps) {
  return (
    <Card className={cn('bg-card/50 backdrop-blur-sm border-border/50', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          Performance Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <RankBadge
            label="Bidzone"
            rank={rankings.bidzone_rank}
            total={rankings.bidzone_total}
            icon={MapPin}
          />
          <RankBadge
            label="Country"
            rank={rankings.country_rank}
            total={rankings.country_total}
            icon={Globe}
          />
          <RankBadge
            label="Owner"
            rank={rankings.owner_rank}
            total={rankings.owner_total}
            icon={Building2}
          />
          <RankBadge
            label="Turbine Model"
            rank={rankings.turbine_rank}
            total={rankings.turbine_total}
            icon={Cpu}
          />
        </div>

        {/* Detailed Tables */}
        <Tabs defaultValue="bidzone" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bidzone" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Bidzone
            </TabsTrigger>
            <TabsTrigger value="country" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Country
            </TabsTrigger>
            <TabsTrigger value="owner" className="text-xs">
              <Building2 className="h-3 w-3 mr-1" />
              Owner
            </TabsTrigger>
            <TabsTrigger value="turbine" className="text-xs">
              <Cpu className="h-3 w-3 mr-1" />
              Turbine
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bidzone" className="mt-4">
            <RankingTable
              data={rankings.bidzone_table}
              windfarmName={windfarmName}
            />
          </TabsContent>
          <TabsContent value="country" className="mt-4">
            <RankingTable
              data={rankings.country_table}
              windfarmName={windfarmName}
            />
          </TabsContent>
          <TabsContent value="owner" className="mt-4">
            <RankingTable
              data={rankings.owner_table}
              windfarmName={windfarmName}
            />
          </TabsContent>
          <TabsContent value="turbine" className="mt-4">
            <RankingTable
              data={rankings.turbine_table}
              windfarmName={windfarmName}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface RankBadgeProps {
  label: string
  rank: number | null
  total: number | null
  icon: React.ElementType
}

function RankBadge({ label, rank, total, icon: Icon }: RankBadgeProps) {
  if (rank === null || total === null) {
    return (
      <div className="p-3 rounded-lg bg-background/50 border border-border/30 text-center">
        <Icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">N/A</div>
      </div>
    )
  }

  const percentile = ((total - rank + 1) / total) * 100
  const isTopTen = rank <= 10
  const isTopThird = percentile >= 66.67
  const isTopHalf = percentile >= 50

  return (
    <div
      className={cn(
        'p-3 rounded-lg border text-center transition-colors',
        isTopTen
          ? 'bg-amber-500/10 border-amber-500/30'
          : isTopThird
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : isTopHalf
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-background/50 border-border/30'
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 mx-auto mb-1',
          isTopTen
            ? 'text-amber-400'
            : isTopThird
              ? 'text-emerald-400'
              : isTopHalf
                ? 'text-blue-400'
                : 'text-muted-foreground'
        )}
      />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center justify-center gap-1 mt-1">
        {rank <= 3 && <RankMedal rank={rank} />}
        <span className="text-lg font-bold">#{rank}</span>
        <span className="text-xs text-muted-foreground">/ {total}</span>
      </div>
    </div>
  )
}

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Trophy className="h-4 w-4 text-amber-400" />
  }
  if (rank === 2) {
    return <Award className="h-4 w-4 text-gray-300" />
  }
  if (rank === 3) {
    return <Medal className="h-4 w-4 text-amber-600" />
  }
  return null
}

interface RankingTableProps {
  data: RankingRow[]
  windfarmName?: string
}

function RankingTable({ data, windfarmName }: RankingTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No ranking data available
      </div>
    )
  }

  return (
    <div className="max-h-[300px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Wind Farm</TableHead>
            <TableHead className="text-right">Avg CF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const isCurrentFarm =
              windfarmName && row.windfarm_name === windfarmName

            return (
              <TableRow
                key={row.windfarm_id}
                className={cn(isCurrentFarm && 'bg-primary/10')}
              >
                <TableCell>
                  <div className="flex items-center gap-1">
                    {row.rank <= 3 && <RankMedal rank={row.rank} />}
                    <span className="font-medium">#{row.rank}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {row.windfarm_name}
                    {isCurrentFarm && (
                      <Badge variant="outline" className="text-xs">
                        This farm
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {(row.avg_capacity_factor * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * Compact rankings display.
 */
interface RankingsCompactProps {
  rankings: WindfarmRankings
}

export function RankingsCompact({ rankings }: RankingsCompactProps) {
  const ranks = [
    { label: 'BZ', rank: rankings.bidzone_rank, total: rankings.bidzone_total },
    { label: 'Country', rank: rankings.country_rank, total: rankings.country_total },
    { label: 'Owner', rank: rankings.owner_rank, total: rankings.owner_total },
    { label: 'Turbine', rank: rankings.turbine_rank, total: rankings.turbine_total },
  ].filter((r) => r.rank !== null)

  return (
    <div className="flex flex-wrap gap-2">
      {ranks.map((r) => (
        <Badge
          key={r.label}
          variant="outline"
          className={cn(
            'text-xs',
            r.rank! <= 3 && 'border-amber-400/50 text-amber-400'
          )}
        >
          {r.label}: #{r.rank}/{r.total}
        </Badge>
      ))}
    </div>
  )
}
