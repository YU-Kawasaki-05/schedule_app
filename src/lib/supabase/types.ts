export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EventStatus = "open" | "closed" | "archived";
export type EventVisibility = "public_result" | "private_result";
export type AvailabilityStatus = "available" | "maybe" | "unavailable";

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          admin_note: string | null;
          allow_maybe: boolean;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          id: string;
          owner_user_id: string;
          public_slug: string;
          response_deadline_at: string | null;
          status: EventStatus;
          timezone: string;
          title: string;
          updated_at: string;
          visibility: EventVisibility;
        };
        Insert: {
          admin_note?: string | null;
          allow_maybe?: boolean;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          owner_user_id: string;
          public_slug: string;
          response_deadline_at?: string | null;
          status?: EventStatus;
          timezone?: string;
          title: string;
          updated_at?: string;
          visibility?: EventVisibility;
        };
        Update: {
          admin_note?: string | null;
          allow_maybe?: boolean;
          deleted_at?: string | null;
          description?: string | null;
          owner_user_id?: string;
          public_slug?: string;
          response_deadline_at?: string | null;
          status?: EventStatus;
          timezone?: string;
          title?: string;
          updated_at?: string;
          visibility?: EventVisibility;
        };
        Relationships: [];
      };
      event_slots: {
        Row: {
          created_at: string;
          ends_at: string;
          event_id: string;
          id: string;
          label: string | null;
          sort_order: number;
          starts_at: string;
        };
        Insert: {
          ends_at: string;
          event_id: string;
          id?: string;
          label?: string | null;
          sort_order: number;
          starts_at: string;
        };
        Update: {
          ends_at?: string;
          event_id?: string;
          label?: string | null;
          sort_order?: number;
          starts_at?: string;
        };
        Relationships: [];
      };
      respondents: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          display_name: string;
          edit_token_hash: string;
          event_id: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          deleted_at?: string | null;
          display_name: string;
          edit_token_hash: string;
          event_id: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          deleted_at?: string | null;
          display_name?: string;
          edit_token_hash?: string;
          event_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      availabilities: {
        Row: {
          created_at: string;
          id: string;
          respondent_id: string;
          slot_id: string;
          status: AvailabilityStatus;
          updated_at: string;
        };
        Insert: {
          id?: string;
          respondent_id: string;
          slot_id: string;
          status: AvailabilityStatus;
          updated_at?: string;
        };
        Update: {
          respondent_id?: string;
          slot_id?: string;
          status?: AvailabilityStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
