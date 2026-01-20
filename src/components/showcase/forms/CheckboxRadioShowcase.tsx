'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function CheckboxRadioShowcase() {
  const [notifications, setNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">Checkboxes</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="font-normal">
              Accept terms and conditions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="updates" defaultChecked />
            <Label htmlFor="updates" className="font-normal">
              Receive email updates
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled" className="font-normal text-muted-foreground">
              Disabled checkbox
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Radio Group</Label>
        <RadioGroup defaultValue="daily">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="realtime" id="realtime" />
            <Label htmlFor="realtime" className="font-normal">
              Real-time alerts
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily" className="font-normal">
              Daily digest
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="font-normal">
              Weekly summary
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Switches</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="font-normal">
                Push Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Get notified about turbine alerts
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="backup" className="font-normal">
                Auto Backup
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically backup data daily
              </p>
            </div>
            <Switch
              id="backup"
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
