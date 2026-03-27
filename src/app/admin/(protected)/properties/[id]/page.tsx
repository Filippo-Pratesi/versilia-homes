"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyForm } from "@/components/admin/property-form";
import { PhotoManager } from "@/components/admin/photo-manager";
import { PricingManager } from "@/components/admin/pricing-manager";
import { CalendarManager } from "@/components/admin/calendar-manager";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";

type Property = {
  id: string;
  owner_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  location: string;
  address: string | null;
  guests_max: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[] | null;
  airbnb_listing_id: string | null;
  airbnb_ical_url: string | null;
  airbnb_url: string | null;
  rating: number | null;
  reviews_count: number | null;
  registration_code: string | null;
  is_active: boolean | null;
  sort_order: number | null;
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProperty = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`);
      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Proprietà non trovata.");
          router.push("/admin/properties");
          return;
        }
        throw new Error("Errore nel caricamento");
      }
      const data = await res.json();
      setProperty(data);
    } catch {
      toast.error("Impossibile caricare la proprietà.");
    } finally {
      setLoading(false);
    }
  }, [propertyId, router]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  function handleFormSuccess() {
    fetchProperty();
    toast.success("Proprietà aggiornata con successo.");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90A4]" />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D3436] mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Torna alle proprietà
        </Link>
        <h1 className="text-3xl font-display font-semibold text-[#2D3436]">
          {property.title}
        </h1>
        <p className="text-muted-foreground mt-1">{property.location}</p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="border border-[#E8DCC8] bg-[#FAFAF8] p-1">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-white data-[state=active]:text-[#2D3436] data-[state=active]:shadow-sm"
          >
            Dettagli
          </TabsTrigger>
          <TabsTrigger
            value="photos"
            className="data-[state=active]:bg-white data-[state=active]:text-[#2D3436] data-[state=active]:shadow-sm"
          >
            Foto
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="data-[state=active]:bg-white data-[state=active]:text-[#2D3436] data-[state=active]:shadow-sm"
          >
            Prezzi
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:bg-white data-[state=active]:text-[#2D3436] data-[state=active]:shadow-sm"
          >
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="bg-white border border-[#E8DCC8] rounded-xl p-6">
            <PropertyForm
              propertyId={property.id}
              initialData={property}
              onSuccess={handleFormSuccess}
            />
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="bg-white border border-[#E8DCC8] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#2D3436] mb-6">
              Gestione Foto
            </h2>
            <PhotoManager propertyId={property.id} />
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="bg-white border border-[#E8DCC8] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#2D3436] mb-6">
              Tariffe
            </h2>
            <PricingManager propertyId={property.id} />
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="bg-white border border-[#E8DCC8] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#2D3436] mb-6">
              Calendario Disponibilità
            </h2>
            <CalendarManager propertyId={property.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
