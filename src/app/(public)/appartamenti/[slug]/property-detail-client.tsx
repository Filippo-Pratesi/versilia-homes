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
import { format, differenceInCalendarDays } from "date-fns";
import { it } from "date-fns/locale";
import { PhotoGallery } from "@/components/public/photo-gallery";
import { AvailabilityCalendar } from "@/components/public/availability-calendar";
import { BookingForm } from "@/components/public/booking-form";
import type { PropertyFull } from "@/types";

interface PropertyDetailClientProps {
  property: PropertyFull;
}

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parcheggio: Car,
  mare: Waves,
  "aria condizionata": Wind,
  "aria-condizionata": Wind,
  tv: Tv,
  "smart tv": Tv,
  caffettiera: Coffee,
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

function getPriceForDates(
  property: PropertyFull,
  checkIn: Date,
  checkOut: Date
): number {
  const nights = differenceInCalendarDays(checkOut, checkIn);
  if (nights <= 0) return 0;

  // Find applicable rule (non-default seasonal rules take priority)
  const seasonal = property.pricing_rules
    .filter((r) => !r.is_default && r.date_from && r.date_to)
    .find((r) => {
      const from = new Date(r.date_from!);
      const to = new Date(r.date_to!);
      return checkIn >= from && checkIn <= to;
    });

  const defaultRule = property.pricing_rules.find((r) => r.is_default);
  const pricePerNight =
    seasonal?.price_per_night ?? defaultRule?.price_per_night ?? 0;

  return Number(pricePerNight) * nights;
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const blockedDates = property.blocked_dates.map((bd) => bd.date);

  const minNights =
    property.pricing_rules.find((r) => r.is_default)?.min_nights ??
    property.pricing_rules[0]?.min_nights ??
    1;

  const defaultPrice =
    property.pricing_rules.find((r) => r.is_default)?.price_per_night ?? 0;

  const handleRangeSelect = (from: Date, to: Date) => {
    setCheckIn(from);
    setCheckOut(to);
  };

  const nights =
    checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : null;
  const totalPrice =
    checkIn && checkOut ? getPriceForDates(property, checkIn, checkOut) : null;

  const formatShort = (d: Date) => format(d, "d MMM", { locale: it });

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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* ── Left: main content ── */}
          <div className="space-y-10">
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
                <div className="flex items-center gap-1.5 text-sm text-[#636E72]">
                  <MapPin className="h-4 w-4 text-[#4A90A4]" />
                  <span>{property.location}</span>
                </div>
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

            {/* ── Availability calendar (main area) ── */}
            <div className="space-y-4">
              <div>
                <h2
                  className="font-display text-2xl font-semibold text-[#2D3436]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Disponibilità
                </h2>
                {minNights > 1 && (
                  <p className="text-sm text-[#636E72] mt-1">
                    Soggiorno minimo: {minNights} notti
                  </p>
                )}
              </div>

              <AvailabilityCalendar
                blockedDates={blockedDates}
                onRangeSelect={handleRangeSelect}
                minNights={minNights}
                numberOfMonths={2}
              />
            </div>

            {/* Mobile booking form */}
            <div className="lg:hidden">
              <BookingForm
                property={property}
                checkIn={checkIn}
                checkOut={checkOut}
                onDatesSet={handleRangeSelect}
              />
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

          {/* ── Right: sticky sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white border border-[#E0D8CC] rounded-2xl shadow-sm overflow-hidden">
              {/* Price header */}
              <div className="p-6 border-b border-[#E0D8CC]">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#2D3436]">
                    €{Number(defaultPrice).toFixed(0)}
                  </span>
                  <span className="text-sm text-[#636E72]">/ notte</span>
                </div>
                {property.rating && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-[#636E72]">
                    <Star className="h-3 w-3 fill-[#C2714F] text-[#C2714F]" />
                    <span className="font-semibold text-[#2D3436]">
                      {property.rating.toFixed(1)}
                    </span>
                    {property.reviews_count && (
                      <span>· {property.reviews_count} recensioni</span>
                    )}
                  </div>
                )}
              </div>

              {/* Selected dates summary */}
              {checkIn && checkOut && nights ? (
                <div className="px-6 py-4 bg-[#FAFAF8] border-b border-[#E0D8CC] space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#636E72]">
                      {formatShort(checkIn)} → {formatShort(checkOut)}
                    </span>
                    <span className="font-medium text-[#2D3436]">
                      {nights} notti
                    </span>
                  </div>
                  {totalPrice !== null && (
                    <div className="flex justify-between font-semibold text-[#2D3436]">
                      <span>Totale stimato</span>
                      <span>€{totalPrice.toFixed(0)}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-[#636E72]">
                    Il totale finale viene confermato via email.
                  </p>
                </div>
              ) : (
                <div className="px-6 py-4 bg-[#FAFAF8] border-b border-[#E0D8CC]">
                  <p className="text-sm text-[#636E72] text-center">
                    Seleziona le date nel calendario per vedere il totale
                  </p>
                </div>
              )}

              {/* Booking form */}
              <div className="p-6">
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
    </div>
  );
}
