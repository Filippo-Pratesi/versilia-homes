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

const propertyUpdateSchema = z.object({
  owner_id: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().optional().nullable(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  address: z.string().optional().nullable(),
  guests_max: z.number().int().min(1).optional(),
  bedrooms: z.number().int().min(0).optional(),
  beds: z.number().int().min(1).optional(),
  bathrooms: z.number().int().min(1).optional(),
  amenities: z.array(z.string()).optional().nullable(),
  airbnb_listing_id: z.string().optional().nullable(),
  airbnb_ical_url: z.string().optional().nullable(),
  airbnb_url: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviews_count: z.number().int().min(0).optional().nullable(),
  registration_code: z.string().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  sort_order: z.number().int().optional().nullable(),
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
      .from("properties")
      .select("*, owners(id, name, email), property_photos(*), pricing_rules(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Proprietà non trovata" }, { status: 404 });
      }
      return NextResponse.json({ error: "Errore nel recupero della proprietà" }, { status: 500 });
    }

    return NextResponse.json(data);
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
    const { id } = await params;
    const body = await request.json();
    const parsed = propertyUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating property:", error);
      return NextResponse.json({ error: "Errore nell'aggiornamento della proprietà" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function DELETE(
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
    const { error } = await admin.from("properties").delete().eq("id", id);

    if (error) {
      console.error("Error deleting property:", error);
      return NextResponse.json({ error: "Errore nell'eliminazione della proprietà" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
