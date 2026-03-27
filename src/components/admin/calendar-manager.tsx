"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/src/style.css";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";

type BlockedDate = {
  id: string;
  property_id: string;
  date: string;
  source: string | null;
  synced_at: string | null;
};

type CalendarManagerProps = {
  propertyId: string;
};

export function CalendarManager({ propertyId }: CalendarManagerProps) {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingDate, setTogglingDate] = useState<string | null>(null);

  const fetchBlockedDates = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/calendar`);
      if (!res.ok) throw new Error("Errore nel caricamento");
      const data = await res.json();
      setBlockedDates(data);
    } catch {
      toast.error("Impossibile caricare il calendario.");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchBlockedDates();
  }, [fetchBlockedDates]);

  const airbnbDates = blockedDates
    .filter((d) => d.source !== "manual")
    .map((d) => parseISO(d.date));

  const manualDates = blockedDates
    .filter((d) => d.source === "manual")
    .map((d) => parseISO(d.date));

  async function handleDayClick(day: Date) {
    const dateStr = format(day, "yyyy-MM-dd");
    const existing = blockedDates.find((d) => d.date === dateStr);

    if (togglingDate === dateStr) return;
    setTogglingDate(dateStr);

    try {
      if (existing) {
        // Only remove manual dates
        if (existing.source !== "manual") {
          toast.info("Non è possibile rimuovere le date bloccate da Airbnb.");
          return;
        }

        const res = await fetch(`/api/admin/properties/${propertyId}/calendar`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dateId: existing.id }),
        });

        if (!res.ok) throw new Error("Errore nella rimozione");

        setBlockedDates((prev) => prev.filter((d) => d.id !== existing.id));
        toast.success(`Data ${format(day, "d MMMM yyyy", { locale: it })} sbloccata.`);
      } else {
        const res = await fetch(`/api/admin/properties/${propertyId}/calendar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dateStr, source: "manual" }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Errore sconosciuto");
        }

        const newDate = await res.json();
        setBlockedDates((prev) => [...prev, newDate]);
        toast.success(`Data ${format(day, "d MMMM yyyy", { locale: it })} bloccata.`);
      }
    } catch (err) {
      toast.error((err as Error).message ?? "Errore durante l'aggiornamento del calendario.");
    } finally {
      setTogglingDate(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[#4A90A4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Clicca su una data disponibile per bloccarla manualmente. Clicca su una data bloccata manualmente per sbloccarla.
        Le date bloccate da Airbnb non possono essere modificate.
      </p>

      {/* Calendar */}
      <div className="flex justify-center">
        <div className="rdp-wrapper">
          <style>{`
            .rdp-wrapper .rdp {
              --rdp-accent-color: #4A90A4;
              --rdp-background-color: #4A90A4;
            }
            .rdp-day_airbnb {
              background-color: #FEE2E2 !important;
              color: #DC2626 !important;
              border-radius: 4px;
            }
            .rdp-day_manual {
              background-color: #FED7AA !important;
              color: #EA580C !important;
              border-radius: 4px;
            }
          `}</style>
          <DayPicker
            mode="multiple"
            selected={[...airbnbDates, ...manualDates]}
            onDayClick={handleDayClick}
            numberOfMonths={2}
            locale={it}
            fromDate={new Date()}
            modifiers={{
              airbnb: airbnbDates,
              manual: manualDates,
            }}
            modifiersClassNames={{
              airbnb: "rdp-day_airbnb",
              manual: "rdp-day_manual",
            }}
            disabled={togglingDate ? [parseISO(togglingDate)] : undefined}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm border-t border-[#E8DCC8] pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
          <span className="text-muted-foreground">Bloccata da Airbnb</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200" />
          <span className="text-muted-foreground">Bloccata manualmente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border border-[#E8DCC8]" />
          <span className="text-muted-foreground">Disponibile</span>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Totale date bloccate:{" "}
        <span className="font-medium text-[#2D3436]">{blockedDates.length}</span>
        {" — "}
        Airbnb:{" "}
        <span className="font-medium text-[#2D3436]">{airbnbDates.length}</span>
        {" — "}
        Manuali:{" "}
        <span className="font-medium text-[#2D3436]">{manualDates.length}</span>
      </div>
    </div>
  );
}
