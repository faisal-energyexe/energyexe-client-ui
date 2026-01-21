/**
 * PortfolioManager - Main portfolio management page.
 */

import { useState } from 'react'
import {
  FolderHeart,
  Star,
  Grid3X3,
  List,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreatePortfolioModal } from './create-portfolio-modal'
import { PortfolioList } from './portfolio-list'
import { FavoritesList } from './favorites-list'

type ViewMode = 'grid' | 'list'

export function PortfolioManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [activeTab, setActiveTab] = useState('portfolios')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolios</h1>
          <p className="text-muted-foreground mt-1">
            Organize and track your wind farm collections
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-background/50">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          <CreatePortfolioModal />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card/50 border">
          <TabsTrigger value="portfolios" className="gap-2">
            <FolderHeart className="h-4 w-4" />
            Portfolios
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Star className="h-4 w-4" />
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolios" className="mt-6">
          <PortfolioList />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <FavoritesList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Portfolio page header with summary stats.
 */
interface PortfolioPageHeaderProps {
  totalPortfolios: number
  totalWindfarms: number
  totalCapacity: number
}

export function PortfolioPageHeader({
  totalPortfolios,
  totalWindfarms,
  totalCapacity,
}: PortfolioPageHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Portfolios</div>
          <div className="text-3xl font-bold mt-1">{totalPortfolios}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Total Wind Farms</div>
          <div className="text-3xl font-bold mt-1">{totalWindfarms}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Total Capacity</div>
          <div className="text-3xl font-bold mt-1">
            {totalCapacity.toLocaleString()}{' '}
            <span className="text-lg font-normal text-muted-foreground">MW</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
