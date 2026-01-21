/**
 * CreatePortfolioModal - Modal for creating a new portfolio.
 */

import { useState } from 'react'
import { FolderPlus, Eye, Building2, Users, Layers } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { type PortfolioType, type PortfolioCreate, useCreatePortfolio } from '@/lib/portfolio-api'

interface CreatePortfolioModalProps {
  trigger?: React.ReactNode
  onSuccess?: (portfolio: { id: number; name: string }) => void
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
    description: 'Your company\'s owned wind farm portfolio',
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

export function CreatePortfolioModal({ trigger, onSuccess }: CreatePortfolioModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [portfolioType, setPortfolioType] = useState<PortfolioType>('watchlist')

  const createPortfolio = useCreatePortfolio()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    const data: PortfolioCreate = {
      name: name.trim(),
      description: description.trim() || null,
      portfolio_type: portfolioType,
    }

    try {
      const portfolio = await createPortfolio.mutateAsync(data)
      onSuccess?.({ id: portfolio.id, name: portfolio.name })
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error('Failed to create portfolio:', error)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setPortfolioType('watchlist')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Create Portfolio
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Portfolio</DialogTitle>
            <DialogDescription>
              Create a portfolio to organize and track wind farms.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My Portfolio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>

            {/* Description Input */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
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
                      htmlFor={type.value}
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
                        id={type.value}
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createPortfolio.isPending}
            >
              {createPortfolio.isPending ? 'Creating...' : 'Create Portfolio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
