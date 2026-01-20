'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ToastShowcase() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'The scheduled maintenance has been added to the calendar.',
          })
        }
      >
        Default Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.success('Turbine Started', {
            description: 'T-006 Zeta is now operational.',
          })
        }
      >
        Success Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.error('Connection Failed', {
            description: 'Unable to connect to the monitoring system.',
          })
        }
      >
        Error Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Low Wind Speed', {
            description: 'Wind speed below optimal threshold.',
          })
        }
      >
        Warning Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.info('Scheduled Maintenance', {
            description: 'T-013 Nu scheduled for inspection tomorrow.',
          })
        }
      >
        Info Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: 'Exporting report...',
              success: 'Report exported successfully!',
              error: 'Failed to export report.',
            }
          )
        }
      >
        Promise Toast
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast('New turbine detected', {
            description: 'Would you like to add it to monitoring?',
            action: {
              label: 'Add Now',
              onClick: () => toast.success('Turbine added!'),
            },
          })
        }
      >
        Action Toast
      </Button>
    </div>
  )
}
