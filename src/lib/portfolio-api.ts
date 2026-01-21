/**
 * Portfolio API client for managing user portfolios and favorites.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// Types
// ============================================================================

export type PortfolioType = 'watchlist' | 'owned' | 'competitor' | 'custom'

export interface Portfolio {
  id: number
  user_id: number
  name: string
  description: string | null
  portfolio_type: PortfolioType
  is_default: boolean
  created_at: string
  updated_at: string
  item_count: number
  total_capacity_mw: number
}

export interface WindfarmSummary {
  id: number
  name: string
  nameplate_capacity_mw: number | null
  country_name: string | null
}

export interface PortfolioItem {
  id: number
  portfolio_id: number
  windfarm_id: number
  added_at: string
  notes: string | null
  windfarm: WindfarmSummary
}

export interface PortfolioWithItems extends Portfolio {
  items: PortfolioItem[]
}

export interface PortfolioCreate {
  name: string
  description?: string | null
  portfolio_type: PortfolioType
}

export interface PortfolioUpdate {
  name?: string
  description?: string | null
  portfolio_type?: PortfolioType
}

export interface PortfolioItemCreate {
  windfarm_id: number
  notes?: string | null
}

export interface Favorite {
  id: number
  user_id: number
  windfarm_id: number
  added_at: string
  windfarm: WindfarmSummary
}

export interface FavoriteListResponse {
  favorites: Favorite[]
  total: number
}

// ============================================================================
// Query Keys
// ============================================================================

export const PORTFOLIO_QUERY_KEY = ['portfolios']
export const FAVORITES_QUERY_KEY = ['favorites']

// ============================================================================
// API Functions
// ============================================================================

// Portfolio CRUD
export async function listPortfolios(): Promise<Portfolio[]> {
  return apiClient.get<Portfolio[]>('/portfolios/')
}

export async function getPortfolio(portfolioId: number): Promise<PortfolioWithItems> {
  return apiClient.get<PortfolioWithItems>(`/portfolios/${portfolioId}`)
}

export async function createPortfolio(data: PortfolioCreate): Promise<Portfolio> {
  return apiClient.post<Portfolio>('/portfolios/', data)
}

export async function updatePortfolio(
  portfolioId: number,
  data: PortfolioUpdate
): Promise<Portfolio> {
  return apiClient.put<Portfolio>(`/portfolios/${portfolioId}`, data)
}

export async function deletePortfolio(portfolioId: number): Promise<void> {
  await apiClient.delete(`/portfolios/${portfolioId}`)
}

// Portfolio Items
export async function addItemToPortfolio(
  portfolioId: number,
  data: PortfolioItemCreate
): Promise<PortfolioItem> {
  return apiClient.post<PortfolioItem>(`/portfolios/${portfolioId}/items`, data)
}

export async function getPortfolioItems(portfolioId: number): Promise<PortfolioItem[]> {
  return apiClient.get<PortfolioItem[]>(`/portfolios/${portfolioId}/items`)
}

export async function removeItemFromPortfolio(
  portfolioId: number,
  windfarmId: number
): Promise<void> {
  await apiClient.delete(`/portfolios/${portfolioId}/items/${windfarmId}`)
}

// Favorites
export async function listFavorites(): Promise<FavoriteListResponse> {
  return apiClient.get<FavoriteListResponse>('/portfolios/favorites/list')
}

export async function addFavorite(windfarmId: number): Promise<Favorite> {
  return apiClient.post<Favorite>('/portfolios/favorites', { windfarm_id: windfarmId })
}

export async function removeFavorite(windfarmId: number): Promise<void> {
  await apiClient.delete(`/portfolios/favorites/${windfarmId}`)
}

export async function checkFavorite(windfarmId: number): Promise<{ is_favorite: boolean }> {
  return apiClient.get<{ is_favorite: boolean }>(`/portfolios/favorites/check/${windfarmId}`)
}

export async function checkMultipleFavorites(
  windfarmIds: number[]
): Promise<{ favorited_ids: number[] }> {
  return apiClient.post<{ favorited_ids: number[] }>('/portfolios/favorites/check-multiple', windfarmIds)
}

// ============================================================================
// React Query Hooks
// ============================================================================

// Portfolio Hooks
export function usePortfolios() {
  return useQuery<Portfolio[]>({
    queryKey: PORTFOLIO_QUERY_KEY,
    queryFn: listPortfolios,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePortfolio(portfolioId: number | null) {
  return useQuery<PortfolioWithItems>({
    queryKey: [...PORTFOLIO_QUERY_KEY, portfolioId],
    queryFn: () => getPortfolio(portfolioId!),
    enabled: portfolioId !== null,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY })
    },
  })
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ portfolioId, data }: { portfolioId: number; data: PortfolioUpdate }) =>
      updatePortfolio(portfolioId, data),
    onSuccess: (_, { portfolioId }) => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...PORTFOLIO_QUERY_KEY, portfolioId] })
    },
  })
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY })
    },
  })
}

// Portfolio Item Hooks
export function usePortfolioItems(portfolioId: number | null) {
  return useQuery<PortfolioItem[]>({
    queryKey: [...PORTFOLIO_QUERY_KEY, portfolioId, 'items'],
    queryFn: () => getPortfolioItems(portfolioId!),
    enabled: portfolioId !== null,
    staleTime: 2 * 60 * 1000,
  })
}

export function useAddItemToPortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      portfolioId,
      data,
    }: {
      portfolioId: number
      data: PortfolioItemCreate
    }) => addItemToPortfolio(portfolioId, data),
    onSuccess: (_, { portfolioId }) => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...PORTFOLIO_QUERY_KEY, portfolioId] })
    },
  })
}

export function useRemoveItemFromPortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ portfolioId, windfarmId }: { portfolioId: number; windfarmId: number }) =>
      removeItemFromPortfolio(portfolioId, windfarmId),
    onSuccess: (_, { portfolioId }) => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...PORTFOLIO_QUERY_KEY, portfolioId] })
    },
  })
}

// Favorite Hooks
export function useFavorites() {
  return useQuery<FavoriteListResponse>({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: listFavorites,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCheckFavorite(windfarmId: number | null) {
  return useQuery<{ is_favorite: boolean }>({
    queryKey: [...FAVORITES_QUERY_KEY, 'check', windfarmId],
    queryFn: () => checkFavorite(windfarmId!),
    enabled: windfarmId !== null,
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useCheckMultipleFavorites(windfarmIds: number[]) {
  return useQuery<{ favorited_ids: number[] }>({
    queryKey: [...FAVORITES_QUERY_KEY, 'check-multiple', windfarmIds],
    queryFn: () => checkMultipleFavorites(windfarmIds),
    enabled: windfarmIds.length > 0,
    staleTime: 60 * 1000,
  })
}

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY })
    },
  })
}

// Toggle favorite (convenience hook)
export function useToggleFavorite() {
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()

  return {
    toggle: async (windfarmId: number, isFavorite: boolean) => {
      if (isFavorite) {
        await removeFavorite.mutateAsync(windfarmId)
      } else {
        await addFavorite.mutateAsync(windfarmId)
      }
    },
    isLoading: addFavorite.isPending || removeFavorite.isPending,
  }
}
