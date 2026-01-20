import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabsShowcase() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <div className="rounded-md border p-4">
          <h4 className="font-medium">Overview Tab</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            This is the overview section showing general turbine status and quick metrics.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <div className="rounded-md border p-4">
          <h4 className="font-medium">Analytics Tab</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Detailed analytics and performance charts would be displayed here.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="mt-4">
        <div className="rounded-md border p-4">
          <h4 className="font-medium">Settings Tab</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Configuration options and preferences for the monitoring system.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
