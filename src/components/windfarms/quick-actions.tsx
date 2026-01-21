import {
  Download,
  FileText,
  GitCompare,
  Heart,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface QuickActionsProps {
  windfarmId: number
}

export function QuickActions({ windfarmId }: QuickActionsProps) {
  const handleAddToFavorites = () => {
    // Phase 7: Portfolio Management
    console.log('Add to favorites:', windfarmId)
  }

  const handleCompare = () => {
    // Phase 6: Comparison Engine
    console.log('Compare:', windfarmId)
  }

  const handleGenerateReport = () => {
    // Phase 8: Reporting System
    console.log('Generate report:', windfarmId)
  }

  const handleExport = (format: string) => {
    // Phase 10: Data Export
    console.log('Export:', windfarmId, format)
  }

  const handleShare = () => {
    // Copy link to clipboard
    const url = `${window.location.origin}/wind-farms/${windfarmId}`
    navigator.clipboard.writeText(url)
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Add to Favorites */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-card/50 border-border/50 hover:bg-card"
              onClick={handleAddToFavorites}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to favorites</p>
          </TooltipContent>
        </Tooltip>

        {/* Compare */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-card/50 border-border/50 hover:bg-card"
              onClick={handleCompare}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to comparison</p>
          </TooltipContent>
        </Tooltip>

        {/* Generate Report */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-card/50 border-border/50 hover:bg-card"
              onClick={handleGenerateReport}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate report</p>
          </TooltipContent>
        </Tooltip>

        {/* Export Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-card/50 border-border/50 hover:bg-card"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export data</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')}>
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Share */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-card/50 border-border/50 hover:bg-card"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy link</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
