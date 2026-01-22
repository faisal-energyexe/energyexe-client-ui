import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'
import type { TurbineUnit, TurbineUnitStats, TurbineModel } from '@/types/windfarm'

const DEFAULT_PAGINATION_LIMIT = 100
const TURBINE_UNITS_QUERY_KEY = ['turbine-units']
const TURBINE_MODELS_QUERY_KEY = ['turbine-models']

export interface TurbineUnitsParams {
  skip?: number
  limit?: number
  windfarm_id?: number
  model_id?: number
  status?: string
  search?: string
}

export const useTurbineUnits = (params?: TurbineUnitsParams) => {
  return useQuery({
    queryKey: [...TURBINE_UNITS_QUERY_KEY, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.skip !== undefined)
        searchParams.append('skip', params.skip.toString())
      if (params?.limit !== undefined)
        searchParams.append('limit', params.limit.toString())
      else searchParams.append('limit', DEFAULT_PAGINATION_LIMIT.toString())
      if (params?.windfarm_id !== undefined)
        searchParams.append('windfarm_id', params.windfarm_id.toString())
      if (params?.model_id !== undefined)
        searchParams.append('model_id', params.model_id.toString())
      if (params?.status) searchParams.append('status', params.status)
      if (params?.search) searchParams.append('search', params.search)

      return await apiClient.get<Array<TurbineUnit>>(
        `/turbine-units?${searchParams.toString()}`,
      )
    },
  })
}

export interface TurbineStatsParams {
  windfarm_id?: number
  model_id?: number
  status?: string
}

export const useTurbineUnitsStats = (params?: TurbineStatsParams) => {
  return useQuery({
    queryKey: [...TURBINE_UNITS_QUERY_KEY, 'stats', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.windfarm_id !== undefined)
        searchParams.append('windfarm_id', params.windfarm_id.toString())
      if (params?.model_id !== undefined)
        searchParams.append('model_id', params.model_id.toString())
      if (params?.status) searchParams.append('status', params.status)

      return await apiClient.get<TurbineUnitStats>(
        `/turbine-units/stats?${searchParams.toString()}`,
      )
    },
  })
}

export const useTurbineModels = (params?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...TURBINE_MODELS_QUERY_KEY, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.skip !== undefined)
        searchParams.append('skip', params.skip.toString())
      if (params?.limit !== undefined)
        searchParams.append('limit', params.limit.toString())
      else searchParams.append('limit', '500') // Get all models for filter dropdown

      return await apiClient.get<Array<TurbineModel>>(
        `/turbine-models?${searchParams.toString()}`,
      )
    },
  })
}

export const useTurbineUnit = (id: number | undefined) => {
  return useQuery({
    queryKey: [...TURBINE_UNITS_QUERY_KEY, id],
    queryFn: async () => {
      return await apiClient.get<TurbineUnit>(`/turbine-units/${id}`)
    },
    enabled: !!id,
  })
}
