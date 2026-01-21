export interface Country {
  id: number
  code: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface CountrySummary {
  id: number
  code: string
  name: string
}
