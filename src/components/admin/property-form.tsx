"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Owner = {
  id: string;
  name: string;
  email: string;
};

type PropertyFormData = {
  owner_id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  address: string;
  guests_max: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string; // comma-separated
  airbnb_listing_id: string;
  airbnb_ical_url: string;
  airbnb_url: string;
  rating: string;
  reviews_count: string;
  registration_code: string;
  is_active: boolean;
  sort_order: string;
};

type PropertyFormProps = {
  propertyId?: string;
  initialData?: Partial<{
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
  }>;
  onSuccess?: (id: string) => void;
};

const emptyForm: PropertyFormData = {
  owner_id: "",
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  location: "",
  address: "",
  guests_max: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 1,
  amenities: "",
  airbnb_listing_id: "",
  airbnb_ical_url: "",
  airbnb_url: "",
  rating: "",
  reviews_count: "",
  registration_code: "",
  is_active: true,
  sort_order: "",
};

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function PropertyForm({ propertyId, initialData, onSuccess }: PropertyFormProps) {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>(() => {
    if (!initialData) return emptyForm;
    return {
      owner_id: initialData.owner_id ?? "",
      slug: initialData.slug ?? "",
      title: initialData.title ?? "",
      subtitle: initialData.subtitle ?? "",
      description: initialData.description ?? "",
      location: initialData.location ?? "",
      address: initialData.address ?? "",
      guests_max: initialData.guests_max ?? 4,
      bedrooms: initialData.bedrooms ?? 2,
      beds: initialData.beds ?? 2,
      bathrooms: initialData.bathrooms ?? 1,
      amenities: (initialData.amenities ?? []).join(", "),
      airbnb_listing_id: initialData.airbnb_listing_id ?? "",
      airbnb_ical_url: initialData.airbnb_ical_url ?? "",
      airbnb_url: initialData.airbnb_url ?? "",
      rating: initialData.rating?.toString() ?? "",
      reviews_count: initialData.reviews_count?.toString() ?? "",
      registration_code: initialData.registration_code ?? "",
      is_active: initialData.is_active ?? true,
      sort_order: initialData.sort_order?.toString() ?? "",
    };
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/owners")
      .then((res) => res.json())
      .then(setOwners)
      .catch(() => toast.error("Impossibile caricare i proprietari."));
  }, []);

  function update<K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: propertyId ? prev.slug : generateSlug(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const amenitiesArray = formData.amenities
        ? formData.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const payload = {
        owner_id: formData.owner_id,
        slug: formData.slug,
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description,
        location: formData.location,
        address: formData.address || null,
        guests_max: formData.guests_max,
        bedrooms: formData.bedrooms,
        beds: formData.beds,
        bathrooms: formData.bathrooms,
        amenities: amenitiesArray.length > 0 ? amenitiesArray : null,
        airbnb_listing_id: formData.airbnb_listing_id || null,
        airbnb_ical_url: formData.airbnb_ical_url || null,
        airbnb_url: formData.airbnb_url || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews_count: formData.reviews_count ? parseInt(formData.reviews_count) : null,
        registration_code: formData.registration_code || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order ? parseInt(formData.sort_order) : null,
      };

      const url = propertyId
        ? `/api/admin/properties/${propertyId}`
        : "/api/admin/properties";

      const res = await fetch(url, {
        method: propertyId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Errore sconosciuto");
      }

      const data = await res.json();
      toast.success(
        propertyId
          ? "Proprietà aggiornata con successo."
          : "Proprietà creata con successo."
      );
      onSuccess?.(data.id);
    } catch (err) {
      toast.error((err as Error).message ?? "Errore durante il salvataggio.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titolo *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Appartamento Tramonto Viareggio"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="appartamento-tramonto-viareggio"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Sottotitolo</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          placeholder="Vista mare, centro Viareggio"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrizione *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Appartamento luminoso con vista..."
          rows={4}
          required
        />
      </div>

      {/* Owner */}
      <div className="space-y-2">
        <Label htmlFor="owner">Proprietario *</Label>
        <Select
          value={formData.owner_id}
          onValueChange={(val) => update("owner_id", val ?? "")}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona un proprietario" />
          </SelectTrigger>
          <SelectContent>
            {owners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Posizione *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Viareggio, Lucca"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Indirizzo</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Via Roma 12, Viareggio"
          />
        </div>
      </div>

      {/* Capacity */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guests_max">Ospiti max *</Label>
          <Input
            id="guests_max"
            type="number"
            min={1}
            value={formData.guests_max}
            onChange={(e) => update("guests_max", parseInt(e.target.value) || 1)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Camere *</Label>
          <Input
            id="bedrooms"
            type="number"
            min={0}
            value={formData.bedrooms}
            onChange={(e) => update("bedrooms", parseInt(e.target.value) || 0)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beds">Letti *</Label>
          <Input
            id="beds"
            type="number"
            min={1}
            value={formData.beds}
            onChange={(e) => update("beds", parseInt(e.target.value) || 1)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bagni *</Label>
          <Input
            id="bathrooms"
            type="number"
            min={1}
            value={formData.bathrooms}
            onChange={(e) => update("bathrooms", parseInt(e.target.value) || 1)}
            required
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <Label htmlFor="amenities">Servizi (separati da virgola)</Label>
        <Textarea
          id="amenities"
          value={formData.amenities}
          onChange={(e) => update("amenities", e.target.value)}
          placeholder="WiFi, Aria condizionata, Parcheggio, Lavatrice"
          rows={2}
        />
        <p className="text-xs text-muted-foreground">
          Inserisci i servizi separati da una virgola.
        </p>
      </div>

      {/* Airbnb */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#2D3436] border-b border-[#E8DCC8] pb-2">
          Integrazione Airbnb
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="airbnb_listing_id">ID Annuncio Airbnb</Label>
            <Input
              id="airbnb_listing_id"
              value={formData.airbnb_listing_id}
              onChange={(e) => update("airbnb_listing_id", e.target.value)}
              placeholder="12345678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration_code">Codice Registrazione CIR</Label>
            <Input
              id="registration_code"
              value={formData.registration_code}
              onChange={(e) => update("registration_code", e.target.value)}
              placeholder="LU0123456789"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="airbnb_ical_url">URL iCal Airbnb</Label>
          <Input
            id="airbnb_ical_url"
            type="url"
            value={formData.airbnb_ical_url}
            onChange={(e) => update("airbnb_ical_url", e.target.value)}
            placeholder="https://www.airbnb.com/calendar/ical/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="airbnb_url">URL Annuncio Airbnb</Label>
          <Input
            id="airbnb_url"
            type="url"
            value={formData.airbnb_url}
            onChange={(e) => update("airbnb_url", e.target.value)}
            placeholder="https://www.airbnb.com/rooms/..."
          />
        </div>
      </div>

      {/* Rating & Meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={formData.rating}
            onChange={(e) => update("rating", e.target.value)}
            placeholder="4.8"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviews_count">N. Recensioni</Label>
          <Input
            id="reviews_count"
            type="number"
            min={0}
            value={formData.reviews_count}
            onChange={(e) => update("reviews_count", e.target.value)}
            placeholder="42"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">Ordine</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => update("sort_order", e.target.value)}
            placeholder="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="is_active">Stato</Label>
          <Select
            value={formData.is_active ? "true" : "false"}
            onValueChange={(val) => update("is_active", val === "true")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Attiva</SelectItem>
              <SelectItem value="false">Inattiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-[#4A90A4] hover:bg-[#3A7A8E] text-white px-8"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {propertyId ? "Salva Modifiche" : "Crea Proprietà"}
        </Button>
      </div>
    </form>
  );
}
