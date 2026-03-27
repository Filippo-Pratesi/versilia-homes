"use client";

import { useState } from "react";
import { format } from "date-fns";
import { z } from "zod";
import { MessageSquare } from "lucide-react";
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
import { PriceCalculator } from "./price-calculator";
import type { Property } from "@/types";

const bookingFormSchema = z.object({
  guest_name: z.string().min(2, "Il nome è obbligatorio (min. 2 caratteri)"),
  guest_email: z.string().email("Email non valida"),
  guest_phone: z.string().optional(),
  guests_count: z.number().int().min(1).max(20),
  message: z.string().max(2000).optional(),
});

type FormData = {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guests_count: number;
  message: string;
};

interface BookingFormProps {
  property: Property;
  checkIn: Date | null;
  checkOut: Date | null;
  onDatesSet?: (from: Date, to: Date) => void;
}

const emptyForm: FormData = {
  guest_name: "",
  guest_email: "",
  guest_phone: "",
  guests_count: 2,
  message: "",
};

export function BookingForm({
  property,
  checkIn,
  checkOut,
}: BookingFormProps) {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleGuestsChange = (value: string | null) => {
    if (value === null) return;
    setFormData((prev) => ({ ...prev, guests_count: parseInt(value, 10) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!checkIn || !checkOut) {
      setServerError("Seleziona le date di check-in e check-out.");
      return;
    }
    if (checkIn >= checkOut) {
      setServerError(
        "La data di check-out deve essere successiva al check-in."
      );
      return;
    }

    const parsed = bookingFormSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormData;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        property_id: property.id,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone || null,
        check_in: format(checkIn, "yyyy-MM-dd"),
        check_out: format(checkOut, "yyyy-MM-dd"),
        guests_count: formData.guests_count,
        message: formData.message || null,
      };

      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Errore nell'invio della richiesta.");
      }

      setSuccess(true);
      setWhatsappUrl(data.whatsappUrl ?? null);
      setFormData(emptyForm);
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center py-6 px-4">
        <div className="w-12 h-12 bg-[#4A90A4]/15 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="h-6 w-6 text-[#4A90A4]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3
          className="font-display text-2xl font-semibold text-[#2D3436]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Richiesta inviata!
        </h3>
        <p className="text-sm text-[#636E72]">
          Ti contatteremo entro 24 ore per confermare la disponibilità.
        </p>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#25D366] text-white rounded-xl font-medium text-sm hover:bg-[#1ebe5a] transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Contatta su WhatsApp
          </a>
        )}
        <button
          onClick={() => {
            setSuccess(false);
            setWhatsappUrl(null);
          }}
          className="mt-2 text-sm text-[#636E72] hover:text-[#4A90A4] underline underline-offset-2 transition-colors"
        >
          Nuova richiesta
        </button>
      </div>
    );
  }

  const guestOptions = Array.from(
    { length: property.guests_max },
    (_, i) => i + 1
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <h3
        className="font-display text-xl font-semibold text-[#2D3436]"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Richiedi prenotazione
      </h3>

      {/* Price preview */}
      <PriceCalculator
        propertyId={property.id}
        checkIn={checkIn}
        checkOut={checkOut}
      />

      {/* Dates summary */}
      {checkIn && checkOut && (
        <div className="text-xs text-[#636E72] bg-[#F0EBE3] rounded-lg px-3 py-2 flex justify-between">
          <span>
            Check-in: <strong>{format(checkIn, "dd/MM/yyyy")}</strong>
          </span>
          <span>
            Check-out: <strong>{format(checkOut, "dd/MM/yyyy")}</strong>
          </span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="guest_name"
          className="text-sm font-medium text-[#2D3436]"
        >
          Nome completo *
        </Label>
        <Input
          id="guest_name"
          name="guest_name"
          value={formData.guest_name}
          onChange={handleChange}
          placeholder="Mario Rossi"
          required
          className={errors.guest_name ? "border-[#C2714F]" : ""}
        />
        {errors.guest_name && (
          <p className="text-xs text-[#C2714F]">{errors.guest_name}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label
          htmlFor="guest_email"
          className="text-sm font-medium text-[#2D3436]"
        >
          Email *
        </Label>
        <Input
          id="guest_email"
          name="guest_email"
          type="email"
          value={formData.guest_email}
          onChange={handleChange}
          placeholder="mario@esempio.it"
          required
          className={errors.guest_email ? "border-[#C2714F]" : ""}
        />
        {errors.guest_email && (
          <p className="text-xs text-[#C2714F]">{errors.guest_email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label
          htmlFor="guest_phone"
          className="text-sm font-medium text-[#2D3436]"
        >
          Telefono
        </Label>
        <Input
          id="guest_phone"
          name="guest_phone"
          type="tel"
          value={formData.guest_phone}
          onChange={handleChange}
          placeholder="+39 333 1234567"
        />
      </div>

      {/* Guests */}
      <div className="space-y-1.5">
        <Label
          htmlFor="guests_count"
          className="text-sm font-medium text-[#2D3436]"
        >
          Numero ospiti *
        </Label>
        <Select
          value={String(formData.guests_count)}
          onValueChange={handleGuestsChange}
        >
          <SelectTrigger id="guests_count" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {guestOptions.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} {n === 1 ? "ospite" : "ospiti"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label
          htmlFor="message"
          className="text-sm font-medium text-[#2D3436]"
        >
          Messaggio (opzionale)
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Domande su orari, animali, esigenze particolari..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Server error */}
      {serverError && (
        <div className="text-sm text-[#C2714F] bg-[#C2714F]/10 rounded-lg px-3 py-2">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#4A90A4] hover:bg-[#3A7A8E] text-white rounded-xl py-5 text-base font-medium shadow-md shadow-[#4A90A4]/20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Invio in corso..." : "Invia richiesta"}
      </Button>

      <p className="text-xs text-center text-[#636E72]">
        Ti risponderemo entro 24 ore. Nessun pagamento richiesto ora.
      </p>
    </form>
  );
}
