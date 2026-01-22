/**
 * AnomaliesPage - Data quality monitoring and anomaly detection dashboard.
 */

import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  XCircle,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  useAnomalies,
  useUpdateAnomalyStatus,
  ANOMALY_TYPE_DISPLAY_NAMES,
  ANOMALY_SEVERITY_DISPLAY_NAMES,
  ANOMALY_STATUS_DISPLAY_NAMES,
  ANOMALY_SEVERITY_COLORS,
  ANOMALY_STATUS_COLORS,
  type DataAnomaly,
  type AnomalySeverity,
  type AnomalyStatus,
  type AnomalyListFilters,
} from '@/lib/anomalies-api'

export function AnomaliesPage() {
  const [filters, setFilters] = useState<AnomalyListFilters>({
    is_active: true,
    page: 1,
    page_size: 20,
  })
  const [selectedAnomaly, setSelectedAnomaly] = useState<DataAnomaly | null>(
    null
  )
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<AnomalyStatus>('investigating')
  const [resolutionNotes, setResolutionNotes] = useState('')

  const { data, isLoading, error } = useAnomalies(filters)
  const updateStatusMutation = useUpdateAnomalyStatus()

  // Compute summary statistics
  const stats = useMemo(() => {
    if (!data?.anomalies)
      return { total: 0, pending: 0, investigating: 0, critical: 0 }

    return {
      total: data.total,
      pending: data.anomalies.filter((a) => a.status === 'pending').length,
      investigating: data.anomalies.filter((a) => a.status === 'investigating')
        .length,
      critical: data.anomalies.filter((a) => a.severity === 'critical').length,
    }
  }, [data])

  const handleFilterChange = (
    key: keyof AnomalyListFilters,
    value: string | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1, // Reset to first page on filter change
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const handleViewAnomaly = (anomaly: DataAnomaly) => {
    setSelectedAnomaly(anomaly)
    setIsDetailModalOpen(true)
  }

  const handleUpdateStatus = (anomaly: DataAnomaly) => {
    setSelectedAnomaly(anomaly)
    setNewStatus(
      anomaly.status === 'pending' ? 'investigating' : 'resolved'
    )
    setResolutionNotes('')
    setIsStatusModalOpen(true)
  }

  const confirmStatusUpdate = async () => {
    if (!selectedAnomaly) return

    try {
      await updateStatusMutation.mutateAsync({
        anomalyId: selectedAnomaly.id,
        data: {
          status: newStatus,
          resolution_notes: resolutionNotes || undefined,
        },
      })
      setIsStatusModalOpen(false)
      setSelectedAnomaly(null)
    } catch {
      // Error handled by mutation
    }
  }

  const clearFilters = () => {
    setFilters({
      is_active: true,
      page: 1,
      page_size: 20,
    })
  }

  const hasActiveFilters =
    filters.severity || filters.status || filters.anomaly_type

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Anomalies</h1>
            <p className="text-muted-foreground">
              Data quality monitoring and anomaly detection
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Anomalies"
          value={stats.total}
          subtitle="All active"
          icon={AlertTriangle}
        />
        <SummaryCard
          title="Pending Review"
          value={stats.pending}
          subtitle="Awaiting action"
          icon={Clock}
          variant={stats.pending > 0 ? 'warning' : 'default'}
        />
        <SummaryCard
          title="Investigating"
          value={stats.investigating}
          subtitle="In progress"
          icon={Search}
          variant={stats.investigating > 0 ? 'info' : 'default'}
        />
        <SummaryCard
          title="Critical"
          value={stats.critical}
          subtitle="High priority"
          icon={XCircle}
          variant={stats.critical > 0 ? 'error' : 'default'}
        />
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={filters.severity || 'all'}
                onValueChange={(v) => handleFilterChange('severity', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(v) => handleFilterChange('status', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Anomaly Type</Label>
              <Select
                value={filters.anomaly_type || 'all'}
                onValueChange={(v) => handleFilterChange('anomaly_type', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="high_capacity_factor">
                    High Capacity Factor
                  </SelectItem>
                  <SelectItem value="low_capacity_factor">
                    Low Capacity Factor
                  </SelectItem>
                  <SelectItem value="missing_data">Missing Data</SelectItem>
                  <SelectItem value="data_spike">Data Spike</SelectItem>
                  <SelectItem value="data_gap">Data Gap</SelectItem>
                  <SelectItem value="negative_generation">
                    Negative Generation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Active Status</Label>
              <Select
                value={filters.is_active === undefined ? 'all' : String(filters.is_active)}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    is_active: v === 'all' ? undefined : v === 'true',
                    page: 1,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Active status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Active Only</SelectItem>
                  <SelectItem value="false">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomalies Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Anomalies
            {data && (
              <span className="text-muted-foreground font-normal ml-2">
                ({data.total} total)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <XCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
              <p>Failed to load anomalies</p>
            </div>
          ) : !data || data.anomalies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
              <p>No anomalies found</p>
              {hasActiveFilters && (
                <p className="text-sm mt-1">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-[100px]">Severity</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Wind Farm</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="w-[200px]">Detected</TableHead>
                      <TableHead className="w-[100px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.anomalies.map((anomaly) => (
                      <TableRow
                        key={anomaly.id}
                        className="hover:bg-muted/20 cursor-pointer"
                        onClick={() => handleViewAnomaly(anomaly)}
                      >
                        <TableCell>
                          <SeverityBadge severity={anomaly.severity} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={anomaly.status} />
                        </TableCell>
                        <TableCell className="font-medium">
                          {ANOMALY_TYPE_DISPLAY_NAMES[anomaly.anomaly_type] ||
                            anomaly.anomaly_type}
                        </TableCell>
                        <TableCell>
                          {anomaly.windfarm_name ? (
                            <Link
                              to="/wind-farms/$windfarmId"
                              params={{ windfarmId: String(anomaly.windfarm_id) }}
                              className="text-primary hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {anomaly.windfarm_name}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(anomaly.period_start).toLocaleDateString()}{' '}
                          - {new Date(anomaly.period_end).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(anomaly.detected_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewAnomaly(anomaly)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {anomaly.status !== 'resolved' &&
                              anomaly.status !== 'false_positive' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(anomaly)
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {data.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {data.page} of {data.total_pages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.page <= 1}
                      onClick={() => handlePageChange(data.page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.page >= data.total_pages}
                      onClick={() => handlePageChange(data.page + 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Anomaly Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the detected anomaly
            </DialogDescription>
          </DialogHeader>

          {selectedAnomaly && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Severity</Label>
                  <div>
                    <SeverityBadge severity={selectedAnomaly.severity} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Status</Label>
                  <div>
                    <StatusBadge status={selectedAnomaly.status} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">
                    {ANOMALY_TYPE_DISPLAY_NAMES[selectedAnomaly.anomaly_type] ||
                      selectedAnomaly.anomaly_type}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Wind Farm</Label>
                  <p className="font-medium">
                    {selectedAnomaly.windfarm_name || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Period Start</Label>
                  <p className="font-medium">
                    {new Date(selectedAnomaly.period_start).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Period End</Label>
                  <p className="font-medium">
                    {new Date(selectedAnomaly.period_end).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Detected At</Label>
                  <p className="font-medium">
                    {new Date(selectedAnomaly.detected_at).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-medium">#{selectedAnomaly.id}</p>
                </div>
              </div>

              {selectedAnomaly.description && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedAnomaly.description}</p>
                </div>
              )}

              {selectedAnomaly.resolution_notes && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">
                    Resolution Notes
                  </Label>
                  <p className="text-sm">{selectedAnomaly.resolution_notes}</p>
                </div>
              )}

              {selectedAnomaly.anomaly_metadata && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">
                    Additional Details
                  </Label>
                  <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-auto max-h-32">
                    {JSON.stringify(selectedAnomaly.anomaly_metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Close
            </Button>
            {selectedAnomaly &&
              selectedAnomaly.status !== 'resolved' &&
              selectedAnomaly.status !== 'false_positive' && (
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false)
                    handleUpdateStatus(selectedAnomaly)
                  }}
                >
                  Update Status
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Anomaly Status</DialogTitle>
            <DialogDescription>
              Change the status and add resolution notes if applicable
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select
                value={newStatus}
                onValueChange={(v) => setNewStatus(v as AnomalyStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resolution Notes (optional)</Label>
              <Textarea
                placeholder="Add notes about the resolution or action taken..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusUpdate}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface SummaryCardProps {
  title: string
  value: number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'warning' | 'info' | 'error'
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}: SummaryCardProps) {
  return (
    <Card
      className={cn(
        'bg-card/50 backdrop-blur-sm border-border/50',
        variant === 'warning' && 'border-amber-500/30 bg-amber-500/5',
        variant === 'info' && 'border-blue-500/30 bg-blue-500/5',
        variant === 'error' && 'border-red-500/30 bg-red-500/5'
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p
              className={cn(
                'text-2xl font-bold',
                variant === 'warning' && 'text-amber-400',
                variant === 'info' && 'text-blue-400',
                variant === 'error' && 'text-red-400'
              )}
            >
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <Icon
            className={cn(
              'h-8 w-8',
              variant === 'default' && 'text-muted-foreground/50',
              variant === 'warning' && 'text-amber-400/50',
              variant === 'info' && 'text-blue-400/50',
              variant === 'error' && 'text-red-400/50'
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function SeverityBadge({ severity }: { severity: AnomalySeverity }) {
  return (
    <Badge
      variant="outline"
      className={cn('text-xs', ANOMALY_SEVERITY_COLORS[severity])}
    >
      {ANOMALY_SEVERITY_DISPLAY_NAMES[severity]}
    </Badge>
  )
}

function StatusBadge({ status }: { status: AnomalyStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn('text-xs', ANOMALY_STATUS_COLORS[status])}
    >
      {ANOMALY_STATUS_DISPLAY_NAMES[status]}
    </Badge>
  )
}

export default AnomaliesPage
