import { createAdminClient } from "@/lib/supabase/admin";
import { PropertiesGrid } from "@/components/public/properties-grid";
import type { PropertyWithPhotos, PricingRule } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'I Nostri Appartamenti',
  description: 'Scopri i nostri 3 appartamenti a Viareggio: Il Nido, La Pineta e Il Veliero. A 500m dal mare, prenotazione diretta senza commissioni.',
};

export const revalidate = 60;

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
      console.error("[appartamenti] Error fetching properties:", error);
      return [];
    }

    return (data ?? []) as (PropertyWithPhotos & {
      pricing_rules: PricingRule[];
    })[];
  } catch (err) {
    console.error("[appartamenti] Unexpected error:", err);
    return [];
  }
}

export default async function AppartamentiPage() {
  const properties = await fetchProperties();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page header */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-[#E8DCC8]/20 border-b border-[#E0D8CC]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-3">
          Viareggio · Versilia
        </p>
        <h1
          className="font-display text-4xl sm:text-5xl font-semibold text-[#2D3436]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          I Nostri Appartamenti
        </h1>
        <p className="mt-4 text-[#636E72] max-w-md mx-auto">
          Prenota direttamente con noi. Nessuna commissione, contatto diretto
          con i proprietari.
        </p>
      </div>

      <PropertiesGrid properties={properties} />
    </div>
  );
}
