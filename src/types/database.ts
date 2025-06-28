export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          preferences: string[]
          is_public: boolean
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          preferences?: string[]
          is_public?: boolean
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          destination?: string
          start_date?: string
          end_date?: string
          preferences?: string[]
          is_public?: boolean
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attractions: {
        Row: {
          id: string
          name: string
          type: string
          description: string
          latitude: number
          longitude: number
          estimated_duration: number
          rating: number
          address: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          description: string
          latitude: number
          longitude: number
          estimated_duration?: number
          rating?: number
          address: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          description?: string
          latitude?: number
          longitude?: number
          estimated_duration?: number
          rating?: number
          address?: string
          image_url?: string | null
          created_at?: string
        }
      }
      day_plans: {
        Row: {
          id: string
          trip_id: string
          date: string
          estimated_travel_time: number
          total_duration: number
          day_order: number
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          date: string
          estimated_travel_time?: number
          total_duration?: number
          day_order: number
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          date?: string
          estimated_travel_time?: number
          total_duration?: number
          day_order?: number
          created_at?: string
        }
      }
      day_plan_attractions: {
        Row: {
          id: string
          day_plan_id: string
          attraction_id: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          day_plan_id: string
          attraction_id: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          day_plan_id?: string
          attraction_id?: string
          order_index?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}