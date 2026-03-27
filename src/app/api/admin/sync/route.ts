import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncAirbnbCalendars } from "@/lib/sync-airbnb";

/**
 * POST /api/admin/sync
 *
 * Manual sync trigger for the admin panel.
 * Requires an authenticated Supabase session.
 */
export async function POST() {
  // Verify authenticated user
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Non autorizzato" },
      { status: 401 }
    );
  }

  try {
    console.log(`[admin/sync] Manual sync triggered by user ${user.id}`);
    const summary = await syncAirbnbCalendars();
    console.log(
      `[admin/sync] Completed: ${summary.succeeded}/${summary.total} succeeded`
    );

    return NextResponse.json({
      ok: true,
      ...summary,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[admin/sync] Fatal error: ${message}`);

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
