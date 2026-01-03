/**
 * Supabase Database Types
 *
 * ⚠️ This file is GENERATED - DO NOT EDIT MANUALLY
 *
 * To regenerate these types from your Supabase schema:
 *   npm run db:generate-types
 *
 * Required environment variables:
 *   SUPABASE_ACCESS_TOKEN - Get from https://app.supabase.com/account/tokens
 *   SUPABASE_PROJECT_ID - Your Supabase project ID (optional, defaults to xabpmvuubgfjuroenxuq)
 *
 * This file will be overwritten when you run the generation script.
 * Make any schema changes in Supabase, then regenerate this file.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      ai_evaluations: {
        Row: {
          confidenceScore: number
          estimatedMarketValue: number
          evaluatedAt: string
          factors: string[] | null
          id: string
          listingId: string
          modelVersion: string
          promptVersion: string
          reasoning: string
          undervaluationPercentage: number
        }
        Insert: {
          confidenceScore: number
          estimatedMarketValue: number
          evaluatedAt?: string
          factors?: string[] | null
          id: string
          listingId: string
          modelVersion: string
          promptVersion: string
          reasoning: string
          undervaluationPercentage: number
        }
        Update: {
          confidenceScore?: number
          estimatedMarketValue?: number
          evaluatedAt?: string
          factors?: string[] | null
          id?: string
          listingId?: string
          modelVersion?: string
          promptVersion?: string
          reasoning?: string
          undervaluationPercentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_evaluations_listingId_fkey"
            columns: ["listingId"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          available: boolean
          category: string | null
          condition: string | null
          createdAt: string
          currency: string
          description: string | null
          id: string
          images: string[] | null
          lastChecked: string
          listingUrl: string
          marketplace: string
          marketplaceId: string
          price: number
          sellerName: string | null
          sellerRating: number | null
          title: string
          updatedAt: string
        }
        Insert: {
          available?: boolean
          category?: string | null
          condition?: string | null
          createdAt?: string
          currency?: string
          description?: string | null
          id: string
          images?: string[] | null
          lastChecked?: string
          listingUrl: string
          marketplace: string
          marketplaceId: string
          price: number
          sellerName?: string | null
          sellerRating?: number | null
          title: string
          updatedAt: string
        }
        Update: {
          available?: boolean
          category?: string | null
          condition?: string | null
          createdAt?: string
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          lastChecked?: string
          listingUrl?: string
          marketplace?: string
          marketplaceId?: string
          price?: number
          sellerName?: string | null
          sellerRating?: number | null
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          createdAt: string
          id: string
          message: string
          read: boolean
          readAt: string | null
          title: string
          type: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          message: string
          read?: boolean
          readAt?: string | null
          title: string
          type: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          message?: string
          read?: boolean
          readAt?: string | null
          title?: string
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          createdAt: string
          dismissedAt: string | null
          id: string
          listingId: string
          priority: number
          purchasedAt: string | null
          status: string
          updatedAt: string
          userId: string
          viewedAt: string | null
        }
        Insert: {
          createdAt?: string
          dismissedAt?: string | null
          id: string
          listingId: string
          priority?: number
          purchasedAt?: string | null
          status?: string
          updatedAt: string
          userId: string
          viewedAt?: string | null
        }
        Update: {
          createdAt?: string
          dismissedAt?: string | null
          id?: string
          listingId?: string
          priority?: number
          purchasedAt?: string | null
          status?: string
          updatedAt?: string
          userId?: string
          viewedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_listingId_fkey"
            columns: ["listingId"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      search_preferences: {
        Row: {
          categories: string[] | null
          createdAt: string
          id: string
          isActive: boolean
          keywords: string[] | null
          marketplaces: string[] | null
          maxPrice: number | null
          minPrice: number | null
          name: string
          updatedAt: string
          userId: string
        }
        Insert: {
          categories?: string[] | null
          createdAt?: string
          id: string
          isActive?: boolean
          keywords?: string[] | null
          marketplaces?: string[] | null
          maxPrice?: number | null
          minPrice?: number | null
          name: string
          updatedAt: string
          userId: string
        }
        Update: {
          categories?: string[] | null
          createdAt?: string
          id?: string
          isActive?: boolean
          keywords?: string[] | null
          marketplaces?: string[] | null
          maxPrice?: number | null
          minPrice?: number | null
          name?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_preferences_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          name?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string | null
          updatedAt?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
