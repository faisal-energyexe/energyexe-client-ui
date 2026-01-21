/**
 * Reports API client for windfarm reports and LLM-generated commentary.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// Types
// ============================================================================

export interface PerformanceSummary {
  avg_capacity_factor: number
  avg_monthly_generation_gwh: number
  total_generation_gwh: number
  max_monthly_cf: number
  min_monthly_cf: number
  months_above_peer_average: number
  total_months: number
}

export interface RankingRow {
  windfarm_id: number
  windfarm_name: string
  avg_capacity_factor: number
  rank: number
}

export interface WindfarmRankings {
  bidzone_rank: number | null
  bidzone_total: number | null
  country_rank: number | null
  country_total: number | null
  owner_rank: number | null
  owner_total: number | null
  turbine_rank: number | null
  turbine_total: number | null
  bidzone_table: RankingRow[]
  country_table: RankingRow[]
  owner_table: RankingRow[]
  turbine_table: RankingRow[]
}

export interface PeerGroupInfo {
  type: string
  name: string
  windfarm_count: number
  avg_capacity_factor: number
}

export interface TimeseriesPoint {
  month: string
  target_cf: number
  peer_avg_cf: number
  peer_min_cf: number
  peer_max_cf: number
}

export interface PeerComparisonTimeseries {
  data: TimeseriesPoint[]
}

export interface BoxPlotData {
  windfarm_name: string
  windfarm_id: number
  min: number
  q1: number
  median: number
  q3: number
  max: number
  avg: number
}

export interface PeerComparisonData {
  peer_group_info: PeerGroupInfo
  timeseries: PeerComparisonTimeseries
  distribution: BoxPlotData[]
  heatmap_matrix: number[][]
  heatmap_windfarm_names: string[]
  heatmap_month_labels: string[]
  target_heatmap_index: number
}

export interface CommentarySection {
  section_type: string
  commentary_text: string
  generated_at: string
  word_count: number
}

export interface WindfarmReportData {
  windfarm_id: number
  windfarm_name: string
  windfarm_code: string
  date_range_start: string
  date_range_end: string
  country: {
    id: number
    name: string
    code: string
  }
  bidzone: {
    id: number
    name: string
    code: string
  } | null
  summary: PerformanceSummary
  rankings: WindfarmRankings
  peer_comparisons: Record<string, PeerComparisonData>
  highlights: string[]
  commentaries: Record<string, CommentarySection>
}

export type CommentarySectionType =
  | 'executive_summary'
  | 'wind_resource'
  | 'power_generation'
  | 'peer_comparison'
  | 'market_context'
  | 'ownership_history'
  | 'technology_assessment'
  | 'methodology'

export const COMMENTARY_SECTION_TYPES: CommentarySectionType[] = [
  'executive_summary',
  'wind_resource',
  'power_generation',
  'peer_comparison',
  'market_context',
  'ownership_history',
  'technology_assessment',
]

export const SECTION_DISPLAY_NAMES: Record<CommentarySectionType, string> = {
  executive_summary: 'Executive Summary',
  wind_resource: 'Wind Resource Analysis',
  power_generation: 'Power Generation',
  peer_comparison: 'Peer Comparison',
  market_context: 'Market Context',
  ownership_history: 'Ownership History',
  technology_assessment: 'Technology Assessment',
  methodology: 'Methodology',
}

export interface CommentaryResponse {
  id: number
  windfarm_id: number
  section_type: string
  commentary_text: string
  data_snapshot: Record<string, unknown>
  date_range_start: string
  date_range_end: string
  llm_provider: string
  llm_model: string
  prompt_template_version: string
  token_count_input: number
  token_count_output: number
  generation_cost_usd: number
  generation_duration_seconds: number
  status: 'draft' | 'approved' | 'published'
  version: number
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface CommentarySummary {
  id: number
  section_type: string
  status: string
  created_at: string
  word_count: number
  generation_cost_usd: number
}

export interface CommentaryGenerationRequest {
  section_type: CommentarySectionType
  start_date: string
  end_date: string
  regenerate?: boolean
  temperature?: number
  max_tokens?: number
}

export interface BulkCommentaryGenerationRequest {
  section_types: CommentarySectionType[]
  start_date: string
  end_date: string
  regenerate?: boolean
}

export interface BulkCommentaryGenerationResponse {
  windfarm_id: number
  total_sections: number
  successful: number
  failed: number
  total_cost_usd: number
  total_duration_seconds: number
  commentaries: CommentaryResponse[]
  errors?: Record<string, string>
}

export interface LLMUsageStats {
  total_commentaries: number
  total_cost_usd: number
  total_tokens_input: number
  total_tokens_output: number
  avg_cost_per_commentary: number
  cost_by_section_type: Record<string, number>
  commentaries_by_provider: Record<string, number>
}

// ============================================================================
// Query Keys
// ============================================================================

export const REPORTS_QUERY_KEY = ['reports']

// ============================================================================
// API Functions
// ============================================================================

export async function getReportData(
  windfarmId: number,
  startDate: string,
  endDate: string,
  options?: {
    includePeerGroups?: string[]
    generateCommentary?: boolean
    forceRegenerate?: boolean
  }
): Promise<WindfarmReportData> {
  const params = new URLSearchParams()
  params.append('start_date', startDate)
  params.append('end_date', endDate)

  if (options?.includePeerGroups?.length) {
    params.append('include_peer_groups', options.includePeerGroups.join(','))
  }
  if (options?.generateCommentary !== undefined) {
    params.append('generate_commentary', String(options.generateCommentary))
  }
  if (options?.forceRegenerate) {
    params.append('force_regenerate', 'true')
  }

  return apiClient.get<WindfarmReportData>(
    `/windfarms/${windfarmId}/report-data?${params.toString()}`
  )
}

export async function getPeerComparison(
  windfarmId: number,
  peerGroup: string,
  startDate: string,
  endDate: string
): Promise<PeerComparisonData> {
  return apiClient.post<PeerComparisonData>(
    `/windfarms/${windfarmId}/peer-comparison`,
    {
      peer_group: peerGroup,
      start_date: startDate,
      end_date: endDate,
    }
  )
}

export async function getRankings(
  windfarmId: number,
  startDate: string,
  endDate: string
): Promise<WindfarmRankings> {
  const params = new URLSearchParams()
  params.append('start_date', startDate)
  params.append('end_date', endDate)

  return apiClient.get<WindfarmRankings>(
    `/windfarms/${windfarmId}/rankings?${params.toString()}`
  )
}

export async function generateCommentary(
  windfarmId: number,
  request: CommentaryGenerationRequest
): Promise<CommentaryResponse> {
  return apiClient.post<CommentaryResponse>(
    `/report-commentary/windfarms/${windfarmId}/generate-commentary`,
    request
  )
}

export async function generateAllCommentary(
  windfarmId: number,
  request: BulkCommentaryGenerationRequest
): Promise<BulkCommentaryGenerationResponse> {
  return apiClient.post<BulkCommentaryGenerationResponse>(
    `/report-commentary/windfarms/${windfarmId}/generate-all-commentary`,
    request
  )
}

export async function getCommentary(
  windfarmId: number,
  sectionType: string,
  startDate: string,
  endDate: string
): Promise<CommentaryResponse> {
  const params = new URLSearchParams()
  params.append('start_date', startDate)
  params.append('end_date', endDate)

  return apiClient.get<CommentaryResponse>(
    `/report-commentary/windfarms/${windfarmId}/commentary/${sectionType}?${params.toString()}`
  )
}

export async function listCommentaries(
  windfarmId: number,
  currentOnly = true
): Promise<CommentarySummary[]> {
  return apiClient.get<CommentarySummary[]>(
    `/report-commentary/windfarms/${windfarmId}/commentaries?current_only=${currentOnly}`
  )
}

export async function updateCommentary(
  windfarmId: number,
  commentaryId: number,
  data: { commentary_text?: string; status?: 'draft' | 'approved' | 'published' }
): Promise<CommentaryResponse> {
  return apiClient.patch<CommentaryResponse>(
    `/report-commentary/windfarms/${windfarmId}/commentary/${commentaryId}`,
    data
  )
}

export async function deleteCommentary(
  windfarmId: number,
  commentaryId: number
): Promise<void> {
  await apiClient.delete(
    `/report-commentary/windfarms/${windfarmId}/commentary/${commentaryId}`
  )
}

export async function getUsageStats(
  startDate?: string,
  endDate?: string
): Promise<LLMUsageStats> {
  const params = new URLSearchParams()
  if (startDate) params.append('start_date', startDate)
  if (endDate) params.append('end_date', endDate)

  const query = params.toString()
  return apiClient.get<LLMUsageStats>(
    `/report-commentary/usage-stats${query ? `?${query}` : ''}`
  )
}

// ============================================================================
// React Query Hooks
// ============================================================================

export function useReportData(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
  options?: {
    includePeerGroups?: string[]
    generateCommentary?: boolean
    forceRegenerate?: boolean
  }
) {
  return useQuery<WindfarmReportData>({
    queryKey: [
      ...REPORTS_QUERY_KEY,
      'report-data',
      windfarmId,
      startDate,
      endDate,
      options?.includePeerGroups,
      options?.generateCommentary,
    ],
    queryFn: () => getReportData(windfarmId!, startDate!, endDate!, options),
    enabled: windfarmId !== null && !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000, // 10 minutes (matches backend cache)
  })
}

export function usePeerComparison(
  windfarmId: number | null,
  peerGroup: string | null,
  startDate: string | null,
  endDate: string | null
) {
  return useQuery<PeerComparisonData>({
    queryKey: [
      ...REPORTS_QUERY_KEY,
      'peer-comparison',
      windfarmId,
      peerGroup,
      startDate,
      endDate,
    ],
    queryFn: () => getPeerComparison(windfarmId!, peerGroup!, startDate!, endDate!),
    enabled: windfarmId !== null && !!peerGroup && !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000,
  })
}

export function useRankings(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null
) {
  return useQuery<WindfarmRankings>({
    queryKey: [...REPORTS_QUERY_KEY, 'rankings', windfarmId, startDate, endDate],
    queryFn: () => getRankings(windfarmId!, startDate!, endDate!),
    enabled: windfarmId !== null && !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCommentaries(windfarmId: number | null, currentOnly = true) {
  return useQuery<CommentarySummary[]>({
    queryKey: [...REPORTS_QUERY_KEY, 'commentaries', windfarmId, currentOnly],
    queryFn: () => listCommentaries(windfarmId!, currentOnly),
    enabled: windfarmId !== null,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGenerateCommentary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      windfarmId,
      request,
    }: {
      windfarmId: number
      request: CommentaryGenerationRequest
    }) => generateCommentary(windfarmId, request),
    onSuccess: (_, { windfarmId }) => {
      queryClient.invalidateQueries({
        queryKey: [...REPORTS_QUERY_KEY, 'commentaries', windfarmId],
      })
      queryClient.invalidateQueries({
        queryKey: [...REPORTS_QUERY_KEY, 'report-data', windfarmId],
      })
    },
  })
}

export function useGenerateAllCommentary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      windfarmId,
      request,
    }: {
      windfarmId: number
      request: BulkCommentaryGenerationRequest
    }) => generateAllCommentary(windfarmId, request),
    onSuccess: (_, { windfarmId }) => {
      queryClient.invalidateQueries({
        queryKey: [...REPORTS_QUERY_KEY, 'commentaries', windfarmId],
      })
      queryClient.invalidateQueries({
        queryKey: [...REPORTS_QUERY_KEY, 'report-data', windfarmId],
      })
    },
  })
}

export function useUpdateCommentary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      windfarmId,
      commentaryId,
      data,
    }: {
      windfarmId: number
      commentaryId: number
      data: { commentary_text?: string; status?: 'draft' | 'approved' | 'published' }
    }) => updateCommentary(windfarmId, commentaryId, data),
    onSuccess: (_, { windfarmId }) => {
      queryClient.invalidateQueries({
        queryKey: [...REPORTS_QUERY_KEY, 'commentaries', windfarmId],
      })
    },
  })
}

export function useDeleteCommentary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      windfarmId,
      commentaryId,
    }: {
      windfarmId: number
      commentaryId: number
    }) => deleteCommentary(windfarmId, commentaryId),
    onSuccess: (_, { windfarmId }) => {
      queryClient.invalidateQueries({
        queryKey: [...REPORTS_QUERY_KEY, 'commentaries', windfarmId],
      })
    },
  })
}

export function useUsageStats(startDate?: string, endDate?: string) {
  return useQuery<LLMUsageStats>({
    queryKey: [...REPORTS_QUERY_KEY, 'usage-stats', startDate, endDate],
    queryFn: () => getUsageStats(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  })
}
