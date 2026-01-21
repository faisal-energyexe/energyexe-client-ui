import { createFileRoute } from '@tanstack/react-router'
import { WindfarmMap } from '@/components/map'

export const Route = createFileRoute('/_protected/map')({
  component: MapPage,
})

function MapPage() {
  return (
    <div className="p-6 lg:p-8">
      <WindfarmMap />
    </div>
  )
}
