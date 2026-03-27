"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface PriceResult {
  pricePerNight: number | null;
  nights: number;
  totalPrice: number | null;
  currency: string;
  minNights: number | null;
}

interface PriceCalculatorProps {
  propertyId: string;
  checkIn: Date | null;
  checkOut: Date | null;
}

export function PriceCalculator({
  propertyId,
  checkIn,
  checkOut,
}: PriceCalculatorProps) {
  const [result, setResult] = useState<PriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setResult(null);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function fetchPrice() {
      setLoading(true);
      setError(null);

      try {
        const checkInStr = format(checkIn!, "yyyy-MM-dd");
        const checkOutStr = format(checkOut!, "yyyy-MM-dd");

        const url = `/api/pricing/calculate?property_id=${encodeURIComponent(propertyId)}&check_in=${checkInStr}&check_out=${checkOutStr}`;

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Errore nel calcolo del prezzo");
        }

        const data: PriceResult = await res.json();
        setResult(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchPrice();
    return () => controller.abort();
  }, [propertyId, checkIn, checkOut]);

  if (!checkIn || !checkOut) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#636E72] py-3">
        <Loader2 className="h-4 w-4 animate-spin text-[#4A90A4]" />
        <span>Calcolo prezzo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-[#C2714F] py-2">
        Errore: {error}
      </div>
    );
  }

  if (!result) return null;

  if (result.pricePerNight === null || result.totalPrice === null) {
    return (
      <div className="py-3 text-sm text-[#636E72] italic">
        Contattaci per il prezzo
      </div>
    );
  }

  return (
    <div className="py-3 space-y-1 text-sm">
      <div className="flex justify-between text-[#636E72]">
        <span>
          €{result.pricePerNight.toFixed(0)} × {result.nights}{" "}
          {result.nights === 1 ? "notte" : "notti"}
        </span>
        <span>€{result.totalPrice.toFixed(0)}</span>
      </div>
      <div className="flex justify-between font-semibold text-[#2D3436] text-base border-t border-[#E0D8CC] pt-2 mt-2">
        <span>Totale</span>
        <span>€{result.totalPrice.toFixed(0)}</span>
      </div>
    </div>
  );
}
