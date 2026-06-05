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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string
          canonical_url: string
          category: string
          category_id: string | null
          content: string
          cover_image: string
          created_at: string
          excerpt: string
          faqs: Json
          id: string
          meta_description: string
          meta_title: string
          og_description: string
          og_image: string
          og_title: string
          published_at: string | null
          reading_minutes: number
          slug: string
          status: string
          tags: Json
          title: string
          twitter_description: string
          twitter_image: string
          twitter_title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_name?: string
          canonical_url?: string
          category?: string
          category_id?: string | null
          content?: string
          cover_image?: string
          created_at?: string
          excerpt?: string
          faqs?: Json
          id?: string
          meta_description?: string
          meta_title?: string
          og_description?: string
          og_image?: string
          og_title?: string
          published_at?: string | null
          reading_minutes?: number
          slug: string
          status?: string
          tags?: Json
          title: string
          twitter_description?: string
          twitter_image?: string
          twitter_title?: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_name?: string
          canonical_url?: string
          category?: string
          category_id?: string | null
          content?: string
          cover_image?: string
          created_at?: string
          excerpt?: string
          faqs?: Json
          id?: string
          meta_description?: string
          meta_title?: string
          og_description?: string
          og_image?: string
          og_title?: string
          published_at?: string | null
          reading_minutes?: number
          slug?: string
          status?: string
          tags?: Json
          title?: string
          twitter_description?: string
          twitter_image?: string
          twitter_title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          approach: string
          challenge: string
          channels: Json
          client: string
          content: string
          cover_image: string
          created_at: string
          duration: string
          featured: boolean
          hero_stats: Json
          id: string
          industry: string
          meta_description: string
          meta_title: string
          og_image: string
          published_at: string | null
          results: string
          slug: string
          sort_order: number
          status: string
          summary: string
          tag: string
          testimonial_author: string
          testimonial_quote: string
          testimonial_role: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          approach?: string
          challenge?: string
          channels?: Json
          client?: string
          content?: string
          cover_image?: string
          created_at?: string
          duration?: string
          featured?: boolean
          hero_stats?: Json
          id?: string
          industry?: string
          meta_description?: string
          meta_title?: string
          og_image?: string
          published_at?: string | null
          results?: string
          slug: string
          sort_order?: number
          status?: string
          summary?: string
          tag?: string
          testimonial_author?: string
          testimonial_quote?: string
          testimonial_role?: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          approach?: string
          challenge?: string
          channels?: Json
          client?: string
          content?: string
          cover_image?: string
          created_at?: string
          duration?: string
          featured?: boolean
          hero_stats?: Json
          id?: string
          industry?: string
          meta_description?: string
          meta_title?: string
          og_image?: string
          published_at?: string | null
          results?: string
          slug?: string
          sort_order?: number
          status?: string
          summary?: string
          tag?: string
          testimonial_author?: string
          testimonial_quote?: string
          testimonial_role?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          budget: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          service: string
        }
        Insert: {
          budget: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          service: string
        }
        Update: {
          budget?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          service?: string
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          actor_email: string
          actor_user_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          target_email: string
          target_user_id: string
        }
        Insert: {
          action: string
          actor_email?: string
          actor_user_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          target_email?: string
          target_user_id: string
        }
        Update: {
          action?: string
          actor_email?: string
          actor_user_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          target_email?: string
          target_user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          ai_angle: string
          created_at: string
          deliverables: Json
          faqs: Json
          icon: string
          id: string
          intro: string
          process: Json
          short_desc: string
          slug: string
          sort_order: number
          tag: string
          tiers: Json
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          ai_angle?: string
          created_at?: string
          deliverables?: Json
          faqs?: Json
          icon?: string
          id?: string
          intro?: string
          process?: Json
          short_desc?: string
          slug: string
          sort_order?: number
          tag?: string
          tiers?: Json
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          ai_angle?: string
          created_at?: string
          deliverables?: Json
          faqs?: Json
          icon?: string
          id?: string
          intro?: string
          process?: Json
          short_desc?: string
          slug?: string
          sort_order?: number
          tag?: string
          tiers?: Json
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "editor"
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
    Enums: {
      app_role: ["admin", "user", "editor"],
    },
  },
} as const
