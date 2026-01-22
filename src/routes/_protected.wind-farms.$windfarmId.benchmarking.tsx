import { createFileRoute } from '@tanstack/react-router'
import { useWindfarmWithOwners } from '@/lib/windfarms-api'
import { BenchmarkingTab } from '@/components/benchmarking'

export const Route = createFileRoute(
  '/_protected/wind-farms/$windfarmId/benchmarking'
)({
  component: WindfarmBenchmarkingPage,
})

function WindfarmBenchmarkingPage() {
  const { windfarmId } = Route.useParams()
  const id = parseInt(windfarmId, 10)

  const { data: windfarm } = useWindfarmWithOwners(id)

  return (
    <BenchmarkingTab
      windfarmId={id}
      windfarmName={windfarm?.name || 'Wind Farm'}
      bidzoneId={windfarm?.bidzone_id}
      countryId={windfarm?.country_id}
    />
  )
}
