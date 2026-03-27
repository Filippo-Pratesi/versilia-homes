"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Loader2 } from "lucide-react";

type Owner = {
  id: string;
  name: string;
  email: string;
};

type Property = {
  id: string;
  title: string;
  slug: string;
  guests_max: number;
  is_active: boolean | null;
  sort_order: number | null;
  owners: Owner | null;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/properties");
      if (!res.ok) throw new Error("Errore nel caricamento");
      const data = await res.json();
      setProperties(data);
    } catch {
      toast.error("Impossibile caricare le proprietà.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  async function toggleActive(property: Property) {
    setTogglingId(property.id);
    try {
      const res = await fetch(`/api/admin/properties/${property.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !property.is_active }),
      });

      if (!res.ok) throw new Error("Errore nell'aggiornamento");

      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      toast.success(
        property.is_active
          ? "Proprietà disattivata."
          : "Proprietà attivata."
      );
    } catch {
      toast.error("Errore durante l'aggiornamento dello stato.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-[#2D3436]">
            Proprietà
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestisci gli appartamenti in affitto
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-[#4A90A4] hover:bg-[#3A7A8E] text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Aggiungi Proprietà
        </Link>
      </div>

      <Card className="border border-[#E8DCC8]">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#4A90A4]" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nessuna proprietà ancora. Aggiungine una!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8DCC8] bg-[#FAFAF8]">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Titolo</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Proprietario</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ospiti max</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stato</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b border-[#E8DCC8] last:border-0 hover:bg-[#FAFAF8]"
                    >
                      <td className="py-3 px-4 font-medium text-[#2D3436]">
                        <Link
                          href={`/admin/properties/${property.id}`}
                          className="hover:text-[#4A90A4] hover:underline"
                        >
                          {property.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {property.owners?.name ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {property.guests_max}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={property.is_active ? "default" : "secondary"}
                          className={
                            property.is_active
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : ""
                          }
                        >
                          {property.is_active ? "Attiva" : "Inattiva"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(property)}
                            disabled={togglingId === property.id}
                            className="text-xs h-7"
                          >
                            {togglingId === property.id ? (
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            ) : null}
                            {property.is_active ? "Disattiva" : "Attiva"}
                          </Button>
                          <Link
                            href={`/admin/properties/${property.id}`}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-[#2D3436] hover:bg-muted transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </div>
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
