/**
 * FavoriteButton - Toggle favorite status for a windfarm.
 * Shows filled star when favorited, outline when not.
 */

import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCheckFavorite, useToggleFavorite } from '@/lib/portfolio-api'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FavoriteButtonProps {
  windfarmId: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button'
  className?: string
}

export function FavoriteButton({
  windfarmId,
  size = 'md',
  variant = 'icon',
  className,
}: FavoriteButtonProps) {
  const { data: favoriteStatus, isLoading: isChecking } = useCheckFavorite(windfarmId)
  const { toggle, isLoading: isToggling } = useToggleFavorite()

  const isFavorite = favoriteStatus?.is_favorite ?? false
  const isLoading = isChecking || isToggling

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggle(windfarmId, isFavorite)
  }

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size]

  const buttonSize = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }[size]

  if (variant === 'button') {
    return (
      <Button
        variant={isFavorite ? 'secondary' : 'outline'}
        size="sm"
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'gap-2',
          isFavorite && 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
          className
        )}
      >
        <Star
          className={cn(
            iconSize,
            isFavorite && 'fill-amber-400 text-amber-400'
          )}
        />
        {isFavorite ? 'Favorited' : 'Add to Favorites'}
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
              buttonSize,
              'hover:bg-amber-500/20 transition-colors',
              isFavorite && 'text-amber-400',
              className
            )}
          >
            <Star
              className={cn(
                iconSize,
                'transition-all',
                isFavorite && 'fill-amber-400 text-amber-400',
                isLoading && 'animate-pulse'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * Bulk favorite status display for list views.
 * Uses optimistic updates for better UX.
 */
interface BulkFavoriteIndicatorProps {
  windfarmId: number
  favoritedIds: number[]
  onToggle?: (windfarmId: number, isFavorite: boolean) => void
  size?: 'sm' | 'md'
  className?: string
}

export function BulkFavoriteIndicator({
  windfarmId,
  favoritedIds,
  onToggle,
  size = 'sm',
  className,
}: BulkFavoriteIndicatorProps) {
  const isFavorite = favoritedIds.includes(windfarmId)
  const { toggle, isLoading } = useToggleFavorite()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggle(windfarmId, isFavorite)
    onToggle?.(windfarmId, isFavorite)
  }

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const buttonSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        buttonSize,
        'hover:bg-amber-500/20 p-0',
        className
      )}
    >
      <Star
        className={cn(
          iconSize,
          'transition-all',
          isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground',
          isLoading && 'animate-pulse'
        )}
      />
    </Button>
  )
}
