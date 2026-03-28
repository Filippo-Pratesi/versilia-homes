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

// Static address data keyed by slug, used to enrich ItemList schema
const PROPERTY_ADDRESSES: Record<string, { street: string; lat: number; lng: number }> = {
  "il-nido": { street: "Via Beato Angelico 2", lat: 43.88151, lng: 10.24376 },
  "la-pineta": { street: "Via Montello 10", lat: 43.88276, lng: 10.24189 },
  "il-veliero": { street: "Via Enrico Dandolo 29", lat: 43.88281, lng: 10.24295 },
};

function buildItemListSchema(
  properties: (PropertyWithPhotos & { pricing_rules: PricingRule[] })[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Appartamenti vacanza a Viareggio — Viareggio Homes",
    description:
      "I nostri tre appartamenti vacanza a Viareggio, Versilia: Il Nido, La Pineta, Il Veliero. Prenotazione diretta, senza commissioni.",
    url: "https://viareggiohomes.it/appartamenti",
    numberOfItems: properties.length,
    itemListElement: properties.map((p, index) => {
      const staticData = PROPERTY_ADDRESSES[p.slug];
      const coverPhoto = p.property_photos.find((ph) => ph.is_cover) ?? p.property_photos[0];
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Apartment",
          "@id": `https://viareggiohomes.it/appartamenti/${p.slug}`,
          name: p.title,
          description: p.subtitle ?? p.description,
          url: `https://viareggiohomes.it/appartamenti/${p.slug}`,
          ...(coverPhoto ? { image: coverPhoto.url } : {}),
          address: {
            "@type": "PostalAddress",
            streetAddress: staticData?.street ?? (p.address ?? undefined),
            addressLocality: "Viareggio",
            addressRegion: "Toscana",
            addressCountry: "IT",
            postalCode: "55049",
          },
          ...(staticData
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: staticData.lat,
                  longitude: staticData.lng,
                },
              }
            : {}),
          numberOfBedrooms: p.bedrooms,
          numberOfBathroomsTotal: p.bathrooms,
          occupancy: {
            "@type": "QuantitativeValue",
            maxValue: p.guests_max,
          },
          ...(p.rating != null
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: p.rating,
                  reviewCount: p.reviews_count ?? 1,
                  bestRating: 5,
                  worstRating: 1,
                },
              }
            : {}),
        },
      };
    }),
  };
}

export default async function AppartamentiPage() {
  const properties = await fetchProperties();

  const itemListSchema = buildItemListSchema(properties);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
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

      {/* Map section */}
      {mapProperties.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAF8] border-t border-[#E0D8CC]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h2
                className="font-display text-4xl font-semibold text-[#2D3436] mb-2"
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
