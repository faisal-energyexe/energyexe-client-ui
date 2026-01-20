'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts'
import {
  monthlyGeneration,
  energyBreakdown,
  efficiencyGauges,
  sitePerformance,
  weeklyTrend,
} from '@/lib/showcase-data'

// Custom colors that use CSS variables
const CHART_COLORS = [
  'oklch(var(--chart-1))',
  'oklch(var(--chart-2))',
  'oklch(var(--chart-3))',
  'oklch(var(--chart-4))',
  'oklch(var(--chart-5))',
  'oklch(var(--chart-6))',
]

export function ChartsShowcase() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>Monthly generation comparison (GWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyGeneration}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'oklch(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'oklch(var(--muted-foreground))' }}
                />
                <YAxis
                  tick={{ fill: 'oklch(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'oklch(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(var(--card))',
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="actual" fill="oklch(var(--chart-1))" name="Actual" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast" fill="oklch(var(--chart-2))" name="Forecast" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
            <CardDescription>Weekly generation and revenue trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'oklch(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'oklch(var(--muted-foreground))' }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: 'oklch(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'oklch(var(--muted-foreground))' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'oklch(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'oklch(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(var(--card))',
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="generation"
                  stroke="oklch(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(var(--chart-1))' }}
                  name="Generation (MWh)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(var(--chart-3))' }}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
            <CardDescription>Energy source breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energyBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {energyBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(var(--card))',
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Radial Gauge</CardTitle>
            <CardDescription>System efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                barSize={20}
                data={efficiencyGauges}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: 'oklch(var(--muted) / 0.3)' }}
                  dataKey="value"
                  cornerRadius={10}
                >
                  {efficiencyGauges.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </RadialBar>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(var(--card))',
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value}%`, 'Value']}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Composed Chart</CardTitle>
          <CardDescription>Site performance: generation (bar), efficiency (line), turbine count (area)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={sitePerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="site"
                tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }}
                tickLine={{ stroke: 'oklch(var(--muted-foreground))' }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: 'oklch(var(--muted-foreground))' }}
                tickLine={{ stroke: 'oklch(var(--muted-foreground))' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'oklch(var(--muted-foreground))' }}
                tickLine={{ stroke: 'oklch(var(--muted-foreground))' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(var(--card))',
                  border: '1px solid oklch(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="turbines"
                fill="oklch(var(--chart-4) / 0.3)"
                stroke="oklch(var(--chart-4))"
                name="Turbines"
              />
              <Bar
                yAxisId="left"
                dataKey="generation"
                fill="oklch(var(--chart-1))"
                radius={[4, 4, 0, 0]}
                name="Generation (MWh)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="efficiency"
                stroke="oklch(var(--chart-2))"
                strokeWidth={3}
                dot={{ fill: 'oklch(var(--chart-2))', r: 6 }}
                name="Efficiency (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
