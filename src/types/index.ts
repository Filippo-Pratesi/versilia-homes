import type { Database } from "@/lib/supabase/database.types";

export type Owner = Database["public"]["Tables"]["owners"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyPhoto =
  Database["public"]["Tables"]["property_photos"]["Row"];
export type BlockedDate =
  Database["public"]["Tables"]["blocked_dates"]["Row"];
export type PricingRule =
  Database["public"]["Tables"]["pricing_rules"]["Row"];
export type BookingRequest =
  Database["public"]["Tables"]["booking_requests"]["Row"];

export type PropertyWithPhotos = Property & {
  property_photos: PropertyPhoto[];
};

export type PropertyWithOwner = Property & {
  owners: Owner;
};

export type PropertyFull = Property & {
  property_photos: PropertyPhoto[];
  owners: Owner;
  pricing_rules: PricingRule[];
  blocked_dates: BlockedDate[];
};
