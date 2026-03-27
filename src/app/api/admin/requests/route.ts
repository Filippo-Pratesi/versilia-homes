import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const propertyId = searchParams.get("property_id");

    const admin = createAdminClient();
    let query = admin
      .from("booking_requests")
      .select("*, properties(id, title)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (propertyId) {
      query = query.eq("property_id", propertyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching booking requests:", error);
      return NextResponse.json(
        { error: "Errore nel recupero delle richieste" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
