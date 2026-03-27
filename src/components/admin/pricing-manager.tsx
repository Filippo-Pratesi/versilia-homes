"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

type PricingRule = {
  id: string;
  property_id: string;
  label: string;
  price_per_night: number;
  date_from: string | null;
  date_to: string | null;
  min_nights: number | null;
  is_default: boolean | null;
  created_at: string | null;
};

type PricingManagerProps = {
  propertyId: string;
};

type FormData = {
  label: string;
  price_per_night: string;
  date_from: string;
  date_to: string;
  min_nights: string;
  is_default: boolean;
};

const emptyForm: FormData = {
  label: "",
  price_per_night: "",
  date_from: "",
  date_to: "",
  min_nights: "",
  is_default: false,
};

export function PricingManager({ propertyId }: PricingManagerProps) {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/pricing`);
      if (!res.ok) throw new Error("Errore nel caricamento");
      const data = await res.json();
      setRules(data);
    } catch {
      toast.error("Impossibile caricare le tariffe.");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  function openCreateDialog() {
    setEditingRule(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(rule: PricingRule) {
    setEditingRule(rule);
    setFormData({
      label: rule.label,
      price_per_night: rule.price_per_night.toString(),
      date_from: rule.date_from ?? "",
      date_to: rule.date_to ?? "",
      min_nights: rule.min_nights?.toString() ?? "",
      is_default: rule.is_default ?? false,
    });
    setDialogOpen(true);
  }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...(editingRule ? { id: editingRule.id } : {}),
        label: formData.label,
        price_per_night: parseFloat(formData.price_per_night),
        date_from: formData.date_from || null,
        date_to: formData.date_to || null,
        min_nights: formData.min_nights ? parseInt(formData.min_nights) : null,
        is_default: formData.is_default,
      };

      const res = await fetch(`/api/admin/properties/${propertyId}/pricing`, {
        method: editingRule ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Errore sconosciuto");
      }

      toast.success(
        editingRule
          ? "Tariffa aggiornata con successo."
          : "Tariffa creata con successo."
      );
      setDialogOpen(false);
      fetchRules();
    } catch (err) {
      toast.error((err as Error).message ?? "Errore durante il salvataggio.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(ruleId: string) {
    setDeletingId(ruleId);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/pricing`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId }),
      });

      if (!res.ok) throw new Error("Errore nell'eliminazione");

      toast.success("Tariffa eliminata.");
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    } catch {
      toast.error("Errore durante l'eliminazione della tariffa.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("it-IT");
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Gestisci le tariffe per notte di questa proprietà.
        </p>
        <Button
          onClick={openCreateDialog}
          className="bg-[#4A90A4] hover:bg-[#3A7A8E] text-white gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Aggiungi Tariffa
        </Button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-[#E8DCC8] rounded-xl">
          Nessuna tariffa definita ancora.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DCC8] bg-[#FAFAF8]">
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Etichetta</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">€/notte</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Dal</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Al</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Notti min</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Default</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-[#E8DCC8] last:border-0 hover:bg-[#FAFAF8]"
                >
                  <td className="py-3 px-3 font-medium text-[#2D3436]">{rule.label}</td>
                  <td className="py-3 px-3 text-[#2D3436]">
                    € {rule.price_per_night.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {formatDate(rule.date_from)}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {formatDate(rule.date_to)}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {rule.min_nights ?? "—"}
                  </td>
                  <td className="py-3 px-3">
                    {rule.is_default && (
                      <Badge className="bg-[#4A90A4]/10 text-[#4A90A4] hover:bg-[#4A90A4]/10">
                        Default
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(rule)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-[#2D3436]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(rule.id)}
                        disabled={deletingId === rule.id}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-[#C2714F]"
                      >
                        {deletingId === rule.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Modifica Tariffa" : "Aggiungi Tariffa"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rule-label">Etichetta *</Label>
              <Input
                id="rule-label"
                value={formData.label}
                onChange={(e) => update("label", e.target.value)}
                placeholder="Estate Alta Stagione"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_per_night">Prezzo per notte (€) *</Label>
              <Input
                id="price_per_night"
                type="number"
                min={0}
                step={0.01}
                value={formData.price_per_night}
                onChange={(e) => update("price_per_night", e.target.value)}
                placeholder="150"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_from">Dal</Label>
                <Input
                  id="date_from"
                  type="date"
                  value={formData.date_from}
                  onChange={(e) => update("date_from", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_to">Al</Label>
                <Input
                  id="date_to"
                  type="date"
                  value={formData.date_to}
                  onChange={(e) => update("date_to", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_nights">Notti minime</Label>
              <Input
                id="min_nights"
                type="number"
                min={1}
                value={formData.min_nights}
                onChange={(e) => update("min_nights", e.target.value)}
                placeholder="3"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="is_default"
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => update("is_default", e.target.checked)}
                className="w-4 h-4 accent-[#4A90A4]"
              />
              <Label htmlFor="is_default" className="cursor-pointer">
                Tariffa predefinita
              </Label>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#4A90A4] hover:bg-[#3A7A8E] text-white"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingRule ? "Salva Modifiche" : "Crea Tariffa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
