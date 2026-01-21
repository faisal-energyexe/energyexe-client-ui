/**
 * EditPortfolioModal - Modal for editing an existing portfolio.
 */

import { useState, useEffect } from 'react'
import { Eye, Building2, Users, Layers } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import {
  type PortfolioType,
  type Portfolio,
  type PortfolioUpdate,
  useUpdatePortfolio,
} from '@/lib/portfolio-api'

interface EditPortfolioModalProps {
  portfolio: Portfolio
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const portfolioTypes: {
  value: PortfolioType
  label: string
  description: string
  icon: React.ElementType
}[] = [
  {
    value: 'watchlist',
    label: 'Watchlist',
    description: 'Track wind farms you want to monitor',
    icon: Eye,
  },
  {
    value: 'owned',
    label: 'Owned Assets',
    description: "Your company's owned wind farm portfolio",
    icon: Building2,
  },
  {
    value: 'competitor',
    label: 'Competitors',
    description: 'Track competitor wind farms',
    icon: Users,
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Create a custom collection',
    icon: Layers,
  },
]

export function EditPortfolioModal({
  portfolio,
  open,
  onOpenChange,
  onSuccess,
}: EditPortfolioModalProps) {
  const [name, setName] = useState(portfolio.name)
  const [description, setDescription] = useState(portfolio.description || '')
  const [portfolioType, setPortfolioType] = useState<PortfolioType>(
    portfolio.portfolio_type
  )

  const updatePortfolio = useUpdatePortfolio()

  // Reset form when portfolio changes
  useEffect(() => {
    setName(portfolio.name)
    setDescription(portfolio.description || '')
    setPortfolioType(portfolio.portfolio_type)
  }, [portfolio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    const data: PortfolioUpdate = {}

    if (name.trim() !== portfolio.name) {
      data.name = name.trim()
    }
    if ((description.trim() || null) !== portfolio.description) {
      data.description = description.trim() || null
    }
    if (portfolioType !== portfolio.portfolio_type) {
      data.portfolio_type = portfolioType
    }

    // Don't submit if nothing changed
    if (Object.keys(data).length === 0) {
      onOpenChange(false)
      return
    }

    try {
      await updatePortfolio.mutateAsync({
        portfolioId: portfolio.id,
        data,
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update portfolio:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Portfolio</DialogTitle>
            <DialogDescription>
              Update your portfolio details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="My Portfolio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>

            {/* Description Input */}
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Add a description for this portfolio..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50 resize-none"
                rows={2}
              />
            </div>

            {/* Portfolio Type Selection */}
            <div className="grid gap-3">
              <Label>Portfolio Type</Label>
              <RadioGroup
                value={portfolioType}
                onValueChange={(value) => setPortfolioType(value as PortfolioType)}
                className="grid grid-cols-2 gap-3"
              >
                {portfolioTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Label
                      key={type.value}
                      htmlFor={`edit-${type.value}`}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                        'hover:bg-accent/50',
                        portfolioType === type.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 bg-background/30'
                      )}
                    >
                      <RadioGroupItem
                        value={type.value}
                        id={`edit-${type.value}`}
                        className="sr-only"
                      />
                      <Icon
                        className={cn(
                          'h-5 w-5 mt-0.5',
                          portfolioType === type.value
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        )}
                      />
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                    </Label>
                  )
                })}
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || updatePortfolio.isPending}
            >
              {updatePortfolio.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
