"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type SyncResult = {
  ok: boolean;
  total?: number;
  succeeded?: number;
  failed?: number;
  error?: string;
};

export function SyncButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<SyncResult | null>(null);

  const handleSync = async () => {
    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data: SyncResult = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setResult(data);
      } else {
        setStatus("success");
        setResult(data);
        // Reset to idle after 5s
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setResult({ ok: false, error: "Errore di rete. Riprova." });
    }
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        onClick={handleSync}
        disabled={status === "loading"}
        size="sm"
        className="gap-2 bg-[#4A90A4] hover:bg-[#3A7A8E] text-white"
      >
        <RefreshCw className={`w-4 h-4 ${status === "loading" ? "animate-spin" : ""}`} />
        {status === "loading" ? "Sincronizzando..." : "Sincronizza ora"}
      </Button>

      {status === "success" && result && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>
            Completato: {result.succeeded}/{result.total} proprietà aggiornate
          </span>
        </div>
      )}

      {status === "error" && result && (
        <div className="flex items-center gap-1.5 text-xs text-[#C2714F]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{result.error ?? "Errore durante la sincronizzazione"}</span>
        </div>
      )}
    </div>
  );
}
