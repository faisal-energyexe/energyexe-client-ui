import { createFileRoute } from '@tanstack/react-router'
import { WindfarmTabs } from '@/components/windfarms/windfarm-tabs'
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
    <div className="space-y-6 p-6 lg:p-8">
      {/* Tab Navigation */}
      <WindfarmTabs windfarmId={id} />

      {/* Market Content */}
      <MarketTab
        windfarmId={id}
        bidzoneId={windfarm?.bidzone_id ?? null}
      />
    </div>
  )
}
