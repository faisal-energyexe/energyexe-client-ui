import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'
import type {
  WindfarmListItem,
  WindfarmWithOwners,
  TurbineUnit,
  GenerationUnit,
} from '@/types/windfarm'

const DEFAULT_PAGINATION_LIMIT = 50
const WINDFARMS_QUERY_KEY = ['windfarms']

export interface WindfarmsParams {
  skip?: number
  limit?: number
  country_id?: number
  bidzone_id?: number
  status?: string
  location_type?: string
}

export const useWindfarms = (params?: WindfarmsParams) => {
  return useQuery({
    queryKey: [...WINDFARMS_QUERY_KEY, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.skip !== undefined)
        searchParams.append('skip', params.skip.toString())
      if (params?.limit !== undefined)
        searchParams.append('limit', params.limit.toString())
      else searchParams.append('limit', DEFAULT_PAGINATION_LIMIT.toString())

      return await apiClient.get<Array<WindfarmListItem>>(
        `/windfarms?${searchParams.toString()}`,
      )
    },
  })
}

export const useSearchWindfarms = (
  query: string,
  params?: { skip?: number; limit?: number },
) => {
  return useQuery({
    queryKey: [...WINDFARMS_QUERY_KEY, 'search', query, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('q', query)
      if (params?.skip !== undefined)
        searchParams.append('skip', params.skip.toString())
      if (params?.limit !== undefined)
        searchParams.append('limit', params.limit.toString())

      return await apiClient.get<Array<WindfarmListItem>>(
        `/windfarms/search?${searchParams.toString()}`,
      )
    },
    enabled: !!query && query.length >= 1,
  })
}

export const useWindfarmWithOwners = (id: number | undefined) => {
  return useQuery({
    queryKey: [...WINDFARMS_QUERY_KEY, id, 'with-owners'],
    queryFn: async () => {
      return await apiClient.get<WindfarmWithOwners>(
        `/windfarms/${id}/with-owners`,
      )
    },
    enabled: !!id,
  })
}

export const useWindfarmTurbineUnits = (id: number | undefined) => {
  return useQuery({
    queryKey: [...WINDFARMS_QUERY_KEY, id, 'turbine-units'],
    queryFn: async () => {
      return await apiClient.get<Array<TurbineUnit>>(`/windfarms/${id}/turbine-units`)
    },
    enabled: !!id,
  })
}

export const useWindfarmGenerationUnits = (id: number | undefined) => {
  return useQuery({
    queryKey: [...WINDFARMS_QUERY_KEY, id, 'generation-units'],
    queryFn: async () => {
      return await apiClient.get<Array<GenerationUnit>>(
        `/windfarms/${id}/generation-units`,
      )
    },
    enabled: !!id,
  })
}

// Get all windfarms in a country (for map display)
export async function getWindfarmsByCountry(
  countryId: number,
): Promise<WindfarmListItem[]> {
  try {
    const response = await apiClient.get<WindfarmListItem[]>(
      `/windfarms?country_id=${countryId}&limit=500`,
    )
    return response.filter((wf) => wf.country_id === countryId)
  } catch (error) {
    console.error('Failed to fetch windfarms by country:', countryId, error)
    return []
  }
}

export function useWindfarmsByCountry(
  countryId: number | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ['windfarms', 'country', countryId],
    queryFn: async () => {
      if (!countryId) return []
      return getWindfarmsByCountry(countryId)
    },
    enabled: enabled && !!countryId,
    staleTime: 10 * 60 * 1000,
  })
}

// Get all windfarms in a bidzone (for peer comparison)
export async function getWindfarmsByBidzone(
  bidzoneId: number,
): Promise<WindfarmListItem[]> {
  try {
    const response = await apiClient.get<WindfarmListItem[]>(
      `/windfarms?bidzone_id=${bidzoneId}&limit=500`,
    )
    return response
  } catch (error) {
    console.error('Failed to fetch windfarms by bidzone:', bidzoneId, error)
    return []
  }
}

export function useWindfarmsInBidzone(
  bidzoneId: number | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ['windfarms', 'bidzone', bidzoneId],
    queryFn: async () => {
      if (!bidzoneId) return []
      return getWindfarmsByBidzone(bidzoneId)
    },
    enabled: enabled && !!bidzoneId,
    staleTime: 10 * 60 * 1000,
  })
}
