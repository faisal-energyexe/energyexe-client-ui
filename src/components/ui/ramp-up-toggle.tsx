import * as React from 'react'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface RampUpToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

function RampUpToggle({ checked, onCheckedChange, className }: RampUpToggleProps) {
  const id = React.useId()

  return (
    <div className={cn('flex flex-row items-center gap-2', className)}>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Label
            htmlFor={id}
            className="cursor-pointer text-xs whitespace-nowrap"
          >
            Exclude ramp-up
          </Label>
        </TooltipTrigger>
        <TooltipContent side="top">
          Exclude the initial ramp-up period after a generation unit comes
          online, when output has not yet stabilised.
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { RampUpToggle }
export type { RampUpToggleProps }
