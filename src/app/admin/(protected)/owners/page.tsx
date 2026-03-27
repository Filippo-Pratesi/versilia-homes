"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

type Owner = {
  id: string;
  name: string;
  email: string;
  whatsapp_number: string | null;
  created_at: string | null;
};

type FormData = {
  name: string;
  email: string;
  whatsapp_number: string;
};

const emptyForm: FormData = { name: "", email: "", whatsapp_number: "" };

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOwners = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/owners");
      if (!res.ok) throw new Error("Errore nel caricamento");
      const data = await res.json();
      setOwners(data);
    } catch {
      toast.error("Impossibile caricare i proprietari.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  function openCreateDialog() {
    setEditingOwner(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(owner: Owner) {
    setEditingOwner(owner);
    setFormData({
      name: owner.name,
      email: owner.email,
      whatsapp_number: owner.whatsapp_number ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        whatsapp_number: formData.whatsapp_number || null,
      };

      const url = editingOwner
        ? `/api/admin/owners/${editingOwner.id}`
        : "/api/admin/owners";

      const res = await fetch(url, {
        method: editingOwner ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Errore sconosciuto");
      }

      toast.success(
        editingOwner
          ? "Proprietario aggiornato con successo."
          : "Proprietario creato con successo."
      );
      setDialogOpen(false);
      fetchOwners();
    } catch (err) {
      toast.error((err as Error).message ?? "Errore durante il salvataggio.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/owners/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Errore sconosciuto");
      }

      toast.success("Proprietario eliminato.");
      setDeleteConfirmId(null);
      fetchOwners();
    } catch (err) {
      toast.error((err as Error).message ?? "Errore durante l'eliminazione.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-[#2D3436]">
            Proprietari
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestisci i proprietari degli appartamenti
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-[#4A90A4] hover:bg-[#3A7A8E] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Aggiungi Proprietario
        </Button>
      </div>

      <Card className="border border-[#E8DCC8]">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#4A90A4]" />
            </div>
          ) : owners.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nessun proprietario ancora. Aggiungine uno!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8DCC8] bg-[#FAFAF8]">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">WhatsApp</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map((owner) => (
                    <tr
                      key={owner.id}
                      className="border-b border-[#E8DCC8] last:border-0 hover:bg-[#FAFAF8]"
                    >
                      <td className="py-3 px-4 font-medium text-[#2D3436]">
                        {owner.name}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {owner.email}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {owner.whatsapp_number ?? "—"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(owner)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-[#2D3436]"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(owner.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-[#C2714F]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOwner ? "Modifica Proprietario" : "Aggiungi Proprietario"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Mario Rossi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="mario@esempio.it"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Numero WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    whatsapp_number: e.target.value,
                  }))
                }
                placeholder="+39 333 1234567"
              />
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
                {editingOwner ? "Salva Modifiche" : "Crea Proprietario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Sei sicuro di voler eliminare questo proprietario? L&apos;operazione non può essere annullata.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleting}
            >
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleting}
              className="bg-[#C2714F] hover:bg-[#A85D3F]"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
