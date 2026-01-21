/**
 * PortfolioList - Display and manage user's portfolios.
 */

import { useState } from 'react'
import {
  Eye,
  Building2,
  Users,
  Layers,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderOpen,
  Zap,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  usePortfolios,
  useDeletePortfolio,
  type Portfolio,
  type PortfolioType,
} from '@/lib/portfolio-api'
import { CreatePortfolioModal } from './create-portfolio-modal'
import { EditPortfolioModal } from './edit-portfolio-modal'

const portfolioTypeConfig: Record<
  PortfolioType,
  { icon: React.ElementType; color: string; label: string }
> = {
  watchlist: { icon: Eye, color: 'text-blue-400', label: 'Watchlist' },
  owned: { icon: Building2, color: 'text-green-400', label: 'Owned' },
  competitor: { icon: Users, color: 'text-orange-400', label: 'Competitor' },
  custom: { icon: Layers, color: 'text-purple-400', label: 'Custom' },
}

interface PortfolioListProps {
  onSelectPortfolio?: (portfolioId: number) => void
  selectedPortfolioId?: number | null
}

export function PortfolioList({
  onSelectPortfolio,
  selectedPortfolioId,
}: PortfolioListProps) {
  const { data: portfolios, isLoading, error } = usePortfolios()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null)
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const deletePortfolio = useDeletePortfolio()

  const handleDelete = async () => {
    if (!portfolioToDelete) return

    try {
      await deletePortfolio.mutateAsync(portfolioToDelete.id)
      setDeleteDialogOpen(false)
      setPortfolioToDelete(null)
    } catch (error) {
      console.error('Failed to delete portfolio:', error)
    }
  }

  if (isLoading) {
    return <PortfolioListSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-8 text-center">
          <p className="text-destructive">Failed to load portfolios</p>
          <Button variant="outline" className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-12 text-center">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No portfolios yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first portfolio to start organizing wind farms.
          </p>
          <CreatePortfolioModal />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {portfolios.map((portfolio) => {
          const config = portfolioTypeConfig[portfolio.portfolio_type]
          const Icon = config.icon
          const isSelected = selectedPortfolioId === portfolio.id

          return (
            <Card
              key={portfolio.id}
              className={cn(
                'bg-card/50 backdrop-blur-sm border-border/50 transition-all cursor-pointer hover:bg-card/70',
                isSelected && 'border-primary bg-primary/10'
              )}
              onClick={() => onSelectPortfolio?.(portfolio.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg bg-background/50',
                      config.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{portfolio.name}</h3>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {config.label}
                      </Badge>
                    </div>
                    {portfolio.description && (
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {portfolio.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{portfolio.item_count} wind farms</span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {portfolio.total_capacity_mw.toFixed(0)} MW
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/portfolios/$portfolioId"
                          params={{ portfolioId: String(portfolio.id) }}
                        >
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Open
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingPortfolio(portfolio)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPortfolioToDelete(portfolio)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{portfolioToDelete?.name}"? This
              action cannot be undone. The wind farms in this portfolio will not
              be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePortfolio.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Portfolio Modal */}
      {editingPortfolio && (
        <EditPortfolioModal
          portfolio={editingPortfolio}
          open={!!editingPortfolio}
          onOpenChange={(open) => !open && setEditingPortfolio(null)}
        />
      )}
    </>
  )
}

function PortfolioListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="bg-card/50 backdrop-blur-sm border-border/50"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Compact portfolio list for sidebars.
 */
interface PortfolioListCompactProps {
  limit?: number
}

export function PortfolioListCompact({ limit = 5 }: PortfolioListCompactProps) {
  const { data: portfolios, isLoading } = usePortfolios()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  const displayPortfolios = portfolios?.slice(0, limit) || []

  return (
    <div className="space-y-1">
      {displayPortfolios.map((portfolio) => {
        const config = portfolioTypeConfig[portfolio.portfolio_type]
        const Icon = config.icon

        return (
          <Link
            key={portfolio.id}
            to="/portfolios/$portfolioId"
            params={{ portfolioId: String(portfolio.id) }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Icon className={cn('h-4 w-4', config.color)} />
            <span className="flex-1 truncate text-sm">{portfolio.name}</span>
            <span className="text-xs text-muted-foreground">
              {portfolio.item_count}
            </span>
          </Link>
        )
      })}

      {portfolios && portfolios.length > limit && (
        <Link
          to="/portfolios"
          className="flex items-center justify-center px-3 py-2 text-sm text-primary hover:underline"
        >
          View all {portfolios.length} portfolios
        </Link>
      )}
    </div>
  )
}
