/**
 * Alerts API client for managing user alerts and notifications.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// Types
// ============================================================================

export type AlertMetric =
  | 'capacity_factor'
  | 'generation'
  | 'price'
  | 'capture_rate'
  | 'wind_speed'
  | 'data_quality'

export type AlertCondition = 'above' | 'below' | 'change_by_percent' | 'outside_range'

export type AlertScope = 'specific_windfarm' | 'portfolio' | 'all_windfarms'

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'

export type NotificationChannel = 'in_app' | 'email' | 'email_digest'

export type AlertTriggerStatus = 'active' | 'acknowledged' | 'resolved'

export type NotificationStatus = 'unread' | 'read' | 'archived'

export interface AlertRule {
  id: number
  user_id: number
  name: string
  description: string | null
  metric: AlertMetric
  condition: AlertCondition
  threshold_value: number
  threshold_value_upper: number | null
  scope: AlertScope
  windfarm_id: number | null
  portfolio_id: number | null
  severity: AlertSeverity
  channels: NotificationChannel[]
  sustained_minutes: number
  is_enabled: boolean
  created_at: string
  updated_at: string
  last_triggered_at: string | null
  trigger_count: number
  windfarm: { id: number; name: string } | null
  portfolio: { id: number; name: string } | null
}

export interface AlertRuleCreate {
  name: string
  description?: string
  metric: AlertMetric
  condition: AlertCondition
  threshold_value: number
  threshold_value_upper?: number
  scope?: AlertScope
  windfarm_id?: number
  portfolio_id?: number
  severity?: AlertSeverity
  channels?: NotificationChannel[]
  sustained_minutes?: number
  is_enabled?: boolean
}

export interface AlertRuleUpdate {
  name?: string
  description?: string
  metric?: AlertMetric
  condition?: AlertCondition
  threshold_value?: number
  threshold_value_upper?: number
  scope?: AlertScope
  windfarm_id?: number
  portfolio_id?: number
  severity?: AlertSeverity
  channels?: NotificationChannel[]
  sustained_minutes?: number
  is_enabled?: boolean
}

export interface AlertTrigger {
  id: number
  rule_id: number
  windfarm_id: number
  triggered_value: number
  threshold_value: number
  message: string
  status: AlertTriggerStatus
  triggered_at: string
  acknowledged_at: string | null
  resolved_at: string | null
  rule_name: string
  windfarm_name: string
  severity: AlertSeverity
}

export interface Notification {
  id: number
  user_id: number
  trigger_id: number | null
  title: string
  message: string
  severity: AlertSeverity
  notification_type: string
  entity_type: string | null
  entity_id: number | null
  channel: NotificationChannel
  status: NotificationStatus
  created_at: string
  read_at: string | null
}

export interface NotificationPreference {
  id: number
  user_id: number
  email_enabled: boolean
  email_digest_enabled: boolean
  in_app_enabled: boolean
  digest_frequency_hours: number
  last_digest_sent_at: string | null
  quiet_hours_enabled: boolean
  quiet_hours_start: number | null
  quiet_hours_end: number | null
  min_severity: AlertSeverity
  created_at: string
  updated_at: string
}

export interface NotificationPreferenceUpdate {
  email_enabled?: boolean
  email_digest_enabled?: boolean
  in_app_enabled?: boolean
  digest_frequency_hours?: number
  quiet_hours_enabled?: boolean
  quiet_hours_start?: number
  quiet_hours_end?: number
  min_severity?: AlertSeverity
}

export interface AlertsSummary {
  total_rules: number
  active_rules: number
  active_triggers: number
  acknowledged_triggers: number
  unread_notifications: number
  recent_triggers: AlertTrigger[]
}

export interface AlertsOverview {
  has_active_alerts: boolean
  active_count: number
  critical_count: number
  high_count: number
  unread_notifications: number
}

export interface AlertRuleListResponse {
  rules: AlertRule[]
  total: number
}

export interface AlertTriggerListResponse {
  triggers: AlertTrigger[]
  total: number
  active_count: number
  acknowledged_count: number
}

export interface NotificationListResponse {
  notifications: Notification[]
  total: number
  unread_count: number
}

// ============================================================================
// Query Keys
// ============================================================================

export const ALERTS_QUERY_KEY = ['alerts']

// ============================================================================
// Display Helpers
// ============================================================================

export const METRIC_DISPLAY_NAMES: Record<AlertMetric, string> = {
  capacity_factor: 'Capacity Factor',
  generation: 'Generation',
  price: 'Price',
  capture_rate: 'Capture Rate',
  wind_speed: 'Wind Speed',
  data_quality: 'Data Quality',
}

export const CONDITION_DISPLAY_NAMES: Record<AlertCondition, string> = {
  above: 'Above',
  below: 'Below',
  change_by_percent: 'Change by %',
  outside_range: 'Outside Range',
}

export const SCOPE_DISPLAY_NAMES: Record<AlertScope, string> = {
  specific_windfarm: 'Specific Wind Farm',
  portfolio: 'Portfolio',
  all_windfarms: 'All Wind Farms',
}

export const SEVERITY_DISPLAY_NAMES: Record<AlertSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const CHANNEL_DISPLAY_NAMES: Record<NotificationChannel, string> = {
  in_app: 'In-App',
  email: 'Email',
  email_digest: 'Email Digest',
}

// ============================================================================
// API Functions
// ============================================================================

// Alert Rules
export async function listAlertRules(
  isEnabled?: boolean
): Promise<AlertRuleListResponse> {
  const params = new URLSearchParams()
  if (isEnabled !== undefined) {
    params.append('is_enabled', String(isEnabled))
  }
  const query = params.toString()
  return apiClient.get<AlertRuleListResponse>(`/alerts/rules${query ? `?${query}` : ''}`)
}

export async function createAlertRule(data: AlertRuleCreate): Promise<AlertRule> {
  return apiClient.post<AlertRule>('/alerts/rules', data)
}

export async function getAlertRule(ruleId: number): Promise<AlertRule> {
  return apiClient.get<AlertRule>(`/alerts/rules/${ruleId}`)
}

export async function updateAlertRule(
  ruleId: number,
  data: AlertRuleUpdate
): Promise<AlertRule> {
  return apiClient.put<AlertRule>(`/alerts/rules/${ruleId}`, data)
}

export async function deleteAlertRule(ruleId: number): Promise<void> {
  await apiClient.delete(`/alerts/rules/${ruleId}`)
}

export async function toggleAlertRule(ruleId: number): Promise<AlertRule> {
  return apiClient.post<AlertRule>(`/alerts/rules/${ruleId}/toggle`)
}

// Alert Triggers
export async function listAlertTriggers(
  status?: AlertTriggerStatus,
  limit = 50,
  offset = 0
): Promise<AlertTriggerListResponse> {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  params.append('limit', String(limit))
  params.append('offset', String(offset))
  return apiClient.get<AlertTriggerListResponse>(`/alerts/triggers?${params.toString()}`)
}

export async function acknowledgeTrigger(triggerId: number): Promise<AlertTrigger> {
  return apiClient.post<AlertTrigger>(`/alerts/triggers/${triggerId}/acknowledge`)
}

export async function resolveTrigger(triggerId: number): Promise<AlertTrigger> {
  return apiClient.post<AlertTrigger>(`/alerts/triggers/${triggerId}/resolve`)
}

// Notifications
export async function listNotifications(
  status?: NotificationStatus,
  limit = 50,
  offset = 0
): Promise<NotificationListResponse> {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  params.append('limit', String(limit))
  params.append('offset', String(offset))
  return apiClient.get<NotificationListResponse>(`/alerts/notifications?${params.toString()}`)
}

export async function markNotificationsRead(
  notificationIds: number[]
): Promise<{ marked_read: number }> {
  return apiClient.post<{ marked_read: number }>('/alerts/notifications/mark-read', {
    notification_ids: notificationIds,
  })
}

export async function markAllNotificationsRead(): Promise<{ marked_read: number }> {
  return apiClient.post<{ marked_read: number }>('/alerts/notifications/mark-all-read')
}

export async function deleteNotification(notificationId: number): Promise<void> {
  await apiClient.delete(`/alerts/notifications/${notificationId}`)
}

export async function getUnreadCount(): Promise<{ unread_count: number }> {
  return apiClient.get<{ unread_count: number }>('/alerts/notifications/unread-count')
}

// Notification Preferences
export async function getNotificationPreferences(): Promise<NotificationPreference> {
  return apiClient.get<NotificationPreference>('/alerts/preferences')
}

export async function updateNotificationPreferences(
  data: NotificationPreferenceUpdate
): Promise<NotificationPreference> {
  return apiClient.put<NotificationPreference>('/alerts/preferences', data)
}

// Summary & Overview
export async function getAlertsSummary(): Promise<AlertsSummary> {
  return apiClient.get<AlertsSummary>('/alerts/summary')
}

export async function getAlertsOverview(): Promise<AlertsOverview> {
  return apiClient.get<AlertsOverview>('/alerts/overview')
}

// ============================================================================
// React Query Hooks
// ============================================================================

export function useAlertRules(isEnabled?: boolean) {
  return useQuery<AlertRuleListResponse>({
    queryKey: [...ALERTS_QUERY_KEY, 'rules', isEnabled],
    queryFn: () => listAlertRules(isEnabled),
    staleTime: 2 * 60 * 1000,
  })
}

export function useAlertRule(ruleId: number | null) {
  return useQuery<AlertRule>({
    queryKey: [...ALERTS_QUERY_KEY, 'rules', ruleId],
    queryFn: () => getAlertRule(ruleId!),
    enabled: ruleId !== null,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateAlertRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAlertRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'rules'] })
    },
  })
}

export function useUpdateAlertRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ruleId, data }: { ruleId: number; data: AlertRuleUpdate }) =>
      updateAlertRule(ruleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'rules'] })
    },
  })
}

export function useDeleteAlertRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAlertRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'rules'] })
    },
  })
}

export function useToggleAlertRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleAlertRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'rules'] })
    },
  })
}

export function useAlertTriggers(
  status?: AlertTriggerStatus,
  limit = 50,
  offset = 0
) {
  return useQuery<AlertTriggerListResponse>({
    queryKey: [...ALERTS_QUERY_KEY, 'triggers', status, limit, offset],
    queryFn: () => listAlertTriggers(status, limit, offset),
    staleTime: 1 * 60 * 1000,
  })
}

export function useAcknowledgeTrigger() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acknowledgeTrigger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'triggers'] })
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'summary'] })
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'overview'] })
    },
  })
}

export function useResolveTrigger() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resolveTrigger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'triggers'] })
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'summary'] })
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'overview'] })
    },
  })
}

export function useNotifications(
  status?: NotificationStatus,
  limit = 50,
  offset = 0
) {
  return useQuery<NotificationListResponse>({
    queryKey: [...ALERTS_QUERY_KEY, 'notifications', status, limit, offset],
    queryFn: () => listNotifications(status, limit, offset),
    staleTime: 30 * 1000,
  })
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ALERTS_QUERY_KEY, 'notifications'],
      })
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'unread'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ALERTS_QUERY_KEY, 'notifications'],
      })
      queryClient.invalidateQueries({ queryKey: [...ALERTS_QUERY_KEY, 'unread'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ALERTS_QUERY_KEY, 'notifications'],
      })
    },
  })
}

export function useUnreadCount() {
  return useQuery<{ unread_count: number }>({
    queryKey: [...ALERTS_QUERY_KEY, 'unread'],
    queryFn: getUnreadCount,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useNotificationPreferences() {
  return useQuery<NotificationPreference>({
    queryKey: [...ALERTS_QUERY_KEY, 'preferences'],
    queryFn: getNotificationPreferences,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ALERTS_QUERY_KEY, 'preferences'],
      })
    },
  })
}

export function useAlertsSummary() {
  return useQuery<AlertsSummary>({
    queryKey: [...ALERTS_QUERY_KEY, 'summary'],
    queryFn: getAlertsSummary,
    staleTime: 1 * 60 * 1000,
  })
}

export function useAlertsOverview() {
  return useQuery<AlertsOverview>({
    queryKey: [...ALERTS_QUERY_KEY, 'overview'],
    queryFn: getAlertsOverview,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}
