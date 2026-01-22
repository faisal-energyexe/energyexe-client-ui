import { createFileRoute } from '@tanstack/react-router'
import { MarketTab } from '@/components/market'
import { useWindfarmWithOwners } from '@/lib/windfarms-api'

export const Route = createFileRoute('/_protected/wind-farms/$windfarmId/market')({
  component: WindfarmMarketPage,
})

function WindfarmMarketPage() {
  const { windfarmId } = Route.useParams()
  const id = parseInt(windfarmId, 10)

  const { data: windfarm } = useWindfarmWithOwners(id)

  return (
    <MarketTab
      windfarmId={id}
      bidzoneId={windfarm?.bidzone_id ?? null}
    />
  )
}
