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
      agent_memory: {
        Row: {
          agent_name: string | null
          id: string
          memory_key: string | null
          memory_value: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          agent_name?: string | null
          id?: string
          memory_key?: string | null
          memory_value?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          agent_name?: string | null
          id?: string
          memory_key?: string | null
          memory_value?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agi_goals_enhanced: {
        Row: {
          goal_id: number
          goal_text: string | null
          priority: number | null
          progress_percentage: number | null
          status: string | null
          timestamp: string | null
        }
        Insert: {
          goal_id?: number
          goal_text?: string | null
          priority?: number | null
          progress_percentage?: number | null
          status?: string | null
          timestamp?: string | null
        }
        Update: {
          goal_id?: number
          goal_text?: string | null
          priority?: number | null
          progress_percentage?: number | null
          status?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      agi_state: {
        Row: {
          id: string
          key: string
          state: Json
          updated_at: string | null
        }
        Insert: {
          id?: string
          key: string
          state: Json
          updated_at?: string | null
        }
        Update: {
          id?: string
          key?: string
          state?: Json
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
      email_campaigns: {
        Row: {
          created_at: string
          emails_opened: number | null
          emails_sent: number | null
          id: string
          name: string
          replies_received: number | null
          status: string
          subject: string
          target_industry: string | null
          template: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          emails_opened?: number | null
          emails_sent?: number | null
          id?: string
          name: string
          replies_received?: number | null
          status?: string
          subject: string
          target_industry?: string | null
          template: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          emails_opened?: number | null
          emails_sent?: number | null
          id?: string
          name?: string
          replies_received?: number | null
          status?: string
          subject?: string
          target_industry?: string | null
          template?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          campaign_id: string | null
          content: string
          email: string
          id: string
          lead_id: string | null
          opened_at: string | null
          replied_at: string | null
          resend_email_id: string | null
          sent_at: string
          status: string
          subject: string
        }
        Insert: {
          campaign_id?: string | null
          content: string
          email: string
          id?: string
          lead_id?: string | null
          opened_at?: string | null
          replied_at?: string | null
          resend_email_id?: string | null
          sent_at?: string
          status?: string
          subject: string
        }
        Update: {
          campaign_id?: string | null
          content?: string
          email?: string
          id?: string
          lead_id?: string | null
          opened_at?: string | null
          replied_at?: string | null
          resend_email_id?: string | null
          sent_at?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          completed_at: string | null
          content: string
          created_at: string
          id: string
          lead_id: string | null
          scheduled_for: string | null
          type: string
        }
        Insert: {
          completed_at?: string | null
          content: string
          created_at?: string
          id?: string
          lead_id?: string | null
          scheduled_for?: string | null
          type: string
        }
        Update: {
          completed_at?: string | null
          content?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          scheduled_for?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          industry: string | null
          job_title: string | null
          last_name: string | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          industry?: string | null
          job_title?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          industry?: string | null
          job_title?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
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
      supervisor_queue: {
        Row: {
          action: string | null
          agent_name: string | null
          id: string
          input: string | null
          output: string | null
          status: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          agent_name?: string | null
          id?: string
          input?: string | null
          output?: string | null
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          agent_name?: string | null
          id?: string
          input?: string | null
          output?: string | null
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
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
    Enums: {},
  },
} as const
