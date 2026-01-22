import type { Country } from './country'

export interface CountrySummary {
  id: number
  code: string
  name: string
}

export interface OwnerSummary {
  id: number
  name: string
  ownership_percentage?: number | null
}

export interface Windfarm {
  id: number
  code: string
  name: string
  country_id: number
  state_id?: number | null
  region_id?: number | null
  bidzone_id?: number | null
  market_balance_area_id?: number | null
  control_area_id?: number | null
  nameplate_capacity_mw?: number | null
  project_id?: number | null
  substation_id?: number | null
  commercial_operational_date?: string | null
  first_power_date?: string | null
  lat?: number | null
  lng?: number | null
  polygon_wkt?: string | null
  foundation_type?: string | null
  location_type?: 'onshore' | 'offshore' | null
  status?: 'operational' | 'decommissioned' | 'under_installation' | 'repowered' | null
  notes?: string | null
  alternate_name?: string | null
  environmental_assessment_status?: string | null
  permits_obtained: boolean
  grid_connection_status?: string | null
  total_investment_amount?: number | null
  investment_currency?: string | null
  address?: string | null
  postal_code?: string | null
  roughness?: string | null
  created_at: string
  updated_at: string
  country?: Country
}

export interface WindfarmListItem extends Omit<Windfarm, 'country'> {
  country?: CountrySummary | null
  owners: Array<OwnerSummary>
}

export interface WindfarmOwnerDetails {
  id: number
  code: string
  name: string
  created_at: string
  updated_at: string
}

export interface WindfarmOwnerWithDetails {
  id: number
  windfarm_id: number
  owner_id: number
  ownership_percentage: string
  created_at: string
  updated_at: string
  owner: WindfarmOwnerDetails | null
}

export interface RelatedEntity {
  id: number
  code: string
  name: string
}

export interface WindfarmWithOwners extends Omit<Windfarm, 'country'> {
  country?: RelatedEntity | null
  state?: RelatedEntity | null
  region?: RelatedEntity | null
  bidzone?: RelatedEntity | null
  market_balance_area?: RelatedEntity | null
  control_area?: RelatedEntity | null
  project?: RelatedEntity | null
  windfarm_owners: Array<WindfarmOwnerWithDetails>
}

export interface TurbineModel {
  id: number
  model: string
  supplier: string
  original_supplier?: string
  rated_power_kw?: number | null
  rotor_diameter_m?: number | null
  cut_in_wind_speed_ms?: number | null
  cut_out_wind_speed_ms?: number | null
  rated_wind_speed_ms?: number | null
  blade_length_m?: number | null
  generator_type?: string | null
  created_at?: string
  updated_at?: string
}

export interface TurbineUnit {
  id: number
  code: string
  windfarm_id: number
  turbine_model_id: number
  status: string
  hub_height_m?: number | null
  lat?: number | null
  lng?: number | null
  start_date?: string | null
  end_date?: string | null
  created_at?: string
  updated_at?: string
  turbine_model?: TurbineModel | null
  windfarm?: WindfarmBasic | null
}

export interface WindfarmBasic {
  id: number
  code: string
  name: string
  nameplate_capacity_mw?: number | null
  status?: string | null
  lat?: number | null
  lng?: number | null
}

export interface TurbineUnitStats {
  total_count: number
  total_capacity_mw: number
  avg_hub_height_m: number | null
  windfarm_count: number
  status_breakdown: Record<string, number>
}

export interface GenerationUnit {
  id: number
  code: string
  name: string
  fuel_type?: string | null
  capacity_mw?: number | null
  source?: string | null
  is_active: boolean
}

export type WindfarmStatus = 'operational' | 'decommissioned' | 'under_installation' | 'repowered'
export type LocationType = 'onshore' | 'offshore'

export const WINDFARM_STATUS_OPTIONS: { value: WindfarmStatus; label: string }[] = [
  { value: 'operational', label: 'Operational' },
  { value: 'under_installation', label: 'Under Installation' },
  { value: 'decommissioned', label: 'Decommissioned' },
  { value: 'repowered', label: 'Repowered' },
]

export const LOCATION_TYPE_OPTIONS: { value: LocationType; label: string }[] = [
  { value: 'onshore', label: 'Onshore' },
  { value: 'offshore', label: 'Offshore' },
]
