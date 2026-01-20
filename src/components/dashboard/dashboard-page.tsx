import { KpiCards } from './kpi-cards'
import { GenerationChart } from './generation-chart'
import { MapPreview } from './map-preview'
import { RecentAlerts } from './recent-alerts'
import { QuickStats } from './quick-stats'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KpiCards />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Generation Chart - Takes 2 columns */}
        <GenerationChart />

        {/* Right Column */}
        <div className="space-y-6">
          <QuickStats />
          <RecentAlerts />
        </div>
      </div>

      {/* Map Section */}
      <MapPreview />
    </div>
  )
}
