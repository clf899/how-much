import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          name: string
          category: string
          icon: string
          description: string
          national_average: number
          price_range_min: number
          price_range_max: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          icon: string
          description: string
          national_average: number
          price_range_min: number
          price_range_max: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          icon?: string
          description?: string
          national_average?: number
          price_range_min?: number
          price_range_max?: number
          created_at?: string
        }
      }
      price_submissions: {
        Row: {
          id: string
          service_id: string
          price: number
          location_zip: string | null
          location_city: string | null
          location_state: string | null
          location_region: string | null
          description: string | null
          service_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          price: number
          location_zip?: string | null
          location_city?: string | null
          location_state?: string | null
          location_region?: string | null
          description?: string | null
          service_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          price?: number
          location_zip?: string | null
          location_city?: string | null
          location_state?: string | null
          location_region?: string | null
          description?: string | null
          service_date?: string | null
          created_at?: string
        }
      }
    }
  }
} 