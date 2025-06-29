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
          username: string | null
          bio: string | null
          avatar_url: string | null
          location: string | null
          website: string | null
          verified: boolean
          followers_count: number
          following_count: number
          posts_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          website?: string | null
          verified?: boolean
          followers_count?: number
          following_count?: number
          posts_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          website?: string | null
          verified?: boolean
          followers_count?: number
          following_count?: number
          posts_count?: number
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
      social_posts: {
        Row: {
          id: string
          user_id: string
          trip_id: string | null
          caption: string
          photos: string[]
          likes_count: number
          comments_count: number
          shares_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trip_id?: string | null
          caption: string
          photos?: string[]
          likes_count?: number
          comments_count?: number
          shares_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trip_id?: string | null
          caption?: string
          photos?: string[]
          likes_count?: number
          comments_count?: number
          shares_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      saved_posts: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
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