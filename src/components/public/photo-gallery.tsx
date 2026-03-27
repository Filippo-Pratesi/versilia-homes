"use client";

import { useState } from "react";
import Image from "next/image";
import { Waves, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PropertyPhoto } from "@/types";

interface PhotoGalleryProps {
  photos: PropertyPhoto[];
  propertyTitle: string;
}

export function PhotoGallery({ photos, propertyTitle }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="w-full h-72 bg-[#F0EBE3] rounded-2xl flex flex-col items-center justify-center gap-3 text-[#636E72]">
        <Waves className="h-12 w-12 opacity-30 text-[#4A90A4]" />
        <p className="text-sm opacity-60">Nessuna foto disponibile</p>
      </div>
    );
  }

  const sortedPhotos = [...photos].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    return (a.sort_order ?? 99) - (b.sort_order ?? 99);
  });

  const coverPhoto = sortedPhotos[0];
  const thumbnails = sortedPhotos.slice(1, 5);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sortedPhotos.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === sortedPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  return (
    <>
      {/* Desktop gallery: cover + 4 thumbnails */}
      <div className="hidden md:grid grid-cols-2 gap-2 rounded-2xl overflow-hidden h-[480px]">
        {/* Cover */}
        <button
          className="relative overflow-hidden hover:opacity-95 transition-opacity"
          onClick={() => openLightbox(0)}
          aria-label={`Apri galleria foto: ${coverPhoto.alt_text ?? propertyTitle}`}
        >
          <Image
            src={coverPhoto.url}
            alt={coverPhoto.alt_text ?? propertyTitle}
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
        </button>

        {/* Thumbnails 2x2 */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {thumbnails.map((photo, i) => (
            <button
              key={photo.id}
              className="relative overflow-hidden hover:opacity-95 transition-opacity"
              onClick={() => openLightbox(i + 1)}
              aria-label={`Foto ${i + 2}: ${photo.alt_text ?? propertyTitle}`}
            >
              <Image
                src={photo.url}
                alt={photo.alt_text ?? propertyTitle}
                fill
                className="object-cover"
                sizes="25vw"
              />
              {/* "Mostra tutte" overlay on last thumbnail if more exist */}
              {i === 3 && sortedPhotos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    +{sortedPhotos.length - 5} foto
                  </span>
                </div>
              )}
            </button>
          ))}
          {/* Fill empty slots */}
          {Array.from({ length: Math.max(0, 4 - thumbnails.length) }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-[#F0EBE3] flex items-center justify-center"
              >
                <Waves className="h-6 w-6 opacity-20 text-[#4A90A4]" />
              </div>
            )
          )}
        </div>
      </div>

      {/* Mobile: horizontal scroll gallery */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto gallery-scroll pb-2 -mx-4 px-4">
          {sortedPhotos.map((photo, i) => (
            <button
              key={photo.id}
              className="relative flex-shrink-0 w-[85vw] aspect-[4/3] rounded-xl overflow-hidden"
              onClick={() => openLightbox(i)}
              aria-label={`Foto ${i + 1}`}
            >
              <Image
                src={photo.url}
                alt={photo.alt_text ?? propertyTitle}
                fill
                className="object-cover"
                sizes="85vw"
                priority={i === 0}
              />
            </button>
          ))}
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {sortedPhotos.slice(0, 8).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#4A90A4]/30"
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-5xl w-full bg-black/95 border-0 p-0 rounded-2xl overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <div className="relative">
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Chiudi galleria"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/40 rounded-full text-white text-xs">
              {currentIndex + 1} / {sortedPhotos.length}
            </div>

            {/* Image */}
            <div className="relative h-[70vh]">
              <Image
                src={sortedPhotos[currentIndex].url}
                alt={sortedPhotos[currentIndex].alt_text ?? propertyTitle}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            {/* Navigation arrows */}
            {sortedPhotos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/20 rounded-full h-10 w-10"
                  onClick={goToPrev}
                  aria-label="Foto precedente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/20 rounded-full h-10 w-10"
                  onClick={goToNext}
                  aria-label="Foto successiva"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Caption */}
            {sortedPhotos[currentIndex].alt_text && (
              <div className="py-3 px-6 text-center text-white/70 text-sm bg-black/60">
                {sortedPhotos[currentIndex].alt_text}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
