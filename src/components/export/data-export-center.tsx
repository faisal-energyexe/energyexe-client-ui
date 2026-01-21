/**
 * DataExportCenter - Comprehensive data export functionality.
 */

import { useState } from 'react'
import {
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
  Calendar,
  Wind,
  BarChart3,
  CloudSun,
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useWindfarms } from '@/lib/windfarms-api'
import { DateRangePicker } from '@/components/generation/date-range-picker'
import { getDateRangePreset } from '@/lib/generation-api'

type ExportFormat = 'csv' | 'excel' | 'json'
type DataType = 'generation' | 'weather' | 'price' | 'windfarms'

interface ExportConfig {
  dataType: DataType
  format: ExportFormat
  windfarmId: string
  startDate: string
  endDate: string
  includeMetadata: boolean
}

interface ExportJob {
  id: string
  dataType: DataType
  format: ExportFormat
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  filename?: string
  error?: string
  startedAt: Date
}

const DATA_TYPE_INFO: Record<DataType, { label: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  generation: {
    label: 'Generation Data',
    icon: BarChart3,
    description: 'Hourly power output, capacity factor, and quality metrics',
  },
  weather: {
    label: 'Weather Data',
    icon: CloudSun,
    description: 'Wind speed, direction, temperature, and atmospheric data',
  },
  price: {
    label: 'Price Data',
    icon: DollarSign,
    description: 'Day-ahead prices, capture rates, and revenue metrics',
  },
  windfarms: {
    label: 'Wind Farm Data',
    icon: Wind,
    description: 'Farm specifications, locations, and ownership information',
  },
}

const FORMAT_INFO: Record<ExportFormat, { label: string; icon: React.ComponentType<{ className?: string }>; ext: string }> = {
  csv: { label: 'CSV', icon: FileText, ext: '.csv' },
  excel: { label: 'Excel', icon: FileSpreadsheet, ext: '.xlsx' },
  json: { label: 'JSON', icon: FileJson, ext: '.json' },
}

const { startDate: defaultStart, endDate: defaultEnd } = getDateRangePreset('30d')

export function DataExportCenter() {
  const [config, setConfig] = useState<ExportConfig>({
    dataType: 'generation',
    format: 'csv',
    windfarmId: 'all',
    startDate: defaultStart,
    endDate: defaultEnd,
    includeMetadata: true,
  })

  const [selectedDataTypes, setSelectedDataTypes] = useState<DataType[]>(['generation'])
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [preset, setPreset] = useState<string>('30d')

  const { data: windfarms } = useWindfarms({ limit: 200 })

  const handleDateRangeChange = (start: string, end: string) => {
    setConfig((prev) => ({ ...prev, startDate: start, endDate: end }))
    setPreset('custom')
  }

  const handlePresetChange = (newPreset: string) => {
    setPreset(newPreset)
    if (newPreset !== 'custom') {
      const { startDate, endDate } = getDateRangePreset(newPreset)
      setConfig((prev) => ({ ...prev, startDate, endDate }))
    }
  }

  const handleDataTypeToggle = (dataType: DataType) => {
    setSelectedDataTypes((prev) =>
      prev.includes(dataType)
        ? prev.filter((t) => t !== dataType)
        : [...prev, dataType]
    )
  }

  const handleExport = async () => {
    // Create export jobs for each selected data type
    const newJobs: ExportJob[] = selectedDataTypes.map((dataType) => ({
      id: `${dataType}-${Date.now()}`,
      dataType,
      format: config.format,
      status: 'pending' as const,
      progress: 0,
      startedAt: new Date(),
    }))

    setExportJobs((prev) => [...newJobs, ...prev])

    // Simulate export process for each job
    for (const job of newJobs) {
      setExportJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, status: 'processing' as const } : j
        )
      )

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setExportJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, progress } : j))
        )
      }

      // Complete the job
      const filename = generateFilename(job.dataType, config.format, config.windfarmId)
      setExportJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, status: 'completed' as const, filename }
            : j
        )
      )

      // Trigger download (in real implementation, this would be an actual file)
      downloadMockFile(filename, job.dataType, config.format)
    }
  }

  const generateFilename = (dataType: DataType, format: ExportFormat, windfarmId: string) => {
    const farmName = windfarmId === 'all' ? 'all_farms' : `farm_${windfarmId}`
    const dateStr = new Date().toISOString().split('T')[0]
    return `${dataType}_${farmName}_${dateStr}${FORMAT_INFO[format].ext}`
  }

  const downloadMockFile = (filename: string, dataType: DataType, format: ExportFormat) => {
    // Create mock data for download
    let content: string
    let mimeType: string

    if (format === 'json') {
      content = JSON.stringify({
        metadata: {
          exported_at: new Date().toISOString(),
          data_type: dataType,
          date_range: { start: config.startDate, end: config.endDate },
        },
        data: [],
      }, null, 2)
      mimeType = 'application/json'
    } else {
      content = 'timestamp,value,quality\n2024-01-01 00:00:00,100.5,1.0\n2024-01-01 01:00:00,102.3,1.0'
      mimeType = 'text/csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isExporting = exportJobs.some((j) => j.status === 'processing')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Download className="h-6 w-6 text-primary" />
            Data Export Center
          </h2>
          <p className="text-muted-foreground mt-1">
            Export wind farm data in various formats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Export Configuration</CardTitle>
            <CardDescription>
              Select the data you want to export and configure the options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Type Selection */}
            <div className="space-y-3">
              <Label>Select Data Types</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(Object.entries(DATA_TYPE_INFO) as [DataType, typeof DATA_TYPE_INFO[DataType]][]).map(
                  ([type, info]) => {
                    const Icon = info.icon
                    const isSelected = selectedDataTypes.includes(type)
                    return (
                      <div
                        key={type}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50 hover:border-border'
                        )}
                        onClick={() => handleDataTypeToggle(type)}
                      >
                        <Checkbox checked={isSelected} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{info.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>

            <Separator />

            {/* Wind Farm Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wind Farm</Label>
                <Select
                  value={config.windfarmId}
                  onValueChange={(value) =>
                    setConfig((prev) => ({ ...prev, windfarmId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wind farm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wind Farms</SelectItem>
                    {windfarms?.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id.toString()}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={config.format}
                  onValueChange={(value: ExportFormat) =>
                    setConfig((prev) => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(FORMAT_INFO) as [ExportFormat, typeof FORMAT_INFO[ExportFormat]][]).map(
                      ([format, info]) => {
                        const Icon = info.icon
                        return (
                          <SelectItem key={format} value={format}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {info.label}
                            </div>
                          </SelectItem>
                        )
                      }
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>
              <DateRangePicker
                startDate={config.startDate}
                endDate={config.endDate}
                onDateRangeChange={handleDateRangeChange}
                preset={preset}
                onPresetChange={handlePresetChange}
              />
            </div>

            {/* Options */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="include-metadata"
                checked={config.includeMetadata}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, includeMetadata: !!checked }))
                }
              />
              <Label htmlFor="include-metadata" className="text-sm font-normal cursor-pointer">
                Include metadata (export timestamp, filters applied, data quality info)
              </Label>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={selectedDataTypes.length === 0 || isExporting}
              className="w-full md:w-auto"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {selectedDataTypes.length} Dataset
                  {selectedDataTypes.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export History */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Export History</CardTitle>
            <CardDescription>Recent export jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {exportJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Download className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No exports yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exportJobs.slice(0, 10).map((job) => {
                  const DataIcon = DATA_TYPE_INFO[job.dataType].icon
                  const FormatIcon = FORMAT_INFO[job.format].icon

                  return (
                    <div
                      key={job.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
                    >
                      <DataIcon className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {DATA_TYPE_INFO[job.dataType].label}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FormatIcon className="h-3 w-3" />
                          <span>{FORMAT_INFO[job.format].label}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {job.status === 'pending' && (
                          <Badge variant="secondary" className="text-xs">
                            Pending
                          </Badge>
                        )}
                        {job.status === 'processing' && (
                          <Badge variant="secondary" className="text-xs">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            {job.progress}%
                          </Badge>
                        )}
                        {job.status === 'completed' && (
                          <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Done
                          </Badge>
                        )}
                        {job.status === 'failed' && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(DATA_TYPE_INFO) as [DataType, typeof DATA_TYPE_INFO[DataType]][]).map(
          ([type, info]) => {
            const Icon = info.icon
            return (
              <Card
                key={type}
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedDataTypes([type])
                  setConfig((prev) => ({ ...prev, dataType: type }))
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{info.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Quick export
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )
          }
        )}
      </div>
    </div>
  )
}
