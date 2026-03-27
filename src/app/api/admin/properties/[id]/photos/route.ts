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
      .from("property_photos")
      .select("*")
      .eq("property_id", id)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching photos:", error);
      return NextResponse.json({ error: "Errore nel recupero delle foto" }, { status: 500 });
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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const propertyId = formData.get("property_id") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
    }

    if (!propertyId || propertyId !== id) {
      return NextResponse.json({ error: "ID proprietà non valido" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Fetch the property slug for the storage path
    const { data: property, error: propError } = await admin
      .from("properties")
      .select("slug")
      .eq("id", id)
      .single();

    if (propError || !property) {
      return NextResponse.json({ error: "Proprietà non trovata" }, { status: 404 });
    }

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const storagePath = `property-photos/${property.slug}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await admin.storage
      .from("property-photos")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      return NextResponse.json({ error: "Errore nel caricamento della foto" }, { status: 500 });
    }

    const { data: urlData } = admin.storage
      .from("property-photos")
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Get the current max sort_order for this property
    const { data: existingPhotos } = await admin
      .from("property_photos")
      .select("sort_order")
      .eq("property_id", id)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextSortOrder = existingPhotos && existingPhotos.length > 0
      ? (existingPhotos[0].sort_order ?? 0) + 1
      : 0;

    const { data: photoRecord, error: insertError } = await admin
      .from("property_photos")
      .insert({
        property_id: id,
        storage_path: storagePath,
        url: publicUrl,
        alt_text: null,
        sort_order: nextSortOrder,
        is_cover: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting photo record:", insertError);
      return NextResponse.json({ error: "Errore nel salvataggio della foto" }, { status: 500 });
    }

    return NextResponse.json(photoRecord, { status: 201 });
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
    const { photoId } = body;

    if (!photoId) {
      return NextResponse.json({ error: "ID foto non fornito" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("property_photos")
      .delete()
      .eq("id", photoId);

    if (error) {
      console.error("Error deleting photo:", error);
      return NextResponse.json({ error: "Errore nell'eliminazione della foto" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
