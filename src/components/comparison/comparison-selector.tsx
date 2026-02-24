import { useState, useMemo } from 'react'
import { Wind, X, Search, Plus, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  useWindfarmsForComparison,
  type WindfarmForComparison,
  formatCapacityMW,
  getChartColor,
} from '@/lib/comparison-api'

interface ComparisonSelectorProps {
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  maxSelection?: number
}

export function ComparisonSelector({
  selectedIds,
  onSelectionChange,
  maxSelection = 6,
}: ComparisonSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: windfarms, isLoading, error } = useWindfarmsForComparison()

  const filteredWindfarms = useMemo(() => {
    if (!windfarms) return []
    const query = searchQuery.toLowerCase()
    return windfarms.filter(
      (wf) => wf.name.toLowerCase().includes(query) && wf.has_data
    )
  }, [windfarms, searchQuery])

  const selectedWindfarms = useMemo(() => {
    if (!windfarms) return []
    return windfarms.filter((wf) => selectedIds.includes(wf.id))
  }, [windfarms, selectedIds])

  const handleSelect = (wf: WindfarmForComparison) => {
    if (selectedIds.includes(wf.id)) {
      onSelectionChange(selectedIds.filter((id) => id !== wf.id))
    } else if (selectedIds.length < maxSelection) {
      onSelectionChange([...selectedIds, wf.id])
    }
  }

  const handleRemove = (id: number) => {
    onSelectionChange(selectedIds.filter((i) => i !== id))
  }

  const canCompare = selectedIds.length >= 2

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-primary" />
          Select Wind Farms to Compare
        </CardTitle>
        <CardDescription>
          Choose 2-{maxSelection} wind farms to compare their performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Farms */}
        {selectedWindfarms.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Selected ({selectedWindfarms.length}/{maxSelection})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedWindfarms.map((wf, index) => (
                <Badge
                  key={wf.id}
                  variant="secondary"
                  className="gap-2 py-1.5 px-3"
                  style={{ borderColor: getChartColor(index), borderWidth: 2 }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <span className="font-medium">{wf.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatCapacityMW(wf.capacity_mw)}
                  </span>
                  <button
                    onClick={() => handleRemove(wf.id)}
                    className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Status */}
        {!canCompare && selectedIds.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <AlertCircle className="h-4 w-4" />
            Select at least one more wind farm to compare
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wind farms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/30"
          />
        </div>

        {/* Available Farms */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load wind farms
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-1">
              {filteredWindfarms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? 'No wind farms match your search'
                    : 'No wind farms with data available'}
                </div>
              ) : (
                filteredWindfarms.map((wf) => {
                  const isSelected = selectedIds.includes(wf.id)
                  const isDisabled = !isSelected && selectedIds.length >= maxSelection
                  const selectedIndex = selectedIds.indexOf(wf.id)

                  return (
                    <button
                      key={wf.id}
                      onClick={() => handleSelect(wf)}
                      disabled={isDisabled}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg text-left
                        transition-colors
                        ${isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/30'}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected ? (
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: getChartColor(selectedIndex) }}
                          >
                            {selectedIndex + 1}
                          </span>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <Plus className="h-3 w-3 text-muted-foreground/50" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{wf.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCapacityMW(wf.capacity_mw)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
