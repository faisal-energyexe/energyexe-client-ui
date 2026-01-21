/**
 * AddToPortfolioMenu - Dropdown menu to add a windfarm to portfolios.
 */

import { useState } from 'react'
import {
  FolderPlus,
  Plus,
  Check,
  Eye,
  Building2,
  Users,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  usePortfolios,
  useAddItemToPortfolio,
  type PortfolioType,
  type Portfolio,
} from '@/lib/portfolio-api'
import { CreatePortfolioModal } from './create-portfolio-modal'

interface AddToPortfolioMenuProps {
  windfarmId: number
  windfarmName?: string
  existingPortfolioIds?: number[]
  trigger?: React.ReactNode
  onAdd?: (portfolioId: number, portfolioName: string) => void
  className?: string
}

const portfolioTypeIcons: Record<PortfolioType, React.ElementType> = {
  watchlist: Eye,
  owned: Building2,
  competitor: Users,
  custom: Layers,
}

export function AddToPortfolioMenu({
  windfarmId,
  windfarmName,
  existingPortfolioIds = [],
  trigger,
  onAdd,
  className,
}: AddToPortfolioMenuProps) {
  const [open, setOpen] = useState(false)
  const { data: portfolios, isLoading } = usePortfolios()
  const addItem = useAddItemToPortfolio()

  const handleAddToPortfolio = async (portfolio: Portfolio) => {
    try {
      await addItem.mutateAsync({
        portfolioId: portfolio.id,
        data: { windfarm_id: windfarmId },
      })
      onAdd?.(portfolio.id, portfolio.name)
      setOpen(false)
    } catch (error) {
      console.error('Failed to add to portfolio:', error)
    }
  }

  const availablePortfolios = portfolios?.filter(
    (p) => !existingPortfolioIds.includes(p.id)
  )

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className={cn('gap-2', className)}>
            <FolderPlus className="h-4 w-4" />
            Add to Portfolio
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-card/95 backdrop-blur-xl border-border/50"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Add {windfarmName ? `"${windfarmName}"` : 'wind farm'} to portfolio
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Loading portfolios...
          </div>
        ) : availablePortfolios && availablePortfolios.length > 0 ? (
          <>
            {availablePortfolios.map((portfolio) => {
              const Icon = portfolioTypeIcons[portfolio.portfolio_type]
              const isInPortfolio = existingPortfolioIds.includes(portfolio.id)

              return (
                <DropdownMenuItem
                  key={portfolio.id}
                  onClick={() => handleAddToPortfolio(portfolio)}
                  disabled={isInPortfolio || addItem.isPending}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{portfolio.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {portfolio.item_count} items
                    </div>
                  </div>
                  {isInPortfolio && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
          </>
        ) : portfolios && portfolios.length > 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Already in all portfolios
          </div>
        ) : null}

        {/* Create New Portfolio Option */}
        <CreatePortfolioModal
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">Create New Portfolio</span>
            </DropdownMenuItem>
          }
          onSuccess={({ id, name }) => {
            // Automatically add to the new portfolio
            handleAddToPortfolio({
              id,
              name,
              item_count: 0,
              portfolio_type: 'custom',
            } as Portfolio)
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Compact version for use in data tables.
 */
interface AddToPortfolioIconProps {
  windfarmId: number
  windfarmName?: string
  className?: string
}

export function AddToPortfolioIcon({
  windfarmId,
  windfarmName,
  className,
}: AddToPortfolioIconProps) {
  return (
    <AddToPortfolioMenu
      windfarmId={windfarmId}
      windfarmName={windfarmName}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8 hover:bg-primary/10', className)}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      }
    />
  )
}
