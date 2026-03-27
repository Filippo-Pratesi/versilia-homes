"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Trash2, Star, ChevronUp, ChevronDown, Upload } from "lucide-react";
import Image from "next/image";

type Photo = {
  id: string;
  property_id: string;
  storage_path: string;
  url: string;
  alt_text: string | null;
  sort_order: number | null;
  is_cover: boolean | null;
};

type PhotoManagerProps = {
  propertyId: string;
};

export function PhotoManager({ propertyId }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingCoverId, setSettingCoverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/photos`);
      if (!res.ok) throw new Error("Errore nel caricamento");
      const data = await res.json();
      setPhotos(data);
    } catch {
      toast.error("Impossibile caricare le foto.");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("property_id", propertyId);

        const res = await fetch(`/api/admin/properties/${propertyId}/photos`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Errore sconosciuto");
        }

        successCount++;
      } catch (err) {
        toast.error(`Errore caricamento ${file.name}: ${(err as Error).message}`);
      }
    }

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? "Foto caricata con successo."
          : `${successCount} foto caricate con successo.`
      );
      fetchPhotos();
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(photoId: string) {
    setDeletingId(photoId);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/photos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });

      if (!res.ok) throw new Error("Errore nell'eliminazione");

      toast.success("Foto eliminata.");
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch {
      toast.error("Errore durante l'eliminazione della foto.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetCover(photoId: string) {
    setSettingCoverId(photoId);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/photos/cover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });

      if (!res.ok) {
        toast.info("Funzione cover non ancora disponibile — aggiorna tramite database.");
        return;
      }

      setPhotos((prev) =>
        prev.map((p) => ({ ...p, is_cover: p.id === photoId }))
      );
      toast.success("Foto impostata come copertina.");
    } catch {
      toast.error("Errore durante l'impostazione della copertina.");
    } finally {
      setSettingCoverId(null);
    }
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const newPhotos = [...photos];
    [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
    setPhotos(newPhotos);
  }

  function handleMoveDown(index: number) {
    if (index === photos.length - 1) return;
    const newPhotos = [...photos];
    [newPhotos[index], newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]];
    setPhotos(newPhotos);
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
      {/* Upload Area */}
      <div className="border-2 border-dashed border-[#E8DCC8] rounded-xl p-6 text-center">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-3">
          Carica una o più foto della proprietà
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          id="photo-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border-[#4A90A4] text-[#4A90A4] hover:bg-[#4A90A4] hover:text-white"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {uploading ? "Caricamento..." : "Seleziona Foto"}
        </Button>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Nessuna foto caricata ancora.
        </p>
      ) : (
        <div className="space-y-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="flex items-center gap-4 p-3 border border-[#E8DCC8] rounded-lg bg-white"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={photo.url}
                  alt={photo.alt_text ?? "Foto proprietà"}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              {/* Alt Text */}
              <div className="flex-1 min-w-0">
                <Input
                  value={photo.alt_text ?? ""}
                  onChange={(e) => {
                    const newAlt = e.target.value;
                    setPhotos((prev) =>
                      prev.map((p) =>
                        p.id === photo.id ? { ...p, alt_text: newAlt } : p
                      )
                    );
                  }}
                  placeholder="Testo alternativo (es. Vista terrazza)"
                  className="text-sm h-8"
                />
              </div>

              {/* Cover Badge */}
              {photo.is_cover && (
                <Badge className="bg-[#4A90A4] text-white flex-shrink-0">
                  Copertina
                </Badge>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="h-7 w-7 p-0"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === photos.length - 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetCover(photo.id)}
                  disabled={settingCoverId === photo.id || !!photo.is_cover}
                  className="h-7 w-7 p-0 text-amber-500 hover:text-amber-600"
                  title="Imposta come copertina"
                >
                  {settingCoverId === photo.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Star className="w-4 h-4" fill={photo.is_cover ? "currentColor" : "none"} />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-[#C2714F]"
                  title="Elimina foto"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
