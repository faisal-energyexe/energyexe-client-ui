import { createFileRoute } from '@tanstack/react-router'
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
    <WeatherTab
      windfarmId={id}
      nameplateMW={windfarm?.nameplate_capacity_mw ?? undefined}
    />
  )
}
