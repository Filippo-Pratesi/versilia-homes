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

const pricingRuleSchema = z.object({
  label: z.string().min(1, "L'etichetta è obbligatoria"),
  price_per_night: z.number().positive("Il prezzo deve essere positivo"),
  date_from: z.string().optional().nullable(),
  date_to: z.string().optional().nullable(),
  min_nights: z.number().int().min(1).optional().nullable(),
  is_default: z.boolean().optional().nullable(),
});

const pricingRuleUpdateSchema = pricingRuleSchema.extend({
  id: z.string().uuid(),
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
      .from("pricing_rules")
      .select("*")
      .eq("property_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching pricing rules:", error);
      return NextResponse.json({ error: "Errore nel recupero delle tariffe" }, { status: 500 });
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
    const parsed = pricingRuleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("pricing_rules")
      .insert({ ...parsed.data, property_id: id })
      .select()
      .single();

    if (error) {
      console.error("Error creating pricing rule:", error);
      return NextResponse.json({ error: "Errore nella creazione della tariffa" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function PUT(
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
    const parsed = pricingRuleUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id: ruleId, ...updateData } = parsed.data;

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("pricing_rules")
      .update(updateData)
      .eq("id", ruleId)
      .select()
      .single();

    if (error) {
      console.error("Error updating pricing rule:", error);
      return NextResponse.json({ error: "Errore nell'aggiornamento della tariffa" }, { status: 500 });
    }

    return NextResponse.json(data);
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
    const { ruleId } = body;

    if (!ruleId) {
      return NextResponse.json({ error: "ID tariffa non fornito" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("pricing_rules")
      .delete()
      .eq("id", ruleId);

    if (error) {
      console.error("Error deleting pricing rule:", error);
      return NextResponse.json({ error: "Errore nell'eliminazione della tariffa" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
