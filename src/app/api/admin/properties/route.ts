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

const propertySchema = z.object({
  owner_id: z.string().uuid("ID proprietario non valido"),
  slug: z.string().min(1, "Lo slug è obbligatorio"),
  title: z.string().min(1, "Il titolo è obbligatorio"),
  subtitle: z.string().optional().nullable(),
  description: z.string().min(1, "La descrizione è obbligatoria"),
  location: z.string().min(1, "La posizione è obbligatoria"),
  address: z.string().optional().nullable(),
  guests_max: z.number().int().min(1).default(1),
  bedrooms: z.number().int().min(0).default(1),
  beds: z.number().int().min(1).default(1),
  bathrooms: z.number().int().min(1).default(1),
  amenities: z.array(z.string()).optional().nullable(),
  airbnb_listing_id: z.string().optional().nullable(),
  airbnb_ical_url: z.string().url().optional().nullable().or(z.literal("")),
  airbnb_url: z.string().url().optional().nullable().or(z.literal("")),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviews_count: z.number().int().min(0).optional().nullable(),
  registration_code: z.string().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  sort_order: z.number().int().optional().nullable(),
});

export async function GET() {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("properties")
      .select("*, owners(id, name, email)")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching properties:", error);
      return NextResponse.json({ error: "Errore nel recupero delle proprietà" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = propertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Clean up empty URL strings
    const insertData = {
      ...parsed.data,
      airbnb_ical_url: parsed.data.airbnb_ical_url || null,
      airbnb_url: parsed.data.airbnb_url || null,
    };

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("properties")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating property:", error);
      return NextResponse.json({ error: "Errore nella creazione della proprietà" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
