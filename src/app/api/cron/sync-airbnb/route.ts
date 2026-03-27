import { NextRequest, NextResponse } from "next/server";
import { syncAirbnbCalendars } from "@/lib/sync-airbnb";

/**
 * GET /api/cron/sync-airbnb
 *
 * Vercel Cron Job endpoint — scheduled daily at 02:00 UTC via vercel.json.
 * Protected by Authorization: Bearer {CRON_SECRET} header.
 * In development (CRON_SECRET not set), auth check is skipped.
 */
export async function GET(request: NextRequest) {
  // Auth check
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    const expectedHeader = `Bearer ${cronSecret}`;
    if (authHeader !== expectedHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    console.log("[cron/sync-airbnb] Starting Airbnb calendar sync");
    const summary = await syncAirbnbCalendars();
    console.log(
      `[cron/sync-airbnb] Completed: ${summary.succeeded}/${summary.total} succeeded`
    );

    return NextResponse.json({
      ok: true,
      ...summary,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[cron/sync-airbnb] Fatal error: ${message}`);

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
