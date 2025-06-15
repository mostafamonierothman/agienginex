export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_registry: {
        Row: {
          agent_name: string
          agent_type: string
          created_at: string | null
          id: string
          last_started_at: string | null
          last_stopped_at: string | null
          performance_score: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_name: string
          agent_type: string
          created_at?: string | null
          id?: string
          last_started_at?: string | null
          last_stopped_at?: string | null
          performance_score?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          agent_name?: string
          agent_type?: string
          created_at?: string | null
          id?: string
          last_started_at?: string | null
          last_stopped_at?: string | null
          performance_score?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_versions: {
        Row: {
          agent_id: string | null
          code: string
          commit_message: string | null
          created_at: string | null
          file_path: string
          id: string
          version_number: number
        }
        Insert: {
          agent_id?: string | null
          code: string
          commit_message?: string | null
          created_at?: string | null
          file_path: string
          id?: string
          version_number: number
        }
        Update: {
          agent_id?: string | null
          code?: string
          commit_message?: string | null
          created_at?: string | null
          file_path?: string
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      agi_goals: {
        Row: {
          created_at: string | null
          goal_text: string | null
          id: number
          priority: number | null
          progress_percentage: number | null
          status: Database["public"]["Enums"]["goal_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          goal_text?: string | null
          id?: number
          priority?: number | null
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["goal_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          goal_text?: string | null
          id?: number
          priority?: number | null
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["goal_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      cv_files: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          updated_at: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          updated_at?: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      imported_conversations: {
        Row: {
          code_snippet: string | null
          content: string | null
          conversation_id: string | null
          conversation_title: string | null
          created_at: string | null
          id: string
          imported_at: string | null
          message_index: number | null
          project_tag: string | null
          raw_json: Json | null
          role: string | null
          topic: string | null
          user_id: string | null
        }
        Insert: {
          code_snippet?: string | null
          content?: string | null
          conversation_id?: string | null
          conversation_title?: string | null
          created_at?: string | null
          id?: string
          imported_at?: string | null
          message_index?: number | null
          project_tag?: string | null
          raw_json?: Json | null
          role?: string | null
          topic?: string | null
          user_id?: string | null
        }
        Update: {
          code_snippet?: string | null
          content?: string | null
          conversation_id?: string | null
          conversation_title?: string | null
          created_at?: string | null
          id?: string
          imported_at?: string | null
          message_index?: number | null
          project_tag?: string | null
          raw_json?: Json | null
          role?: string | null
          topic?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
      vector_memories: {
        Row: {
          agent_id: string
          content: string
          created_at: string | null
          embedding: Json
          id: string
          importance: number | null
          source: string | null
          tags: string[] | null
        }
        Insert: {
          agent_id: string
          content: string
          created_at?: string | null
          embedding: Json
          id?: string
          importance?: number | null
          source?: string | null
          tags?: string[] | null
        }
        Update: {
          agent_id?: string
          content?: string
          created_at?: string | null
          embedding?: Json
          id?: string
          importance?: number | null
          source?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      website_visits: {
        Row: {
          browser: string | null
          city: string | null
          country_code: string | null
          created_at: string
          device_type: string | null
          id: string
          os: string | null
          page_url: string
          referrer: string | null
          timestamp: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          os?: string | null
          page_url: string
          referrer?: string | null
          timestamp?: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          os?: string | null
          page_url?: string
          referrer?: string | null
          timestamp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_phase2_agi_health: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      campaign_status: "draft" | "active" | "paused" | "completed"
      email_status:
        | "sent"
        | "delivered"
        | "opened"
        | "replied"
        | "bounced"
        | "failed"
      follow_up_type: "email" | "call" | "meeting" | "note"
      goal_status: "active" | "completed"
      lead_status:
        | "new"
        | "contacted"
        | "replied"
        | "qualified"
        | "converted"
        | "unsubscribed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      campaign_status: ["draft", "active", "paused", "completed"],
      email_status: [
        "sent",
        "delivered",
        "opened",
        "replied",
        "bounced",
        "failed",
      ],
      follow_up_type: ["email", "call", "meeting", "note"],
      goal_status: ["active", "completed"],
      lead_status: [
        "new",
        "contacted",
        "replied",
        "qualified",
        "converted",
        "unsubscribed",
      ],
    },
  },
} as const
