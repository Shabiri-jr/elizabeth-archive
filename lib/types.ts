export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "admin" | "elizabeth";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type MediaAssetType = "image" | "audio" | "video";
export type GalleryMode = "polaroid" | "film-strip" | "timeline" | "floating";
export type FavouriteItemType = "submission" | "memory" | "future_wish" | "media" | "open_when_letter";
export type AdminMetricKey =
  | "totalSubmissions"
  | "pendingSubmissions"
  | "approvedSubmissions"
  | "rejectedSubmissions"
  | "totalMediaFiles"
  | "pendingMediaFiles"
  | "totalContributorLinks"
  | "usedContributorLinks"
  | "archiveLive"
  | "contributionsOpen";

export type AdminDashboardStats = Record<AdminMetricKey, string>;

export type ContributorTokenStatus =
  | "valid"
  | "invalid"
  | "expired"
  | "closed"
  | "used"
  | "unconfigured"
  | "error";

export type SafeContributor = {
  id?: string;
  token: string;
  name: string | null;
  relationship: string | null;
  expiresAt: string | null;
  maxSubmissions?: number;
  usedSubmissions?: number;
  remainingSubmissions?: number;
};

export type ContributorTokenResult = {
  status: ContributorTokenStatus;
  contributor: SafeContributor | null;
  message: string;
};

export type ArchiveAccessStatus =
  | "allowed"
  | "admin-preview"
  | "locked"
  | "not-live"
  | "unconfigured"
  | "error";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          role: ProfileRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          role: ProfileRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          display_name?: string | null;
          role?: ProfileRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      contributors: {
        Row: {
          id: string;
          token: string;
          name: string | null;
          relationship: string | null;
          email: string | null;
          is_used: boolean;
          max_submissions: number;
          created_by: string | null;
          created_at: string;
          expires_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          token: string;
          name?: string | null;
          relationship?: string | null;
          email?: string | null;
          is_used?: boolean;
          max_submissions?: number;
          created_by?: string | null;
          created_at?: string;
          expires_at?: string | null;
          notes?: string | null;
        };
        Update: {
          token?: string;
          name?: string | null;
          relationship?: string | null;
          email?: string | null;
          is_used?: boolean;
          max_submissions?: number;
          created_by?: string | null;
          expires_at?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      birthday_submissions: {
        Row: {
          id: string;
          contributor_id: string | null;
          name: string;
          relationship: string;
          birthday_message: string;
          memory: string | null;
          one_word: string | null;
          future_wish: string | null;
          permission_given: boolean;
          status: SubmissionStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contributor_id?: string | null;
          name: string;
          relationship: string;
          birthday_message: string;
          memory?: string | null;
          one_word?: string | null;
          future_wish?: string | null;
          permission_given?: boolean;
          status?: SubmissionStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          contributor_id?: string | null;
          name?: string;
          relationship?: string;
          birthday_message?: string;
          memory?: string | null;
          one_word?: string | null;
          future_wish?: string | null;
          permission_given?: boolean;
          status?: SubmissionStatus;
          admin_notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          submission_id: string | null;
          contributor_id: string | null;
          type: MediaAssetType;
          bucket: string;
          storage_path: string;
          public_url: string | null;
          caption: string | null;
          status: SubmissionStatus;
          gallery_mode: GalleryMode | null;
          display_order: number | null;
          featured: boolean;
          memory_date: string | null;
          emotion_tag: string | null;
          admin_caption: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          submission_id?: string | null;
          contributor_id?: string | null;
          type: MediaAssetType;
          bucket: string;
          storage_path: string;
          public_url?: string | null;
          caption?: string | null;
          status?: SubmissionStatus;
          gallery_mode?: GalleryMode | null;
          display_order?: number | null;
          featured?: boolean;
          memory_date?: string | null;
          emotion_tag?: string | null;
          admin_caption?: string | null;
          created_at?: string;
        };
        Update: {
          submission_id?: string | null;
          contributor_id?: string | null;
          type?: MediaAssetType;
          bucket?: string;
          storage_path?: string;
          public_url?: string | null;
          caption?: string | null;
          status?: SubmissionStatus;
          gallery_mode?: GalleryMode | null;
          display_order?: number | null;
          featured?: boolean;
          memory_date?: string | null;
          emotion_tag?: string | null;
          admin_caption?: string | null;
        };
        Relationships: [];
      };
      archive_chapters: {
        Row: {
          id: string;
          chapter_number: number;
          slug: string;
          title: string;
          subtitle: string | null;
          body: string | null;
          sort_order: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_number: number;
          slug: string;
          title: string;
          subtitle?: string | null;
          body?: string | null;
          sort_order: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          chapter_number?: number;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          body?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      archive_settings: {
        Row: {
          id: string;
          birthday_date: string;
          archive_live: boolean;
          contributions_open: boolean;
          elizabeth_access_enabled: boolean;
          reveal_mode_enabled: boolean;
          music_prompt_enabled: boolean;
          maintenance_mode: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          birthday_date?: string;
          archive_live?: boolean;
          contributions_open?: boolean;
          elizabeth_access_enabled?: boolean;
          reveal_mode_enabled?: boolean;
          music_prompt_enabled?: boolean;
          maintenance_mode?: boolean;
          updated_at?: string;
        };
        Update: {
          birthday_date?: string;
          archive_live?: boolean;
          contributions_open?: boolean;
          elizabeth_access_enabled?: boolean;
          reveal_mode_enabled?: boolean;
          music_prompt_enabled?: boolean;
          maintenance_mode?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      music_tracks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          bucket: string;
          storage_path: string;
          public_url: string | null;
          is_active: boolean;
          default_volume: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          bucket: string;
          storage_path: string;
          public_url?: string | null;
          is_active?: boolean;
          default_volume?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          bucket?: string;
          storage_path?: string;
          public_url?: string | null;
          is_active?: boolean;
          default_volume?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      open_when_letters: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          body: string;
          mood: string | null;
          sort_order: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          body: string;
          mood?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          subtitle?: string | null;
          body?: string;
          mood?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      elizabeth_favourites: {
        Row: {
          id: string;
          item_type: FavouriteItemType;
          item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_type: FavouriteItemType;
          item_id: string;
          created_at?: string;
        };
        Update: {
          item_type?: FavouriteItemType;
          item_id?: string;
        };
        Relationships: [];
      };
      admin_activity_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          target_table?: string | null;
          target_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          action?: string;
          target_table?: string | null;
          target_id?: string | null;
          metadata?: Json | null;
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
