/**
 * Anomalies API client for data quality monitoring and anomaly detection.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// Types
// ============================================================================

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical'

export type AnomalyStatus =
  | 'pending'
  | 'investigating'
  | 'resolved'
  | 'ignored'
  | 'false_positive'

export type AnomalyType =
  | 'high_capacity_factor'
  | 'low_capacity_factor'
  | 'missing_data'
  | 'data_spike'
  | 'data_gap'
  | 'negative_generation'

export interface DataAnomaly {
  id: number
  anomaly_type: string
  severity: AnomalySeverity
  status: AnomalyStatus
  windfarm_id: number | null
  generation_unit_id: number | null
  period_start: string
  period_end: string
  description: string | null
  anomaly_metadata: Record<string, unknown> | null
  resolved_at: string | null
  resolved_by: number | null
  resolution_notes: string | null
  is_active: boolean
  detected_at: string
  created_at: string
  updated_at: string
  windfarm_name: string | null
  generation_unit_name: string | null
}

export interface AnomalyListFilters {
  windfarm_id?: number
  generation_unit_id?: number
  anomaly_type?: string
  status?: AnomalyStatus
  severity?: AnomalySeverity
  start_date?: string
  end_date?: string
  is_active?: boolean
  page?: number
  page_size?: number
}

export interface AnomalyListResponse {
  anomalies: DataAnomaly[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface AnomalyStatusUpdate {
  status: AnomalyStatus
  resolution_notes?: string
}

export interface AnomalyUpdate {
  status?: AnomalyStatus
  severity?: AnomalySeverity
  description?: string
  resolution_notes?: string
  anomaly_metadata?: Record<string, unknown>
}

// ============================================================================
// Query Keys
// ============================================================================

export const ANOMALIES_QUERY_KEY = ['anomalies']

// ============================================================================
// Display Helpers
// ============================================================================

export const ANOMALY_TYPE_DISPLAY_NAMES: Record<string, string> = {
  high_capacity_factor: 'High Capacity Factor',
  low_capacity_factor: 'Low Capacity Factor',
  missing_data: 'Missing Data',
  data_spike: 'Data Spike',
  data_gap: 'Data Gap',
  negative_generation: 'Negative Generation',
}

export const ANOMALY_SEVERITY_DISPLAY_NAMES: Record<AnomalySeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const ANOMALY_STATUS_DISPLAY_NAMES: Record<AnomalyStatus, string> = {
  pending: 'Pending',
  investigating: 'Investigating',
  resolved: 'Resolved',
  ignored: 'Ignored',
  false_positive: 'False Positive',
}

export const ANOMALY_SEVERITY_COLORS: Record<AnomalySeverity, string> = {
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export const ANOMALY_STATUS_COLORS: Record<AnomalyStatus, string> = {
  pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  investigating: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  ignored: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  false_positive: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

// ============================================================================
// API Functions
// ============================================================================

export async function listAnomalies(
  filters: AnomalyListFilters = {}
): Promise<AnomalyListResponse> {
  const params = new URLSearchParams()

  if (filters.windfarm_id !== undefined) {
    params.append('windfarm_id', String(filters.windfarm_id))
  }
  if (filters.generation_unit_id !== undefined) {
    params.append('generation_unit_id', String(filters.generation_unit_id))
  }
  if (filters.anomaly_type) {
    params.append('anomaly_type', filters.anomaly_type)
  }
  if (filters.status) {
    params.append('status', filters.status)
  }
  if (filters.severity) {
    params.append('severity', filters.severity)
  }
  if (filters.start_date) {
    params.append('start_date', filters.start_date)
  }
  if (filters.end_date) {
    params.append('end_date', filters.end_date)
  }
  if (filters.is_active !== undefined) {
    params.append('is_active', String(filters.is_active))
  }
  if (filters.page !== undefined) {
    params.append('page', String(filters.page))
  }
  if (filters.page_size !== undefined) {
    params.append('page_size', String(filters.page_size))
  }

  const query = params.toString()
  return apiClient.get<AnomalyListResponse>(
    `/anomalies${query ? `?${query}` : ''}`
  )
}

export async function getAnomaly(anomalyId: number): Promise<DataAnomaly> {
  return apiClient.get<DataAnomaly>(`/anomalies/${anomalyId}`)
}

export async function updateAnomalyStatus(
  anomalyId: number,
  data: AnomalyStatusUpdate
): Promise<DataAnomaly> {
  return apiClient.patch<DataAnomaly>(`/anomalies/${anomalyId}/status`, data)
}

export async function updateAnomaly(
  anomalyId: number,
  data: AnomalyUpdate
): Promise<DataAnomaly> {
  return apiClient.patch<DataAnomaly>(`/anomalies/${anomalyId}`, data)
}

export async function deleteAnomaly(
  anomalyId: number,
  hardDelete = false
): Promise<void> {
  const params = hardDelete ? '?hard_delete=true' : ''
  await apiClient.delete(`/anomalies/${anomalyId}${params}`)
}

// ============================================================================
// React Query Hooks
// ============================================================================

export function useAnomalies(filters: AnomalyListFilters = {}) {
  return useQuery<AnomalyListResponse>({
    queryKey: [...ANOMALIES_QUERY_KEY, 'list', filters],
    queryFn: () => listAnomalies(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useAnomaly(anomalyId: number | null) {
  return useQuery<DataAnomaly>({
    queryKey: [...ANOMALIES_QUERY_KEY, 'detail', anomalyId],
    queryFn: () => getAnomaly(anomalyId!),
    enabled: anomalyId !== null,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useUpdateAnomalyStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      anomalyId,
      data,
    }: {
      anomalyId: number
      data: AnomalyStatusUpdate
    }) => updateAnomalyStatus(anomalyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANOMALIES_QUERY_KEY })
    },
  })
}

export function useUpdateAnomaly() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      anomalyId,
      data,
    }: {
      anomalyId: number
      data: AnomalyUpdate
    }) => updateAnomaly(anomalyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANOMALIES_QUERY_KEY })
    },
  })
}

export function useDeleteAnomaly() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      anomalyId,
      hardDelete = false,
    }: {
      anomalyId: number
      hardDelete?: boolean
    }) => deleteAnomaly(anomalyId, hardDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANOMALIES_QUERY_KEY })
    },
  })
}
