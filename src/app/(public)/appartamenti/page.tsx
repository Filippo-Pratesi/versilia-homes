import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { PropertiesGrid } from "@/components/public/properties-grid";
import { PropertiesMap, type MapProperty } from "@/components/public/properties-map-dynamic";
import type { PropertyWithPhotos, PricingRule } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Appartamenti a Viareggio — Il Nido, La Pineta, Il Veliero',
  description: 'Tre appartamenti vacanza a Viareggio, sul mare della Versilia: Il Nido, La Pineta, Il Veliero. Prenotazione diretta, prezzi trasparenti, nessuna commissione.',
};

export const revalidate = 60;

async function fetchProperties(): Promise<
  (PropertyWithPhotos & { pricing_rules: PricingRule[] })[]
> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("properties")
      .select(`*, property_photos(*), pricing_rules(*)`)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[appartamenti] Error fetching properties:", error);
      return [];
    }

    return (data ?? []) as (PropertyWithPhotos & { pricing_rules: PricingRule[] })[];
  } catch (err) {
    console.error("[appartamenti] Unexpected error:", err);
    return [];
  }
}

export default async function AppartamentiPage() {
  const properties = await fetchProperties();

  const mapProperties: MapProperty[] = properties
    .filter((p) => p.latitude != null && p.longitude != null)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      address: p.address ?? p.location,
      lat: p.latitude!,
      lng: p.longitude!,
    }));

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page header */}
      <section className="relative py-20 sm:py-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden bg-[#2D3436]">
        <Image
          src="/images/appartamenti-hero.jpg"
          alt="Veduta aerea della spiaggia di Viareggio sul mare Tirreno"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,250,248,0.80) 0%, rgba(232,220,200,0.68) 40%, rgba(224,239,243,0.62) 100%)",
          }}
        />
        <div className="relative z-[2] max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90A4] mb-3">
            Viareggio · Versilia
          </p>
          <h1
            className="font-display text-3xl sm:text-5xl font-semibold text-[#2D3436]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            I Nostri Appartamenti
          </h1>
          <p className="mt-4 text-[#636E72] max-w-md mx-auto">
            Prenota direttamente con noi. Nessuna commissione, contatto diretto
            con i proprietari.
          </p>
        </div>
      </section>

      <PropertiesGrid properties={properties} />

      {/* Map section */}
      {mapProperties.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAF8] border-t border-[#E0D8CC]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h2
                className="font-display text-3xl sm:text-4xl font-semibold text-[#2D3436] mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Dove Siamo
              </h2>
              <p className="text-[#636E72] text-sm">
                Tutti i nostri appartamenti si trovano a Viareggio, a pochi passi dal mare
              </p>
            </div>
            <PropertiesMap properties={mapProperties} />
          </div>
        </section>
      )}
    </div>
  );
}
