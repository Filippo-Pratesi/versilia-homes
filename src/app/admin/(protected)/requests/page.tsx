"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

type PropertyRef = {
  id: string;
  title: string;
};

type BookingRequestRow = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  guests_count: number;
  check_in: string;
  check_out: string;
  estimated_price: number | null;
  status: string | null;
  created_at: string | null;
  message: string | null;
  property_id: string;
  properties: PropertyRef | null;
};

type PropertyOption = {
  id: string;
  title: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Tutte" },
  { value: "pending", label: "In attesa" },
  { value: "confirmed", label: "Confermate" },
  { value: "declined", label: "Rifiutate" },
  { value: "expired", label: "Scadute" },
];

function statusBadge(status: string | null) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
          In attesa
        </Badge>
      );
    case "confirmed":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
          Confermata
        </Badge>
      );
    case "declined":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
          Rifiutata
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200">
          Scaduta
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">{status ?? "—"}</Badge>
      );
  }
}

function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: it });
  } catch {
    return dateStr;
  }
}

function countNights(checkIn: string, checkOut: string) {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-4 border-b border-[#E8DCC8] last:border-0">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-40 ml-auto" />
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<BookingRequestRow[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState("all");

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/properties");
      if (!res.ok) return;
      const data = await res.json();
      setProperties(
        (data as Array<{ id: string; title: string }>).map((p) => ({
          id: p.id,
          title: p.title,
        }))
      );
    } catch {
      // Non-critical — filters will still work without property list
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (selectedProperty !== "all") params.set("property_id", selectedProperty);

      const res = await fetch(`/api/admin/requests?${params.toString()}`);
      if (!res.ok) throw new Error("Errore nel caricamento");
      const data = await res.json();
      setRequests(data);
    } catch {
      toast.error("Impossibile caricare le richieste.");
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedProperty]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-semibold text-[#2D3436]">
              Richieste di Prenotazione
            </h1>
            {!loading && (
              <Badge className="bg-[#4A90A4]/10 text-[#4A90A4] hover:bg-[#4A90A4]/10 text-sm px-2.5 py-0.5">
                {requests.length}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Gestisci le richieste di prenotazione degli ospiti
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#2D3436]">Stato:</span>
          <Select
            value={selectedStatus}
            onValueChange={(value: string | null) => setSelectedStatus(value ?? "all")}
          >
            <SelectTrigger className="w-40 h-9 border-[#E8DCC8] bg-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#2D3436]">Proprietà:</span>
          <Select
            value={selectedProperty}
            onValueChange={(value: string | null) => setSelectedProperty(value ?? "all")}
          >
            <SelectTrigger className="w-52 h-9 border-[#E8DCC8] bg-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le proprietà</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="border border-[#E8DCC8]">
        <CardContent className="p-0">
          {loading ? (
            <LoadingSkeleton />
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="p-4 rounded-full bg-[#E8DCC8]/50">
                <MessageSquare className="w-8 h-8 text-[#4A90A4]/60" />
              </div>
              <p className="text-[#2D3436] font-medium">Nessuna richiesta trovata</p>
              <p className="text-muted-foreground text-sm">
                Non ci sono richieste che corrispondono ai filtri selezionati.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8DCC8] bg-[#FAFAF8]">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      Ospite
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      Proprietà
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      Ospiti
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      Prezzo stimato
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      Stato
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      Data richiesta
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground whitespace-nowrap">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-[#E8DCC8] last:border-0 hover:bg-[#FAFAF8] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#2D3436]">{req.guest_name}</div>
                        <div className="text-xs text-muted-foreground">{req.guest_email}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {req.properties?.title ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        <span>{formatDate(req.check_in)}</span>
                        <span className="mx-1.5 text-gray-400">→</span>
                        <span>{formatDate(req.check_out)}</span>
                        <div className="text-xs text-gray-400">
                          {countNights(req.check_in, req.check_out)} notti
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-center">
                        {req.guests_count}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {req.estimated_price != null
                          ? `€ ${req.estimated_price.toLocaleString("it-IT")}`
                          : "—"}
                      </td>
                      <td className="py-3 px-4">{statusBadge(req.status)}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {req.created_at ? formatDate(req.created_at) : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/admin/requests/${req.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-[#E8DCC8] hover:border-[#4A90A4] hover:text-[#4A90A4]"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Dettagli
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
