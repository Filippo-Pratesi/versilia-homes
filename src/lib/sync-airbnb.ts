import { createAdminClient } from "@/lib/supabase/admin";
import { parseICalBlockedDates } from "@/lib/ical-parser";

export type PropertySyncResult = {
  propertyId: string;
  title: string;
  success: boolean;
  blockedDatesCount?: number;
  error?: string;
};

export type SyncSummary = {
  total: number;
  succeeded: number;
  failed: number;
  results: PropertySyncResult[];
  syncedAt: string;
};

/**
 * Sync Airbnb iCal feeds for all properties that have an airbnb_ical_url set.
 *
 * For each property:
 * 1. Fetch the iCal URL
 * 2. Parse blocked dates
 * 3. Delete existing airbnb-sourced blocked dates
 * 4. Insert new blocked dates
 *
 * If one property fails, processing continues for the others.
 */
export async function syncAirbnbCalendars(): Promise<SyncSummary> {
  const admin = createAdminClient();
  const syncedAt = new Date().toISOString();

  // Fetch all properties with an Airbnb iCal URL
  const { data: properties, error: fetchError } = await admin
    .from("properties")
    .select("id, title, airbnb_ical_url")
    .not("airbnb_ical_url", "is", null);

  if (fetchError) {
    throw new Error(`Failed to fetch properties: ${fetchError.message}`);
  }

  if (!properties || properties.length === 0) {
    return {
      total: 0,
      succeeded: 0,
      failed: 0,
      results: [],
      syncedAt,
    };
  }

  const results: PropertySyncResult[] = [];

  for (const property of properties) {
    const result = await syncSingleProperty(
      admin,
      property.id,
      property.title,
      property.airbnb_ical_url!,
      syncedAt
    );
    results.push(result);
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    total: properties.length,
    succeeded,
    failed,
    results,
    syncedAt,
  };
}

async function syncSingleProperty(
  admin: ReturnType<typeof createAdminClient>,
  propertyId: string,
  title: string,
  icalUrl: string,
  syncedAt: string
): Promise<PropertySyncResult> {
  try {
    // 1. Fetch the iCal feed
    const response = await fetch(icalUrl, {
      headers: { "User-Agent": "VersiliaDirect/1.0 Calendar Sync" },
      // Timeout after 15 seconds
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching iCal for property "${title}"`);
    }

    const icalContent = await response.text();

    // 2. Parse blocked dates from iCal content
    const blockedDates = parseICalBlockedDates(icalContent);

    // 3. Delete all existing airbnb-sourced blocked dates for this property
    const { error: deleteError } = await admin
      .from("blocked_dates")
      .delete()
      .eq("property_id", propertyId)
      .eq("source", "airbnb");

    if (deleteError) {
      throw new Error(`Failed to delete old airbnb dates: ${deleteError.message}`);
    }

    // 4. Insert new blocked dates (skip conflicts — though we just deleted them)
    if (blockedDates.length > 0) {
      const rows = blockedDates.map((date) => ({
        property_id: propertyId,
        date,
        source: "airbnb",
        synced_at: syncedAt,
      }));

      const { error: insertError } = await admin
        .from("blocked_dates")
        .insert(rows);

      if (insertError) {
        throw new Error(`Failed to insert blocked dates: ${insertError.message}`);
      }
    }

    console.log(
      `[sync-airbnb] Property "${title}" (${propertyId}): synced ${blockedDates.length} blocked dates`
    );

    return {
      propertyId,
      title,
      success: true,
      blockedDatesCount: blockedDates.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sync-airbnb] Property "${title}" (${propertyId}) failed: ${message}`);

    return {
      propertyId,
      title,
      success: false,
      error: message,
    };
  }
}
