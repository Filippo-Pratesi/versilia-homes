"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { it } from "date-fns/locale";
import {
  startOfDay,
  parseISO,
  format,
  differenceInCalendarDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, Users, X } from "lucide-react";
import { BookingForm } from "./booking-form";
import type { PropertyFull } from "@/types";
import "react-day-picker/style.css";

interface BookingWidgetProps {
  property: PropertyFull;
}

type ActiveField = "checkin" | "checkout" | null;

function roundToNearest5(n: number) {
  return Math.round(n / 5) * 5;
}

function getPriceForRange(
  property: PropertyFull,
  checkIn: Date,
  checkOut: Date
): number {
  const nights = differenceInCalendarDays(checkOut, checkIn);
  if (nights <= 0) return 0;
  const seasonal = property.pricing_rules
    .filter((r) => !r.is_default && r.date_from && r.date_to)
    .find((r) => {
      const from = new Date(r.date_from!);
      const to = new Date(r.date_to!);
      return checkIn >= from && checkIn <= to;
    });
  const def = property.pricing_rules.find((r) => r.is_default);
  const ppn = Number(seasonal?.price_per_night ?? def?.price_per_night ?? 0);
  return roundToNearest5(ppn * nights);
}

export function BookingWidget({ property }: BookingWidgetProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [guests, setGuests] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [minNightsWarning, setMinNightsWarning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const minNights =
    property.pricing_rules.find((r) => r.is_default)?.min_nights ??
    property.pricing_rules[0]?.min_nights ??
    1;

  const blockedDates = property.blocked_dates
    .map((bd) => {
      try {
        return parseISO(bd.date);
      } catch {
        return null;
      }
    })
    .filter((d): d is Date => d !== null);

  const disabledMatcher = [{ before: today }, ...blockedDates];

  // Close calendar on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveField(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveField(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = useCallback(
    (selected: DateRange | undefined) => {
      setMinNightsWarning(false);

      if (!selected) {
        setRange(undefined);
        return;
      }

      // If picking check-in
      if (activeField === "checkin") {
        setRange({ from: selected.from, to: undefined });
        setActiveField("checkout");
        return;
      }

      // If picking checkout
      if (activeField === "checkout" && selected.from && selected.to) {
        const nights = differenceInCalendarDays(selected.to, selected.from);
        if (nights < minNights) {
          setMinNightsWarning(true);
          return;
        }
        setRange(selected);
        setActiveField(null); // close calendar
        return;
      }

      // Fallback: full range selected
      if (selected.from && selected.to) {
        const nights = differenceInCalendarDays(selected.to, selected.from);
        if (nights < minNights) {
          setMinNightsWarning(true);
          return;
        }
        setRange(selected);
        setActiveField(null);
      } else {
        setRange(selected);
        if (selected.from && !selected.to) setActiveField("checkout");
      }
    },
    [activeField, minNights]
  );

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRange(undefined);
    setActiveField(null);
    setMinNightsWarning(false);
    setShowForm(false);
  };

  const nights =
    range?.from && range?.to
      ? differenceInCalendarDays(range.to, range.from)
      : null;

  const totalPrice =
    range?.from && range?.to
      ? getPriceForRange(property, range.from, range.to)
      : null;

  const fmt = (d: Date) => format(d, "dd/MM/yyyy");
  const fmtShort = (d: Date) => format(d, "d MMM", { locale: it });

  const calendarOpen = activeField !== null;

  return (
    <div ref={containerRef} className="relative">
      {/* ── Main card ── */}
      <div className="bg-white border border-[#E0D8CC] rounded-2xl shadow-md overflow-visible">
        {/* Price header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#E0D8CC]">
          {nights && totalPrice ? (
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#2D3436]">
                  €{totalPrice}
                </span>
                <span className="text-sm text-[#636E72]">totale</span>
              </div>
              <p className="text-xs text-[#636E72] mt-0.5">
                €{Math.round(totalPrice / nights)} × {nights}{" "}
                {nights === 1 ? "notte" : "notti"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-base font-semibold text-[#2D3436]">
                Seleziona le date
              </p>
              <p className="text-xs text-[#636E72] mt-0.5">
                Il prezzo verrà calcolato in base al periodo scelto
              </p>
            </div>
          )}
        </div>

        {/* ── Date picker inputs ── */}
        <div
          className={`mx-4 mt-4 rounded-xl border-2 overflow-hidden transition-colors ${
            calendarOpen ? "border-[#2D3436]" : "border-[#BDBDBD]"
          }`}
        >
          <div className="grid grid-cols-2 divide-x divide-[#BDBDBD]">
            {/* Check-in */}
            <button
              type="button"
              onClick={() =>
                setActiveField(activeField === "checkin" ? null : "checkin")
              }
              className={`px-3 py-3 text-left transition-colors hover:bg-[#F5F0E8] focus:outline-none ${
                activeField === "checkin" ? "bg-[#F5F0E8]" : "bg-white"
              }`}
            >
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#636E72]">
                Check-in
              </div>
              <div
                className={`text-sm mt-0.5 font-medium ${
                  range?.from ? "text-[#2D3436]" : "text-[#BDBDBD]"
                }`}
              >
                {range?.from ? fmtShort(range.from) : "Aggiungi data"}
              </div>
            </button>

            {/* Check-out */}
            <button
              type="button"
              onClick={() =>
                setActiveField(activeField === "checkout" ? null : "checkout")
              }
              className={`px-3 py-3 text-left transition-colors hover:bg-[#F5F0E8] focus:outline-none ${
                activeField === "checkout" ? "bg-[#F5F0E8]" : "bg-white"
              }`}
            >
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#636E72]">
                Check-out
              </div>
              <div
                className={`text-sm mt-0.5 font-medium flex items-center justify-between ${
                  range?.to ? "text-[#2D3436]" : "text-[#BDBDBD]"
                }`}
              >
                <span>{range?.to ? fmtShort(range.to) : "Aggiungi data"}</span>
                {(range?.from || range?.to) && (
                  <X
                    className="h-3.5 w-3.5 text-[#636E72] hover:text-[#2D3436]"
                    onClick={clearDates}
                  />
                )}
              </div>
            </button>
          </div>

          {/* Guests row */}
          <div className="border-t border-[#BDBDBD] px-3 py-3 bg-white">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#636E72] mb-1">
              Ospiti
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#2D3436]">
                <Users className="h-4 w-4 text-[#636E72]" />
                <span>
                  {guests} {guests === 1 ? "ospite" : "ospiti"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  disabled={guests <= 1}
                  className="w-6 h-6 rounded-full border border-[#BDBDBD] flex items-center justify-center text-[#2D3436] disabled:opacity-30 hover:border-[#2D3436] transition-colors text-sm font-medium"
                >
                  −
                </button>
                <span className="text-sm font-medium w-4 text-center">
                  {guests}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setGuests((g) => Math.min(property.guests_max, g + 1))
                  }
                  disabled={guests >= property.guests_max}
                  className="w-6 h-6 rounded-full border border-[#BDBDBD] flex items-center justify-center text-[#2D3436] disabled:opacity-30 hover:border-[#2D3436] transition-colors text-sm font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Min nights warning */}
        {minNightsWarning && (
          <div className="mx-4 mt-2 text-xs text-[#C2714F] bg-[#C2714F]/10 px-3 py-2 rounded-lg">
            Soggiorno minimo: {minNights}{" "}
            {minNights === 1 ? "notte" : "notti"}. Seleziona un periodo più
            lungo.
          </div>
        )}

        {/* Hint */}
        {!calendarOpen && !range?.from && (
          <p className="text-center text-xs text-[#636E72] mt-3 px-6">
            Seleziona le date per verificare la disponibilità
          </p>
        )}
        {calendarOpen && activeField === "checkin" && (
          <p className="text-center text-xs text-[#4A90A4] mt-3 px-6">
            Seleziona la data di check-in
          </p>
        )}
        {calendarOpen && activeField === "checkout" && (
          <p className="text-center text-xs text-[#4A90A4] mt-3 px-6">
            Ora seleziona la data di check-out
          </p>
        )}

        {/* CTA / Booking form */}
        <div className="px-4 py-4">
          {!showForm ? (
            <button
              type="button"
              onClick={() => {
                if (!range?.from || !range?.to) {
                  setActiveField("checkin");
                } else {
                  setShowForm(true);
                }
              }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 shadow-md"
              style={{
                background: "linear-gradient(135deg, #4A90A4 0%, #3A7A8E 100%)",
                boxShadow: "0 4px 14px rgba(74,144,164,0.35)",
              }}
            >
              {range?.from && range?.to
                ? "Richiedi prenotazione"
                : "Verifica disponibilità"}
            </button>
          ) : (
            <div className="space-y-3">
              {/* Selected dates summary */}
              {range?.from && range?.to && (
                <div className="text-xs text-[#636E72] bg-[#F0EBE3] rounded-lg px-3 py-2 flex justify-between">
                  <span>
                    {fmt(range.from)} → {fmt(range.to)}
                  </span>
                  <span className="font-medium">
                    {nights} {nights === 1 ? "notte" : "notti"}
                  </span>
                </div>
              )}
              <BookingForm
                property={property}
                checkIn={range?.from ?? null}
                checkOut={range?.to ?? null}
                onDatesSet={(from, to) => setRange({ from, to })}
              />
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-[#636E72] hover:text-[#2D3436] underline underline-offset-2 w-full text-center"
              >
                ← Torna indietro
              </button>
            </div>
          )}
        </div>

        {/* No-payment note */}
        {!showForm && (
          <p className="text-center text-xs text-[#636E72] pb-4 px-4">
            Nessun pagamento adesso · Risposta entro 24h
          </p>
        )}
      </div>

      {/* ── Calendar popup ── */}
      {calendarOpen && (
        <div
          className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E0D8CC] shadow-2xl z-50 p-4"
          style={{ minWidth: "320px" }}
        >
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#2D3436]">
              {activeField === "checkin"
                ? "Seleziona check-in"
                : "Seleziona check-out"}
            </p>
            <button
              type="button"
              onClick={() => setActiveField(null)}
              className="p-1 rounded-full hover:bg-[#F0EBE3] transition-colors"
            >
              <X className="h-4 w-4 text-[#636E72]" />
            </button>
          </div>

          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={disabledMatcher}
            locale={it}
            numberOfMonths={1}
            showOutsideDays={false}
            components={{
              PreviousMonthButton: ({ ...props }) => (
                <button
                  {...props}
                  className="absolute left-0 h-7 w-7 flex items-center justify-center rounded-full border border-[#E0D8CC] hover:border-[#2D3436] transition-colors bg-white shadow-sm"
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-[#2D3436]" />
                </button>
              ),
              NextMonthButton: ({ ...props }) => (
                <button
                  {...props}
                  className="absolute right-0 h-7 w-7 flex items-center justify-center rounded-full border border-[#E0D8CC] hover:border-[#2D3436] transition-colors bg-white shadow-sm"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-[#2D3436]" />
                </button>
              ),
            }}
            classNames={{
              root: "w-full",
              months: "flex flex-col gap-4",
              month: "flex-1",
              month_caption: "flex justify-center relative items-center h-8 mb-1",
              caption_label: "text-sm font-semibold text-[#2D3436] capitalize",
              nav: "",
              month_grid: "w-full border-collapse",
              weekdays: "flex mb-1",
              weekday:
                "flex-1 text-center text-[11px] font-medium text-[#636E72] uppercase py-1",
              week: "flex",
              day: "flex-1 aspect-square p-0 relative",
              day_button:
                "w-full h-full flex items-center justify-center text-sm rounded-full transition-all duration-150 hover:bg-[#E8DCC8] focus:outline-none cursor-pointer",
              selected: "",
              range_start:
                "bg-[#2D3436] text-white rounded-r-none rounded-l-full hover:bg-[#2D3436]",
              range_end:
                "bg-[#2D3436] text-white rounded-l-none rounded-r-full hover:bg-[#2D3436]",
              range_middle:
                "bg-[#E8DCC8] rounded-none text-[#2D3436] hover:bg-[#DDD4C0]",
              today: "font-bold text-[#4A90A4]",
              outside: "opacity-0 pointer-events-none",
              disabled:
                "text-[#C2714F] line-through opacity-40 cursor-not-allowed hover:bg-transparent",
              hidden: "invisible",
            }}
          />

          {minNights > 1 && (
            <p className="text-xs text-center text-[#636E72] mt-3 border-t border-[#E0D8CC] pt-3">
              Soggiorno minimo: {minNights} notti
            </p>
          )}
        </div>
      )}
    </div>
  );
}
