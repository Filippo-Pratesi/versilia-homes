import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { PropertyDetailClient } from "./property-detail-client";
import type { PropertyFull } from "@/types";
import type { Metadata } from "next";

// Static address / GPS data keyed by slug
const PROPERTY_STATIC: Record<
  string,
  { street: string; lat: number; lng: number }
> = {
  "il-nido": { street: "Via Beato Angelico 2", lat: 43.88151, lng: 10.24376 },
  "la-pineta": { street: "Via Montello 10", lat: 43.88276, lng: 10.24189 },
  "il-veliero": {
    street: "Via Enrico Dandolo 29",
    lat: 43.88281,
    lng: 10.24295,
  },
};

function buildApartmentSchema(property: PropertyFull) {
  const staticData = PROPERTY_STATIC[property.slug];
  const coverPhoto =
    property.property_photos.find((ph) => ph.is_cover) ??
    property.property_photos[0];
  const images = property.property_photos
    .slice(0, 10)
    .map((ph) => ph.url);

  const lat = property.latitude ?? staticData?.lat;
  const lng = property.longitude ?? staticData?.lng;
  const street = property.address ?? staticData?.street;

  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "@id": `https://viareggiohomes.it/appartamenti/${property.slug}`,
    name: property.title,
    description: property.description,
    url: `https://viareggiohomes.it/appartamenti/${property.slug}`,
    ...(images.length > 0 ? { image: images } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: street ?? undefined,
      addressLocality: "Viareggio",
      addressRegion: "Toscana",
      addressCountry: "IT",
      postalCode: "55049",
    },
    ...(lat != null && lng != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: lat,
            longitude: lng,
          },
        }
      : {}),
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    numberOfRooms: property.bedrooms + property.bathrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: property.guests_max,
      unitCode: "C62",
    },
    ...(property.amenities && property.amenities.length > 0
      ? {
          amenityFeature: property.amenities.map((amenity) => ({
            "@type": "LocationFeatureSpecification",
            name: amenity,
            value: true,
          })),
        }
      : {}),
    ...(property.rating != null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: property.rating,
            reviewCount: property.reviews_count ?? 1,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    containedInPlace: {
      "@type": "LodgingBusiness",
      "@id": "https://viareggiohomes.it/#lodging-business",
      name: "Viareggio Homes",
      url: "https://viareggiohomes.it",
    },
    ...(property.airbnb_url
      ? { sameAs: [property.airbnb_url] }
      : {}),
  };
}

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

  const descriptionBase = property.subtitle
    ? property.subtitle
    : `${property.title} a Viareggio, mare Versilia. Appartamento vacanza con prenotazione diretta, senza commissioni Airbnb.`

  // Ensure description stays within the recommended 160-character limit
  const description = descriptionBase.length > 160
    ? descriptionBase.slice(0, 157) + '…'
    : descriptionBase

  return {
    title: `${property.title} — Appartamento Vacanza a Viareggio`,
    description,
    openGraph: {
      title: `${property.title} — Appartamento Vacanza a Viareggio`,
      description,
      type: 'website',
      locale: 'it_IT',
    },
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

  const apartmentSchema = buildApartmentSchema(property);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(apartmentSchema) }}
      />
      <PropertyDetailClient property={property} />
    </>
  );
}
