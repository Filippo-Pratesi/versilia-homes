export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blocked_dates: {
        Row: {
          date: string
          id: string
          property_id: string
          source: string | null
          synced_at: string | null
        }
        Insert: {
          date: string
          id?: string
          property_id: string
          source?: string | null
          synced_at?: string | null
        }
        Update: {
          date?: string
          id?: string
          property_id?: string
          source?: string | null
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_requests: {
        Row: {
          check_in: string
          check_out: string
          created_at: string | null
          estimated_price: number | null
          guest_email: string
          guest_name: string
          guest_phone: string | null
          guests_count: number
          id: string
          message: string | null
          property_id: string
          status: string | null
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string | null
          estimated_price?: number | null
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          guests_count?: number
          id?: string
          message?: string | null
          property_id: string
          status?: string | null
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string | null
          estimated_price?: number | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          guests_count?: number
          id?: string
          message?: string | null
          property_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          created_at: string | null
          date_from: string | null
          date_to: string | null
          id: string
          is_default: boolean | null
          label: string
          min_nights: number | null
          price_per_night: number
          property_id: string
        }
        Insert: {
          created_at?: string | null
          date_from?: string | null
          date_to?: string | null
          id?: string
          is_default?: boolean | null
          label: string
          min_nights?: number | null
          price_per_night: number
          property_id: string
        }
        Update: {
          created_at?: string | null
          date_from?: string | null
          date_to?: string | null
          id?: string
          is_default?: boolean | null
          label?: string
          min_nights?: number | null
          price_per_night?: number
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          airbnb_ical_url: string | null
          airbnb_listing_id: string | null
          airbnb_url: string | null
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          beds: number
          created_at: string | null
          description: string
          guests_max: number
          id: string
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          owner_id: string
          rating: number | null
          registration_code: string | null
          reviews_count: number | null
          slug: string
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          airbnb_ical_url?: string | null
          airbnb_listing_id?: string | null
          airbnb_url?: string | null
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          beds?: number
          created_at?: string | null
          description: string
          guests_max?: number
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          owner_id: string
          rating?: number | null
          registration_code?: string | null
          reviews_count?: number | null
          slug: string
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          airbnb_ical_url?: string | null
          airbnb_listing_id?: string | null
          airbnb_url?: string | null
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          beds?: number
          created_at?: string | null
          description?: string
          guests_max?: number
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          owner_id?: string
          rating?: number | null
          registration_code?: string | null
          reviews_count?: number | null
          slug?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      property_photos: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          is_cover: boolean | null
          property_id: string
          sort_order: number | null
          storage_path: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          is_cover?: boolean | null
          property_id: string
          sort_order?: number | null
          storage_path: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          is_cover?: boolean | null
          property_id?: string
          sort_order?: number | null
          storage_path?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: { Enums: {} },
} as const
