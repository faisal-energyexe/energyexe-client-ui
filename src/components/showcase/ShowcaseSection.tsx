import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InputShowcase } from './forms/InputShowcase'
import { SelectShowcase } from './forms/SelectShowcase'
import { DatePickerShowcase } from './forms/DatePickerShowcase'
import { CheckboxRadioShowcase } from './forms/CheckboxRadioShowcase'
import { SliderShowcase } from './forms/SliderShowcase'
import { TableShowcase } from './data/TableShowcase'
import { ChartsShowcase } from './data/ChartsShowcase'
import { BadgesProgressShowcase } from './data/BadgesProgressShowcase'
import { DialogShowcase } from './feedback/DialogShowcase'
import { ToastShowcase } from './feedback/ToastShowcase'
import { AlertShowcase } from './feedback/AlertShowcase'
import { TabsShowcase } from './navigation/TabsShowcase'
import { AccordionShowcase } from './navigation/AccordionShowcase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ShowcaseSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Component Showcase</h2>
        <p className="text-muted-foreground">
          Explore all UI components with the current theme applied
        </p>
      </div>

      <Tabs defaultValue="forms" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forms">Forms & Inputs</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Text Inputs</CardTitle>
                <CardDescription>Various input types and states</CardDescription>
              </CardHeader>
              <CardContent>
                <InputShowcase />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selects & Dropdowns</CardTitle>
                <CardDescription>Selection components including combobox</CardDescription>
              </CardHeader>
              <CardContent>
                <SelectShowcase />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date Pickers</CardTitle>
                <CardDescription>Calendar and date range selection</CardDescription>
              </CardHeader>
              <CardContent>
                <DatePickerShowcase />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Checkboxes & Radio</CardTitle>
                  <CardDescription>Toggle and selection controls</CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckboxRadioShowcase />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sliders</CardTitle>
                  <CardDescription>Range and value sliders</CardDescription>
                </CardHeader>
                <CardContent>
                  <SliderShowcase />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Table</CardTitle>
                <CardDescription>Sortable and filterable table with turbine data</CardDescription>
              </CardHeader>
              <CardContent>
                <TableShowcase />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges & Progress</CardTitle>
                <CardDescription>Status indicators and progress bars</CardDescription>
              </CardHeader>
              <CardContent>
                <BadgesProgressShowcase />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tabs Navigation</CardTitle>
                  <CardDescription>Tab-based content organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <TabsShowcase />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accordion</CardTitle>
                  <CardDescription>Collapsible content sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccordionShowcase />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          <ChartsShowcase />
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Inline notification banners</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertShowcase />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Dialogs</CardTitle>
                  <CardDescription>Modal dialogs and confirmations</CardDescription>
                </CardHeader>
                <CardContent>
                  <DialogShowcase />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Toasts</CardTitle>
                  <CardDescription>Toast notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ToastShowcase />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
