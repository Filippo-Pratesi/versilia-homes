'use client';

import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data: { success?: boolean; error?: string } = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error ?? 'Errore nell\'invio. Riprova più tardi.');
        return;
      }

      setSuccess(true);
      setForm(EMPTY_FORM);
    } catch {
      toast.error('Errore di rete. Controlla la connessione e riprova.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-7 w-7 text-green-600" strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-[#2D3436]">Messaggio inviato!</p>
          <p className="text-sm text-[#636E72]">Ti risponderemo entro poche ore.</p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs text-[#4A90A4] hover:underline"
        >
          Invia un altro messaggio
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-[#2D3436] text-sm font-medium">
            Nome
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Il tuo nome"
            className="border-[#E8DCC8] focus-visible:ring-[#4A90A4] focus-visible:border-[#4A90A4]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[#2D3436] text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="tua@email.it"
            className="border-[#E8DCC8] focus-visible:ring-[#4A90A4] focus-visible:border-[#4A90A4]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-[#2D3436] text-sm font-medium">
          Oggetto
        </Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          required
          placeholder="Di cosa hai bisogno?"
          className="border-[#E8DCC8] focus-visible:ring-[#4A90A4] focus-visible:border-[#4A90A4]"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-[#2D3436] text-sm font-medium">
          Messaggio
        </Label>
        <Textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          maxLength={2000}
          placeholder="Scrivi qui il tuo messaggio..."
          className="min-h-[120px] border-[#E8DCC8] focus-visible:ring-[#4A90A4] focus-visible:border-[#4A90A4] resize-none"
        />
        <p className="text-xs text-[#636E72] text-right">
          {form.message.length}/2000
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4A90A4] hover:bg-[#3A7A8E] text-white transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Invio in corso…
          </>
        ) : (
          'Invia messaggio'
        )}
      </Button>
    </form>
  );
}
