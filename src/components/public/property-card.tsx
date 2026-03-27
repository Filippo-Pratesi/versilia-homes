"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Users, BedDouble, Bath, Star } from "lucide-react";
import type { PropertyWithPhotos, PricingRule } from "@/types";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: PropertyWithPhotos & { pricing_rules?: PricingRule[] };
}

function getDefaultPrice(pricingRules: PricingRule[] = []): number | null {
  const defaultRule = pricingRules.find((r) => r.is_default);
  if (defaultRule) return defaultRule.price_per_night;
  if (pricingRules.length > 0) return pricingRules[0].price_per_night;
  return null;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const coverPhoto =
    property.property_photos.find((p) => p.is_cover) ??
    property.property_photos[0];

  const defaultPrice = getDefaultPrice(property.pricing_rules);

  const isGuestFavorite =
    (property.reviews_count ?? 0) >= 5 && (property.rating ?? 0) >= 4.8;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="property-card group rounded-2xl overflow-hidden bg-white border border-[#E0D8CC] flex flex-col"
    >
      <Link href={`/appartamenti/${property.slug}`} className="block">
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F0EBE3]">
          {coverPhoto ? (
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={coverPhoto.url}
                alt={coverPhoto.alt_text ?? property.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#636E72]">
              <BedDouble className="h-12 w-12 opacity-30" />
            </div>
          )}

          {/* Guest Favorite badge */}
          {isGuestFavorite && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-[#2D3436] text-xs font-semibold shadow-sm border-0">
                Guest Favorite
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3
            className="font-display text-xl font-semibold text-[#2D3436] leading-snug group-hover:text-[#4A90A4] transition-colors line-clamp-1"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-[#636E72]">
            <MapPin className="h-3.5 w-3.5 text-[#4A90A4] shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {/* Rating */}
          {property.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-[#C2714F] text-[#C2714F]" />
              <span className="font-medium text-[#2D3436]">
                {property.rating.toFixed(1)}
              </span>
              {property.reviews_count && (
                <span className="text-[#636E72]">
                  ({property.reviews_count} recensioni)
                </span>
              )}
            </div>
          )}

          {/* Icons row */}
          <div className="flex items-center gap-4 text-xs text-[#636E72]">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {property.guests_max} ospiti
            </span>
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {property.bedrooms} camere
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.bathrooms} bagni
            </span>
          </div>

          {/* Price */}
          <div className="pt-1 border-t border-[#E0D8CC]">
            {defaultPrice !== null ? (
              <p className="text-sm text-[#2D3436]">
                <span className="text-lg font-semibold">
                  €{defaultPrice.toFixed(0)}
                </span>
                <span className="text-[#636E72]"> / notte</span>
              </p>
            ) : (
              <p className="text-sm text-[#636E72] italic">
                Contattaci per il prezzo
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
