"use client";

import { motion } from "framer-motion";
import { PropertyCard } from "./property-card";
import type { PropertyWithPhotos, PricingRule } from "@/types";

interface PropertiesGridProps {
  properties: (PropertyWithPhotos & { pricing_rules?: PricingRule[] })[];
}

export function PropertiesGrid({ properties }: PropertiesGridProps) {
  if (properties.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#636E72]">
            Nessun appartamento disponibile al momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl font-semibold text-[#2D3436] mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            I Nostri Appartamenti
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[2px] w-16 bg-[#4A90A4] mx-auto"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-[#636E72] max-w-md mx-auto"
          >
            Scelti con cura, a pochi passi dal mare della Versilia.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
