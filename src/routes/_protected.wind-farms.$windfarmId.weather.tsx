import { createFileRoute } from '@tanstack/react-router'
import { WindfarmTabs } from '@/components/windfarms/windfarm-tabs'
import { WeatherTab } from '@/components/weather'
import { useWindfarmWithOwners } from '@/lib/windfarms-api'

export const Route = createFileRoute('/_protected/wind-farms/$windfarmId/weather')({
  component: WindfarmWeatherPage,
})

function WindfarmWeatherPage() {
  const { windfarmId } = Route.useParams()
  const id = parseInt(windfarmId, 10)

  const { data: windfarm } = useWindfarmWithOwners(id)

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Tab Navigation */}
      <WindfarmTabs windfarmId={id} />

      {/* Weather Content */}
      <WeatherTab
        windfarmId={id}
        nameplateMW={windfarm?.nameplate_capacity_mw ?? undefined}
      />
    </div>
  )
}
