"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/admin/property-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewPropertyPage() {
  const router = useRouter();

  function handleSuccess(id: string) {
    router.push(`/admin/properties/${id}`);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#2D3436] mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Torna alle proprietà
        </Link>
        <h1 className="text-3xl font-display font-semibold text-[#2D3436]">
          Nuova Proprietà
        </h1>
        <p className="text-muted-foreground mt-1">
          Aggiungi un nuovo appartamento al catalogo
        </p>
      </div>

      <div className="bg-white border border-[#E8DCC8] rounded-xl p-6">
        <PropertyForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
