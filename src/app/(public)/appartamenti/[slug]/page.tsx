import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { PropertyDetailClient } from "./property-detail-client";
import type { PropertyFull } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60;

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("properties")
      .select("slug")
      .eq("is_active", true);

    return (data ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

async function fetchProperty(slug: string): Promise<PropertyFull | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("properties")
      .select(
        `
        *,
        property_photos(*),
        owners(*),
        pricing_rules(*),
        blocked_dates(*)
      `
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) return null;
    return data as PropertyFull;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await fetchProperty(slug);

  if (!property) {
    return { title: "Appartamento non trovato" };
  }

  return {
    title: property.title,
    description:
      property.subtitle ??
      `${property.title} — ${property.location}. Prenota direttamente senza commissioni.`,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const property = await fetchProperty(slug);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}
