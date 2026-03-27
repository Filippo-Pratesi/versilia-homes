"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Waves } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Credenziali non valide. Riprova.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Errore durante l'accesso. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <Card className="w-full max-w-md shadow-lg border border-[#E8DCC8]">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="w-6 h-6 text-[#4A90A4]" />
            <span className="font-display text-2xl font-semibold text-[#2D3436]">
              Viareggio Homes
            </span>
          </div>
          <CardTitle className="text-xl text-[#2D3436] font-sans font-medium">
            Accesso Amministratore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#2D3436]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@versiliahomes.it"
                required
                autoComplete="email"
                className="border-[#E8DCC8] focus:border-[#4A90A4] focus:ring-[#4A90A4]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#2D3436]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="border-[#E8DCC8] focus:border-[#4A90A4] focus:ring-[#4A90A4]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A90A4] hover:bg-[#3A7A8E] text-white font-medium py-2.5 transition-colors"
            >
              {loading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
