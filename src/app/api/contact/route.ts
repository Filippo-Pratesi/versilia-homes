import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getResend, EMAIL_FROM } from '@/lib/resend';

const contactSchema = z.object({
  name: z.string().min(1, 'Il nome è obbligatorio'),
  email: z.string().email('Email non valida'),
  subject: z.string().min(1, "L'oggetto è obbligatorio"),
  message: z.string().min(1, 'Il messaggio è obbligatorio').max(2000, 'Il messaggio non può superare i 2000 caratteri'),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Richiesta non valida — JSON malformato' },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dati non validi', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2D3436;">
      <h2 style="color: #4A90A4; border-bottom: 2px solid #E8DCC8; padding-bottom: 12px;">
        Nuovo messaggio dal sito Viareggio Homes
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px 0; color: #636E72; width: 120px; vertical-align: top; font-weight: bold;">Nome:</td>
          <td style="padding: 10px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #636E72; vertical-align: top; font-weight: bold;">Email:</td>
          <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #4A90A4;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #636E72; vertical-align: top; font-weight: bold;">Oggetto:</td>
          <td style="padding: 10px 0;">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #636E72; vertical-align: top; font-weight: bold;">Messaggio:</td>
          <td style="padding: 10px 0; white-space: pre-wrap;">${message}</td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #E8DCC8; margin: 24px 0;" />
      <p style="font-size: 12px; color: #636E72;">
        Risposta suggerita: <a href="mailto:${email}" style="color: #4A90A4;">${email}</a>
      </p>
    </div>
  `;

  try {
    const resendClient = getResend();
    if (resendClient) {
      await resendClient.emails.send({
        from: EMAIL_FROM,
        to: 'prenotazioni@viareggiohomes.it',
        subject: `[Contatto] ${subject} — da ${name}`,
        html,
      });
    } else {
      console.warn('[contact] Email skipped — RESEND_API_KEY not set');
    }
  } catch (emailErr) {
    console.error('[contact] Failed to send contact email:', emailErr);
    return NextResponse.json(
      { error: 'Errore nell\'invio dell\'email. Riprova più tardi.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
