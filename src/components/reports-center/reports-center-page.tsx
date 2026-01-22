/**
 * ReportsCenterPage - Central hub for generating and viewing reports.
 */

import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  FileText,
  Wind,
  FolderHeart,
  Scale,
  ChevronRight,
  Search,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useWindfarms, useSearchWindfarms } from '@/lib/windfarms-api'
import { usePortfolios } from '@/lib/portfolio-api'

interface ReportTemplate {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  available: boolean
  badge?: string
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'farm',
    title: 'Wind Farm Report',
    description:
      'Comprehensive performance analysis for a single wind farm including generation metrics, peer comparison, and AI-generated insights.',
    icon: Wind,
    available: true,
  },
  {
    id: 'portfolio',
    title: 'Portfolio Report',
    description:
      'Aggregate performance summary across all wind farms in a portfolio with comparative analytics.',
    icon: FolderHeart,
    href: '/portfolios',
    available: true,
    badge: 'Via Portfolios',
  },
  {
    id: 'comparison',
    title: 'Comparison Report',
    description:
      'Side-by-side comparison of multiple wind farms with benchmarking and variance analysis.',
    icon: Scale,
    href: '/comparison',
    available: true,
    badge: 'Via Comparison',
  },
]

export function ReportsCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllFarms, setShowAllFarms] = useState(false)

  // Fetch wind farms
  const {
    data: windfarms,
    isLoading: isLoadingWindfarms,
  } = useWindfarms({ limit: showAllFarms ? 100 : 10 })

  // Search wind farms
  const {
    data: searchResults,
    isLoading: isSearching,
  } = useSearchWindfarms(searchQuery, { limit: 20 })

  // Fetch portfolios
  const { data: portfolios, isLoading: isLoadingPortfolios } = usePortfolios()

  const displayedWindfarms = searchQuery ? searchResults : windfarms

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports Center</h1>
          <p className="text-muted-foreground">
            Generate comprehensive performance reports and analytics
          </p>
        </div>
      </div>

      {/* Report Templates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <ReportTemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>

      {/* Quick Generate - Wind Farm Reports */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" />
                Generate Wind Farm Report
              </CardTitle>
              <CardDescription>
                Select a wind farm to generate a detailed performance report
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wind farms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Wind Farms Table */}
          {isLoadingWindfarms || isSearching ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : displayedWindfarms && displayedWindfarms.length > 0 ? (
            <>
              <div className="rounded-md border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead>Wind Farm</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Capacity
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="w-[100px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedWindfarms.map((farm) => (
                      <TableRow key={farm.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium">
                          {farm.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {farm.country?.name || 'N/A'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {farm.nameplate_capacity_mw
                            ? `${farm.nameplate_capacity_mw.toFixed(1)} MW`
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              farm.status === 'operational'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                            )}
                          >
                            {farm.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link
                              to="/wind-farms/$windfarmId/report"
                              params={{ windfarmId: String(farm.id) }}
                              className="gap-1"
                            >
                              Report
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {!searchQuery && windfarms && windfarms.length >= 10 && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllFarms(!showAllFarms)}
                  >
                    {showAllFarms
                      ? 'Show Less'
                      : `Show All Wind Farms`}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>
                {searchQuery
                  ? 'No wind farms found matching your search'
                  : 'No wind farms available'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Access - Portfolios */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderHeart className="h-5 w-5 text-primary" />
            Portfolio Reports
          </CardTitle>
          <CardDescription>
            Generate reports for your saved portfolios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPortfolios ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : portfolios && portfolios.length > 0 ? (
            <div className="space-y-2">
              {portfolios.slice(0, 5).map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                >
                  <div>
                    <p className="font-medium">{portfolio.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {portfolio.item_count || 0} wind farms
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link
                      to="/portfolios/$portfolioId"
                      params={{ portfolioId: String(portfolio.id) }}
                      className="gap-1"
                    >
                      View
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              {portfolios.length > 5 && (
                <div className="text-center pt-2">
                  <Button asChild variant="link" size="sm">
                    <Link to="/portfolios">View all portfolios</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FolderHeart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No portfolios yet</p>
              <Button asChild variant="link" size="sm" className="mt-2">
                <Link to="/portfolios">Create your first portfolio</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ReportTemplateCard({ template }: { template: ReportTemplate }) {
  const Icon = template.icon

  const content = (
    <Card
      className={cn(
        'border-border/50 bg-card/50 backdrop-blur-sm h-full transition-colors',
        template.available && 'hover:border-primary/50 cursor-pointer'
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'p-3 rounded-lg',
              template.available ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <Icon
              className={cn(
                'h-6 w-6',
                template.available ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{template.title}</h3>
              {template.badge && (
                <Badge variant="secondary" className="text-xs">
                  {template.badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {template.description}
            </p>
          </div>
          {template.available && (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (template.href) {
    return (
      <Link to={template.href} className="block">
        {content}
      </Link>
    )
  }

  // For farm reports, we show the card but don't link - user selects from table below
  return content
}

export default ReportsCenterPage
