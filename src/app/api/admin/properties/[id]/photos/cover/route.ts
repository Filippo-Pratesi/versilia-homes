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

const coverSchema = z.object({
  photoId: z.string().uuid(),
});

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
    const parsed = coverSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { photoId } = parsed.data;
    const admin = createAdminClient();

    // Unset all existing covers for this property
    await admin
      .from("property_photos")
      .update({ is_cover: false })
      .eq("property_id", id);

    // Set the selected photo as cover
    const { data, error } = await admin
      .from("property_photos")
      .update({ is_cover: true })
      .eq("id", photoId)
      .eq("property_id", id)
      .select()
      .single();

    if (error) {
      console.error("Error setting cover photo:", error);
      return NextResponse.json({ error: "Errore nell'impostazione della copertina" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
