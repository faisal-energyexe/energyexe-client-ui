'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function BadgesProgressShowcase() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Badge Variants</h4>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Status Badges</h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">
            Running
          </Badge>
          <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
            Maintenance
          </Badge>
          <Badge className="bg-red-500/20 text-red-700 dark:text-red-400">
            Critical
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">
            Info
          </Badge>
          <Badge className="bg-gray-500/20 text-gray-700 dark:text-gray-400">
            Idle
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Progress Bars</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Capacity Utilization</span>
              <span className="text-muted-foreground">75%</span>
            </div>
            <Progress value={75} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Grid Availability</span>
              <span className="text-muted-foreground">99%</span>
            </div>
            <Progress value={99} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Level</span>
              <span className="text-muted-foreground">42%</span>
            </div>
            <Progress value={42} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Loading...</span>
              <span className="text-muted-foreground">25%</span>
            </div>
            <Progress value={25} />
          </div>
        </div>
      </div>
    </div>
  )
}
