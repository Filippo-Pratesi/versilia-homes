import ICAL from "ical.js";

/**
 * Parse iCal content and return an array of blocked date strings (YYYY-MM-DD).
 *
 * - Processes VEVENT entries with DTSTART/DTEND
 * - Expands date ranges from DTSTART (inclusive) to DTEND (exclusive — checkout day is available)
 * - Returns only future dates (>= today)
 * - Returns unique dates sorted ascending
 */
export function parseICalBlockedDates(icalContent: string): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);

  let parsed: ICAL.Component;
  try {
    parsed = new ICAL.Component(ICAL.parse(icalContent));
  } catch (err) {
    throw new Error(`Failed to parse iCal content: ${(err as Error).message}`);
  }

  const vevents = parsed.getAllSubcomponents("vevent");
  const blockedSet = new Set<string>();

  for (const vevent of vevents) {
    try {
      const dtstart = vevent.getFirstPropertyValue("dtstart") as ICAL.Time | null;
      const dtend = vevent.getFirstPropertyValue("dtend") as ICAL.Time | null;

      if (!dtstart) continue;

      const startDate = icalTimeToDate(dtstart);
      // If no DTEND, treat as single-day event
      const endDate = dtend ? icalTimeToDate(dtend) : addDays(startDate, 1);

      // Expand range: [startDate, endDate) — endDate (checkout day) is NOT blocked
      const current = new Date(startDate);
      while (current < endDate) {
        const dateStr = formatDate(current);
        // Only include future dates (>= today)
        if (dateStr >= todayStr) {
          blockedSet.add(dateStr);
        }
        current.setDate(current.getDate() + 1);
      }
    } catch {
      // Skip malformed events — continue processing the rest
      continue;
    }
  }

  return Array.from(blockedSet).sort();
}

function icalTimeToDate(icalTime: ICAL.Time): Date {
  // ICAL.Time can be DATE (no time) or DATE-TIME
  if (icalTime.isDate) {
    // DATE type: year/month/day are the actual values (no timezone conversion needed)
    return new Date(icalTime.year, icalTime.month - 1, icalTime.day);
  }
  // DATE-TIME: convert to a JS Date (UTC-based), then extract local calendar date
  const jsDate = icalTime.toJSDate();
  // We only care about the calendar date, not the time — strip to midnight UTC
  return new Date(
    Date.UTC(jsDate.getUTCFullYear(), jsDate.getUTCMonth(), jsDate.getUTCDate())
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear !== undefined
    ? date.getFullYear()
    : date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
