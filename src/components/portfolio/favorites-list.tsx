/**
 * FavoritesList - Display user's favorited wind farms.
 */

import {
  Star,
  Wind,
  Zap,
  MapPin,
  ExternalLink,
  Trash2,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { useState } from 'react'
import { useFavorites, useRemoveFavorite, type Favorite } from '@/lib/portfolio-api'

export function FavoritesList() {
  const { data, isLoading, error } = useFavorites()
  const [favoriteToRemove, setFavoriteToRemove] = useState<Favorite | null>(null)
  const removeFavorite = useRemoveFavorite()

  const handleRemove = async () => {
    if (!favoriteToRemove) return

    try {
      await removeFavorite.mutateAsync(favoriteToRemove.windfarm_id)
      setFavoriteToRemove(null)
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  if (isLoading) {
    return <FavoritesListSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-8 text-center">
          <p className="text-destructive">Failed to load favorites</p>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.favorites.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-12 text-center">
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Star wind farms to add them to your favorites for quick access.
          </p>
          <Button asChild>
            <Link to="/wind-farms">Browse Wind Farms</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalCapacity = data.favorites.reduce(
    (sum, f) => sum + (f.windfarm.nameplate_capacity_mw || 0),
    0
  )
  const countries = new Set(
    data.favorites.map((f) => f.windfarm.country_name).filter(Boolean)
  )

  return (
    <>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Star className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                  <p className="text-2xl font-bold">{data.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl font-bold">
                    {totalCapacity.toFixed(0)}{' '}
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
                  <p className="text-2xl font-bold">{countries.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Favorites Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              Favorited Wind Farms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Capacity (MW)</TableHead>
                  <TableHead className="text-right">Added</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.favorites.map((favorite) => (
                  <TableRow key={favorite.id}>
                    <TableCell>
                      <Link
                        to="/wind-farms/$windfarmId"
                        params={{ windfarmId: String(favorite.windfarm_id) }}
                        className="font-medium hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <Wind className="h-4 w-4 text-muted-foreground" />
                        {favorite.windfarm.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {favorite.windfarm.country_name || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {favorite.windfarm.nameplate_capacity_mw?.toFixed(1) || '-'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(favorite.added_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <Link
                            to="/wind-farms/$windfarmId"
                            params={{ windfarmId: String(favorite.windfarm_id) }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setFavoriteToRemove(favorite)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Remove Confirmation */}
      <AlertDialog
        open={!!favoriteToRemove}
        onOpenChange={(open) => !open && setFavoriteToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Favorites</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{favoriteToRemove?.windfarm.name}"
              from your favorites?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeFavorite.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function FavoritesListSkeleton() {
  return (
    <div className="space-y-6">
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

      <Card className="bg-card/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
