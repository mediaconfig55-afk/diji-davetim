export type RsvpStatus = "attending" | "not_attending" | "undecided";

export interface RsvpRecord {
  id: string;
  full_name: string;
  status: RsvpStatus;
  guest_count: number;
  note: string | null;
  created_at: string;
}

export interface GuestbookRecord {
  id: string;
  full_name: string;
  message: string;
  created_at: string;
}

export interface PhotoRecord {
  id: string;
  storage_path: string;
  uploader_name: string | null;
  created_at: string;
  url?: string;
}

export interface EventSettings {
  id: number;
  manual_reveal_override: boolean;
  updated_at: string;
}
