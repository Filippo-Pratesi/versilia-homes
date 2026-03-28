import { createAdminClient } from "@/lib/supabase/admin";
import { HeroSection } from "@/components/public/hero-section";
import { PropertiesGrid } from "@/components/public/properties-grid";
import { WhyBookDirect } from "@/components/public/why-book-direct";
import { CTASection } from "@/components/public/cta-section";
import type { PropertyWithPhotos, PricingRule } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Appartamenti Vacanza a Viareggio sul Mare — Prenotazione Diretta',
  description: 'Appartamenti vacanza a Viareggio, Versilia: Il Nido, La Pineta, Il Veliero. A pochi passi dal mare. Prenotazione diretta, senza commissioni Airbnb.',
};

export const revalidate = 60; // revalidate every hour

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

const lodgingBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": "https://viareggiohomes.it/#lodging-business",
  name: "Viareggio Homes",
  description:
    "Appartamenti vacanza a Viareggio, Versilia. Prenota direttamente con i proprietari, senza commissioni. A pochi passi dal mare della Toscana.",
  url: "https://viareggiohomes.it",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Viareggio",
    addressRegion: "Toscana",
    addressCountry: "IT",
    postalCode: "55049",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.8825,
    longitude: 10.2428,
  },
  containsPlace: [
    {
      "@type": "Apartment",
      name: "Il Nido",
      url: "https://viareggiohomes.it/appartamenti/il-nido",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Via Beato Angelico 2",
        addressLocality: "Viareggio",
        addressRegion: "Toscana",
        addressCountry: "IT",
        postalCode: "55049",
      },
    },
    {
      "@type": "Apartment",
      name: "La Pineta",
      url: "https://viareggiohomes.it/appartamenti/la-pineta",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Via Montello 10",
        addressLocality: "Viareggio",
        addressRegion: "Toscana",
        addressCountry: "IT",
        postalCode: "55049",
      },
    },
    {
      "@type": "Apartment",
      name: "Il Veliero",
      url: "https://viareggiohomes.it/appartamenti/il-veliero",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Via Enrico Dandolo 29",
        addressLocality: "Viareggio",
        addressRegion: "Toscana",
        addressCountry: "IT",
        postalCode: "55049",
      },
    },
  ],
  numberOfRooms: 3,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Aria condizionata", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parcheggio", value: true },
    { "@type": "LocationFeatureSpecification", name: "Vicino al mare", value: true },
  ],
  inLanguage: "it",
  areaServed: {
    "@type": "Place",
    name: "Versilia, Toscana, Italia",
  },
};

export default async function HomePage() {
  const properties = await fetchProperties();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingBusinessSchema) }}
      />
      <HeroSection />
      <PropertiesGrid properties={properties} />
      <WhyBookDirect />
      <CTASection />
    </>
  );
}
