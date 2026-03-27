"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { it } from "date-fns/locale";
import { startOfDay, parseISO } from "date-fns";
import "react-day-picker/style.css";

interface AvailabilityCalendarProps {
  blockedDates: string[]; // YYYY-MM-DD
  onRangeSelect: (from: Date, to: Date) => void;
  minNights?: number;
}

export function AvailabilityCalendar({
  blockedDates,
  onRangeSelect,
  minNights = 1,
}: AvailabilityCalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [minNightsWarning, setMinNightsWarning] = useState(false);

  const today = startOfDay(new Date());

  // Parse blocked dates into Date objects
  const disabledDates = blockedDates
    .map((d) => {
      try {
        return parseISO(d);
      } catch {
        return null;
      }
    })
    .filter((d): d is Date => d !== null);

  // Disable past dates and today as well
  const disabledMatcher = [
    { before: today },
    ...disabledDates,
  ];

  const handleSelect = (selected: DateRange | undefined) => {
    setMinNightsWarning(false);
    setRange(selected);

    if (selected?.from && selected?.to) {
      const nights = Math.round(
        (selected.to.getTime() - selected.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (nights < minNights) {
        setMinNightsWarning(true);
        return;
      }
      onRangeSelect(selected.from, selected.to);
    }
  };

  return (
    <div className="rdp-public">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={disabledMatcher}
        locale={it}
        numberOfMonths={2}
        pagedNavigation
        showOutsideDays={false}
        modifiersClassNames={{
          selected: "rdp-day_selected",
          range_middle: "rdp-day_range_middle",
          disabled: "rdp-day_disabled",
          today: "font-bold underline",
        }}
        classNames={{
          root: "text-sm",
          months: "flex flex-col sm:flex-row gap-4",
          month: "space-y-3",
          caption: "flex justify-center relative items-center mb-1",
          caption_label: "font-semibold text-[#2D3436]",
          nav: "space-x-1 flex items-center",
          nav_button:
            "h-7 w-7 bg-transparent p-0 hover:bg-[#E8DCC8] rounded-full flex items-center justify-center transition-colors",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-[#636E72] rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-1",
          cell: "h-8 w-8 text-center text-sm p-0 relative",
          day: "h-8 w-8 p-0 font-normal rounded-full hover:bg-[#E8DCC8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A90A4]",
          day_selected: "bg-[#4A90A4] text-white hover:bg-[#3A7A8E]",
          day_today: "font-bold",
          day_outside: "opacity-30",
          day_disabled: "text-[#C2714F] opacity-50 line-through cursor-not-allowed",
          day_range_middle: "bg-[#4A90A4]/15 rounded-none",
          day_range_start: "bg-[#4A90A4] text-white rounded-l-full",
          day_range_end: "bg-[#4A90A4] text-white rounded-r-full",
        }}
      />

      {minNightsWarning && (
        <p className="mt-3 text-sm text-[#C2714F] bg-[#C2714F]/10 px-3 py-2 rounded-lg">
          Soggiorno minimo: {minNights} {minNights === 1 ? "notte" : "notti"}.
          Seleziona un periodo più lungo.
        </p>
      )}

      {range?.from && !range?.to && (
        <p className="mt-3 text-sm text-[#636E72] text-center">
          Seleziona la data di check-out
        </p>
      )}
    </div>
  );
}
