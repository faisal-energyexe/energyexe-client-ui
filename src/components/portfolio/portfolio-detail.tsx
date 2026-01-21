/**
 * PortfolioDetail - Detailed view of a single portfolio with its items.
 */

import { useState } from 'react'
import {
  Eye,
  Building2,
  Users,
  Layers,
  Zap,
  Wind,
  MapPin,
  Trash2,
  ExternalLink,
  ArrowLeft,
  MoreHorizontal,
  Pencil,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  usePortfolio,
  useRemoveItemFromPortfolio,
  type PortfolioType,
  type PortfolioItem,
} from '@/lib/portfolio-api'
import { EditPortfolioModal } from './edit-portfolio-modal'

const portfolioTypeConfig: Record<
  PortfolioType,
  { icon: React.ElementType; color: string; label: string; bgColor: string }
> = {
  watchlist: {
    icon: Eye,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    label: 'Watchlist',
  },
  owned: {
    icon: Building2,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    label: 'Owned',
  },
  competitor: {
    icon: Users,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    label: 'Competitor',
  },
  custom: {
    icon: Layers,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    label: 'Custom',
  },
}

interface PortfolioDetailProps {
  portfolioId: number
}

export function PortfolioDetail({ portfolioId }: PortfolioDetailProps) {
  const { data: portfolio, isLoading, error } = usePortfolio(portfolioId)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<PortfolioItem | null>(null)
  const removeItem = useRemoveItemFromPortfolio()

  const handleRemoveItem = async () => {
    if (!itemToRemove) return

    try {
      await removeItem.mutateAsync({
        portfolioId,
        windfarmId: itemToRemove.windfarm_id,
      })
      setItemToRemove(null)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  if (isLoading) {
    return <PortfolioDetailSkeleton />
  }

  if (error || !portfolio) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-12 text-center">
          <p className="text-destructive mb-4">Failed to load portfolio</p>
          <Button variant="outline" asChild>
            <Link to="/portfolios">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolios
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const config = portfolioTypeConfig[portfolio.portfolio_type]
  const Icon = config.icon

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-xl', config.bgColor, config.color)}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{portfolio.name}</h1>
                <Badge variant="outline" className={config.color}>
                  {config.label}
                </Badge>
              </div>
              {portfolio.description && (
                <p className="text-muted-foreground">{portfolio.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/portfolios">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wind className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wind Farms</p>
                  <p className="text-2xl font-bold">{portfolio.item_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl font-bold">
                    {portfolio.total_capacity_mw.toFixed(0)}{' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      MW
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Countries</p>
                  <p className="text-2xl font-bold">
                    {
                      new Set(
                        portfolio.items
                          .map((i) => i.windfarm.country_name)
                          .filter(Boolean)
                      ).size
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Wind Farms</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.items.length === 0 ? (
              <div className="py-12 text-center">
                <Wind className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No wind farms yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Add wind farms to this portfolio from the wind farms list.
                </p>
                <Button asChild>
                  <Link to="/wind-farms">Browse Wind Farms</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Capacity (MW)</TableHead>
                    <TableHead className="text-right">Added</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Link
                          to="/wind-farms/$windfarmId"
                          params={{ windfarmId: String(item.windfarm_id) }}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.windfarm.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.windfarm.country_name || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.windfarm.nameplate_capacity_mw?.toFixed(1) || '-'}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(item.added_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                to="/wind-farms/$windfarmId"
                                params={{ windfarmId: String(item.windfarm_id) }}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setItemToRemove(item)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      {portfolio && (
        <EditPortfolioModal
          portfolio={portfolio}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
        />
      )}

      {/* Remove Item Confirmation */}
      <AlertDialog
        open={!!itemToRemove}
        onOpenChange={(open) => !open && setItemToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Portfolio</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToRemove?.windfarm.name}" from
              this portfolio?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeItem.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function PortfolioDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="bg-card/50">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
