"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  Users,
  BedDouble,
  Bath,
  Wifi,
  Car,
  Waves,
  Wind,
  Tv,
  Coffee,
  UtensilsCrossed,
  WashingMachine,
  ExternalLink,
} from "lucide-react";
import { PhotoGallery } from "@/components/public/photo-gallery";
import { AvailabilityCalendar } from "@/components/public/availability-calendar";
import { BookingForm } from "@/components/public/booking-form";
import type { PropertyFull } from "@/types";

interface PropertyDetailClientProps {
  property: PropertyFull;
}

// Map amenity strings to Lucide icons
const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parcheggio: Car,
  mare: Waves,
  "aria condizionata": Wind,
  "aria-condizionata": Wind,
  tv: Tv,
  "smart tv": Tv,
  "caffettiera": Coffee,
  cucina: UtensilsCrossed,
  lavatrice: WashingMachine,
};

function getAmenityIcon(amenity: string): React.ElementType {
  const lower = amenity.toLowerCase();
  for (const [key, Icon] of Object.entries(amenityIcons)) {
    if (lower.includes(key)) return Icon;
  }
  return Waves;
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const blockedDates = property.blocked_dates.map((bd) => bd.date);

  const minNights =
    property.pricing_rules.find((r) => r.is_default)?.min_nights ??
    property.pricing_rules[0]?.min_nights ??
    1;

  const handleRangeSelect = (from: Date, to: Date) => {
    setCheckIn(from);
    setCheckOut(to);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Photo gallery */}
        <div className="mb-8">
          <PhotoGallery
            photos={property.property_photos}
            propertyTitle={property.title}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left: Info column */}
          <div className="space-y-8">
            {/* Title block */}
            <div>
              <h1
                className="font-display text-4xl sm:text-5xl font-semibold text-[#2D3436] leading-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {property.title}
              </h1>
              {property.subtitle && (
                <p className="mt-2 text-lg text-[#636E72]">{property.subtitle}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-[#636E72]">
                  <MapPin className="h-4 w-4 text-[#4A90A4]" />
                  <span>{property.location}</span>
                </div>

                {/* Rating */}
                {property.rating && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 fill-[#C2714F] text-[#C2714F]" />
                    <span className="font-semibold text-[#2D3436]">
                      {property.rating.toFixed(1)}
                    </span>
                    {property.reviews_count && (
                      <span className="text-[#636E72]">
                        · {property.reviews_count} recensioni
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Key specs */}
            <div className="flex flex-wrap gap-6 py-5 border-y border-[#E0D8CC]">
              <div className="flex items-center gap-2 text-sm text-[#636E72]">
                <Users className="h-4 w-4 text-[#4A90A4]" />
                <span>Fino a {property.guests_max} ospiti</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#636E72]">
                <BedDouble className="h-4 w-4 text-[#4A90A4]" />
                <span>
                  {property.bedrooms}{" "}
                  {property.bedrooms === 1 ? "camera" : "camere"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#636E72]">
                <BedDouble className="h-4 w-4 text-[#4A90A4]" />
                <span>
                  {property.beds} {property.beds === 1 ? "letto" : "letti"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#636E72]">
                <Bath className="h-4 w-4 text-[#4A90A4]" />
                <span>
                  {property.bathrooms}{" "}
                  {property.bathrooms === 1 ? "bagno" : "bagni"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2
                className="font-display text-2xl font-semibold text-[#2D3436]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Descrizione
              </h2>
              <p className="text-[#636E72] leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-3">
                <h2
                  className="font-display text-2xl font-semibold text-[#2D3436]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Servizi
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2.5 text-sm text-[#636E72] p-3 rounded-xl bg-[#F0EBE3]"
                      >
                        <Icon className="h-4 w-4 text-[#4A90A4] shrink-0" />
                        <span className="capitalize">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mobile booking form */}
            <div className="lg:hidden mt-8">
              <div className="bg-white border border-[#E0D8CC] rounded-2xl p-5 space-y-6">
                <div>
                  <h3
                    className="font-display text-xl font-semibold text-[#2D3436] mb-4"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Seleziona le date
                  </h3>
                  <AvailabilityCalendar
                    blockedDates={blockedDates}
                    onRangeSelect={handleRangeSelect}
                    minNights={minNights}
                  />
                </div>
                <BookingForm
                  property={property}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onDatesSet={handleRangeSelect}
                />
              </div>
            </div>

            {/* Airbnb link */}
            {property.airbnb_url && (
              <div className="text-sm">
                <Link
                  href={property.airbnb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#636E72] hover:text-[#4A90A4] transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Vedi su Airbnb
                </Link>
              </div>
            )}

            {/* Registration code */}
            {property.registration_code && (
              <p className="text-xs text-[#636E72] border-t border-[#E0D8CC] pt-4">
                Codice di registrazione turistica: {property.registration_code}
              </p>
            )}
          </div>

          {/* Right: sticky booking sidebar (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white border border-[#E0D8CC] rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3
                  className="font-display text-xl font-semibold text-[#2D3436] mb-4"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Seleziona le date
                </h3>
                <AvailabilityCalendar
                  blockedDates={blockedDates}
                  onRangeSelect={handleRangeSelect}
                  minNights={minNights}
                />
              </div>
              <hr className="border-[#E0D8CC]" />
              <BookingForm
                property={property}
                checkIn={checkIn}
                checkOut={checkOut}
                onDatesSet={handleRangeSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
