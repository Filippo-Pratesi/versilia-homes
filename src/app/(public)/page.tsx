import { createAdminClient } from "@/lib/supabase/admin";
import { HeroSection } from "@/components/public/hero-section";
import { PropertiesGrid } from "@/components/public/properties-grid";
import { WhyBookDirect } from "@/components/public/why-book-direct";
import { CTASection } from "@/components/public/cta-section";
import type { PropertyWithPhotos, PricingRule } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Vacanze in Versilia — Appartamenti a Viareggio',
  description: 'Prenota direttamente i tuoi appartamenti vacanza a Viareggio, Versilia. A pochi passi dal mare. Contatto diretto con i proprietari, senza commissioni Airbnb.',
};

export const revalidate = 3600; // revalidate every hour

async function fetchProperties(): Promise<
  (PropertyWithPhotos & { pricing_rules: PricingRule[] })[]
> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("properties")
      .select(
        `
        *,
        property_photos(*),
        pricing_rules(*)
      `
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[homepage] Error fetching properties:", error);
      return [];
    }

    return (data ?? []) as (PropertyWithPhotos & { pricing_rules: PricingRule[] })[];
  } catch (err) {
    console.error("[homepage] Unexpected error:", err);
    return [];
  }
}

export default async function HomePage() {
  const properties = await fetchProperties();

  return (
    <>
      <HeroSection />
      <PropertiesGrid properties={properties} />
      <WhyBookDirect />
      <CTASection />
    </>
  );
}
