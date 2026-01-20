'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

export function SliderShowcase() {
  const [capacity, setCapacity] = useState([50])
  const [range, setRange] = useState([25, 75])
  const [efficiency, setEfficiency] = useState([85])

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Capacity Threshold</Label>
          <span className="text-sm text-muted-foreground">{capacity[0]}%</span>
        </div>
        <Slider
          value={capacity}
          onValueChange={setCapacity}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Power Range (MW)</Label>
          <span className="text-sm text-muted-foreground">
            {range[0]} - {range[1]} MW
          </span>
        </div>
        <Slider
          value={range}
          onValueChange={setRange}
          max={100}
          step={5}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Minimum Efficiency</Label>
          <span className="text-sm text-muted-foreground">{efficiency[0]}%</span>
        </div>
        <Slider
          value={efficiency}
          onValueChange={setEfficiency}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-4">
        <Label className="text-muted-foreground">Disabled Slider</Label>
        <Slider defaultValue={[60]} max={100} step={1} disabled />
      </div>
    </div>
  )
}
