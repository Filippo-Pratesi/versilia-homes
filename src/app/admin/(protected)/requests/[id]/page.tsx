"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  Users,
  MessageSquare,
  Home,
  Calendar,
  Euro,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

type OwnerRef = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

type PropertyRef = {
  id: string;
  title: string;
  location: string | null;
  address: string | null;
  owners: OwnerRef | null;
};

type BookingRequestDetail = {
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

function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr), "dd MMMM yyyy", { locale: it });
  } catch {
    return dateStr;
  }
}

function formatDateShort(dateStr: string) {
  try {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: it });
  } catch {
    return dateStr;
  }
}

function countNights(checkIn: string, checkOut: string) {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function StatusBadgeLarge({ status }: { status: string | null }) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-sm px-3 py-1">
          In attesa
        </Badge>
      );
    case "confirmed":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-sm px-3 py-1">
          Confermata
        </Badge>
      );
    case "declined":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 text-sm px-3 py-1">
          Rifiutata
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-sm px-3 py-1">
          Scaduta
        </Badge>
      );
    default:
      return <Badge variant="outline" className="text-sm px-3 py-1">{status ?? "—"}</Badge>;
  }
}

function buildWhatsAppUrl(phone: string, guestName: string) {
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, "");
  const text = encodeURIComponent(
    `Buongiorno ${guestName}, la contatto riguardo alla sua richiesta di prenotazione.`
  );
  return `https://wa.me/${cleanedPhone}?text=${text}`;
}

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [request, setRequest] = useState<BookingRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

  const fetchRequest = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests/${id}`);
      if (res.status === 404) {
        toast.error("Richiesta non trovata.");
        router.push("/admin/requests");
        return;
      }
      if (!res.ok) throw new Error("Errore nel caricamento");
      const data = await res.json();
      setRequest(data);
    } catch {
      toast.error("Impossibile caricare la richiesta.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  async function updateStatus(status: "confirmed" | "declined") {
    if (!request) return;
    setActionLoading(true);
    try {
      // Update status + trigger email notification via the status route
      const res = await fetch(`/api/admin/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Errore durante l'aggiornamento");
      }

      toast.success(
        status === "confirmed"
          ? "Prenotazione confermata con successo."
          : "Prenotazione rifiutata."
      );

      // Reload data
      await fetchRequest();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore durante l'operazione."
      );
    } finally {
      setActionLoading(false);
      setShowDeclineDialog(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <p className="text-muted-foreground">Richiesta non trovata.</p>
        <Link href="/admin/requests" className="text-[#4A90A4] hover:underline text-sm mt-2 inline-block">
          Torna alle richieste
        </Link>
      </div>
    );
  }

  const nights = countNights(request.check_in, request.check_out);
  const isPending = request.status === "pending";

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#2D3436] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna alle richieste
      </Link>

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-[#2D3436]">
            Richiesta di {request.guest_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Ricevuta il {request.created_at ? formatDate(request.created_at) : "—"}
          </p>
        </div>
        <StatusBadgeLarge status={request.status} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Guest details */}
        <Card className="border border-[#E8DCC8]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#2D3436]">
              <User className="w-4 h-4 text-[#4A90A4]" />
              Dati Ospite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Nome</p>
              <p className="font-medium text-[#2D3436]">{request.guest_name}</p>
            </div>

            <Separator className="bg-[#E8DCC8]" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                <a
                  href={`mailto:${request.guest_email}`}
                  className="text-[#4A90A4] hover:underline text-sm font-medium inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {request.guest_email}
                </a>
              </div>
            </div>

            {request.guest_phone && (
              <>
                <Separator className="bg-[#E8DCC8]" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Telefono</p>
                    <p className="text-sm font-medium text-[#2D3436] inline-flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {request.guest_phone}
                    </p>
                  </div>
                  <a
                    href={buildWhatsAppUrl(request.guest_phone, request.guest_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#25D366] hover:bg-[#1ebe5d] px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </>
            )}

            <Separator className="bg-[#E8DCC8]" />

            <div>
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Numero ospiti
              </p>
              <p className="font-medium text-[#2D3436]">
                {request.guests_count}{" "}
                {request.guests_count === 1 ? "persona" : "persone"}
              </p>
            </div>

            {request.message && (
              <>
                <Separator className="bg-[#E8DCC8]" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Messaggio
                  </p>
                  <p className="text-sm text-[#2D3436] bg-[#FAFAF8] rounded-lg p-3 border border-[#E8DCC8] leading-relaxed">
                    {request.message}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right: Booking details */}
        <div className="space-y-6">
          <Card className="border border-[#E8DCC8]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#2D3436]">
                <Home className="w-4 h-4 text-[#4A90A4]" />
                Dettagli Prenotazione
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Proprietà</p>
                {request.properties ? (
                  <Link
                    href={`/admin/properties/${request.property_id}`}
                    className="font-medium text-[#4A90A4] hover:underline"
                  >
                    {request.properties.title}
                  </Link>
                ) : (
                  <p className="font-medium text-[#2D3436]">—</p>
                )}
                {request.properties?.location && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {request.properties.location}
                  </p>
                )}
              </div>

              <Separator className="bg-[#E8DCC8]" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Check-in
                  </p>
                  <p className="font-medium text-[#2D3436]">
                    {formatDateShort(request.check_in)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Check-out
                  </p>
                  <p className="font-medium text-[#2D3436]">
                    {formatDateShort(request.check_out)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Durata</p>
                <p className="font-medium text-[#2D3436]">
                  {nights} {nights === 1 ? "notte" : "notti"}
                </p>
              </div>

              {request.estimated_price != null && (
                <>
                  <Separator className="bg-[#E8DCC8]" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                      <Euro className="w-3.5 h-3.5" />
                      Prezzo stimato
                    </p>
                    <p className="text-2xl font-semibold text-[#2D3436]">
                      € {request.estimated_price.toLocaleString("it-IT")}
                    </p>
                  </div>
                </>
              )}

              <Separator className="bg-[#E8DCC8]" />

              <div>
                <p className="text-xs text-muted-foreground mb-1">Stato richiesta</p>
                <StatusBadgeLarge status={request.status} />
                {request.created_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Ricevuta il {formatDate(request.created_at)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action buttons (only if pending) */}
          {isPending ? (
            <Card className="border border-[#E8DCC8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-[#2D3436]">
                  Azioni
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  disabled={actionLoading}
                  onClick={() => updateStatus("confirmed")}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Conferma
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 gap-2"
                  disabled={actionLoading}
                  onClick={() => setShowDeclineDialog(true)}
                >
                  <XCircle className="w-4 h-4" />
                  Rifiuta
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Decline confirmation dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rifiuta la richiesta</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler rifiutare la richiesta di{" "}
              <strong>{request.guest_name}</strong>? Questa azione non può essere
              annullata facilmente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeclineDialog(false)}
              disabled={actionLoading}
            >
              Annulla
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
              disabled={actionLoading}
              onClick={() => updateStatus("declined")}
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sì, rifiuta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
