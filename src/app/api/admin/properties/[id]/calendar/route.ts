import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

const addBlockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido (YYYY-MM-DD)"),
  source: z.literal("manual"),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blocked_dates")
      .select("*")
      .eq("property_id", id)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching blocked dates:", error);
      return NextResponse.json({ error: "Errore nel recupero delle date bloccate" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = addBlockedDateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blocked_dates")
      .insert({
        property_id: id,
        date: parsed.data.date,
        source: parsed.data.source,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding blocked date:", error);
      return NextResponse.json({ error: "Errore nell'aggiunta della data bloccata" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    await params; // consume params
    const body = await request.json();
    const { dateId } = body;

    if (!dateId) {
      return NextResponse.json({ error: "ID data non fornito" }, { status: 400 });
    }

    const admin = createAdminClient();
    // Only allow deleting manual blocked dates
    const { error } = await admin
      .from("blocked_dates")
      .delete()
      .eq("id", dateId)
      .eq("source", "manual");

    if (error) {
      console.error("Error deleting blocked date:", error);
      return NextResponse.json({ error: "Errore nell'eliminazione della data bloccata" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
