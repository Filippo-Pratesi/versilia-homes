"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { it } from "date-fns/locale";
import { startOfDay, parseISO, format, differenceInCalendarDays } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "react-day-picker/style.css";

interface AvailabilityCalendarProps {
  blockedDates: string[]; // YYYY-MM-DD
  onRangeSelect: (from: Date, to: Date) => void;
  minNights?: number;
  numberOfMonths?: number;
}

export function AvailabilityCalendar({
  blockedDates,
  onRangeSelect,
  minNights = 1,
  numberOfMonths = 2,
}: AvailabilityCalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [minNightsWarning, setMinNightsWarning] = useState(false);
  const today = startOfDay(new Date());

  const disabledDates = blockedDates
    .map((d) => {
      try { return parseISO(d); } catch { return null; }
    })
    .filter((d): d is Date => d !== null);

  const disabledMatcher = [{ before: today }, ...disabledDates];

  const handleSelect = (selected: DateRange | undefined) => {
    setMinNightsWarning(false);
    setRange(selected);

    if (selected?.from && selected?.to) {
      const nights = differenceInCalendarDays(selected.to, selected.from);
      if (nights < minNights) {
        setMinNightsWarning(true);
        return;
      }
      onRangeSelect(selected.from, selected.to);
    }
  };

  const clearDates = () => {
    setRange(undefined);
    setMinNightsWarning(false);
  };

  const nights =
    range?.from && range?.to
      ? differenceInCalendarDays(range.to, range.from)
      : null;

  const formatDate = (d: Date) =>
    format(d, "d MMM", { locale: it });

  return (
    <div className="w-full">
      {/* Header row: selected dates */}
      <div className="flex items-stretch gap-0 mb-4 border border-[#2D3436] rounded-xl overflow-hidden text-sm">
        {/* Check-in */}
        <div
          className={`flex-1 px-4 py-3 cursor-pointer transition-colors ${
            range?.from ? "bg-white" : "bg-[#FAFAF8]"
          } ${!range?.from ? "border-r border-[#2D3436]" : "border-r border-[#2D3436]"}`}
        >
          <div className="text-[10px] font-semibold tracking-widest uppercase text-[#636E72] mb-0.5">
            Check-in
          </div>
          <div className={`font-medium ${range?.from ? "text-[#2D3436]" : "text-[#BDBDBD]"}`}>
            {range?.from ? formatDate(range.from) : "Aggiungi data"}
          </div>
        </div>

        {/* Check-out */}
        <div
          className={`flex-1 px-4 py-3 cursor-pointer transition-colors ${
            range?.to ? "bg-white" : "bg-[#FAFAF8]"
          }`}
        >
          <div className="text-[10px] font-semibold tracking-widest uppercase text-[#636E72] mb-0.5">
            Check-out
          </div>
          <div className={`font-medium ${range?.to ? "text-[#2D3436]" : "text-[#BDBDBD]"}`}>
            {range?.to ? formatDate(range.to) : "Aggiungi data"}
          </div>
        </div>

        {/* Clear button */}
        {(range?.from || range?.to) && (
          <button
            onClick={clearDates}
            className="px-3 flex items-center justify-center text-[#636E72] hover:text-[#2D3436] border-l border-[#2D3436] transition-colors"
            aria-label="Cancella date"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nights summary */}
      {nights !== null && nights > 0 && (
        <div className="mb-3 text-sm text-center text-[#4A90A4] font-medium">
          {nights} {nights === 1 ? "notte" : "notti"} selezionate
        </div>
      )}

      {/* Min nights warning */}
      {minNightsWarning && (
        <div className="mb-3 text-sm text-[#C2714F] bg-[#C2714F]/10 px-3 py-2 rounded-lg text-center">
          Soggiorno minimo: {minNights} {minNights === 1 ? "notte" : "notti"}
        </div>
      )}

      {/* Hint when no from selected */}
      {!range?.from && (
        <p className="mb-3 text-xs text-center text-[#636E72]">
          Seleziona la data di check-in
        </p>
      )}
      {range?.from && !range?.to && (
        <p className="mb-3 text-xs text-center text-[#636E72]">
          Ora seleziona la data di check-out
        </p>
      )}

      {/* Calendar */}
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={disabledMatcher}
        locale={it}
        numberOfMonths={numberOfMonths}
        pagedNavigation
        showOutsideDays={false}
        components={{
          PreviousMonthButton: ({ ...props }) => (
            <button
              {...props}
              className="absolute left-0 h-8 w-8 flex items-center justify-center rounded-full border border-[#E0D8CC] hover:border-[#2D3436] transition-colors bg-white shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 text-[#2D3436]" />
            </button>
          ),
          NextMonthButton: ({ ...props }) => (
            <button
              {...props}
              className="absolute right-0 h-8 w-8 flex items-center justify-center rounded-full border border-[#E0D8CC] hover:border-[#2D3436] transition-colors bg-white shadow-sm"
            >
              <ChevronRight className="h-4 w-4 text-[#2D3436]" />
            </button>
          ),
        }}
        classNames={{
          root: "w-full rdp-viareggio",
          months: `flex ${numberOfMonths === 2 ? "flex-col sm:flex-row" : "flex-col"} gap-6`,
          month: "flex-1 min-w-0",
          month_caption: "flex justify-center relative items-center h-10 mb-2",
          caption_label: "text-sm font-semibold text-[#2D3436] capitalize",
          nav: "",
          month_grid: "w-full border-collapse",
          weekdays: "flex mb-1",
          weekday: "flex-1 text-center text-xs font-medium text-[#636E72] uppercase py-1",
          week: "flex",
          day: "flex-1 aspect-square p-0 relative",
          day_button:
            "w-full h-full flex items-center justify-center text-sm font-normal rounded-full transition-all duration-150 hover:bg-[#E8DCC8] focus:outline-none focus:ring-2 focus:ring-[#4A90A4] focus:ring-offset-1 cursor-pointer",
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

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-[#636E72] justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#2D3436] inline-block" />
          Check-in / out
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#E8DCC8] inline-block" />
          Soggiorno
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block line-through text-[#C2714F] font-medium leading-none">12</span>
          Non disponibile
        </div>
      </div>
    </div>
  );
}
