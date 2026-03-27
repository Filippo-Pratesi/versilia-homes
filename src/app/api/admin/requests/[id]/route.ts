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

const patchSchema = z.object({
  status: z.enum(["confirmed", "declined"]),
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
      .from("booking_requests")
      .select("*, properties(id, title, location, address, owners(id, name, email, phone))")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching booking request:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Richiesta non trovata" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Errore nel recupero della richiesta" },
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

export async function PATCH(
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
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("booking_requests")
      .update({ status: parsed.data.status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating booking request:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Richiesta non trovata" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Errore nell'aggiornamento della richiesta" },
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
