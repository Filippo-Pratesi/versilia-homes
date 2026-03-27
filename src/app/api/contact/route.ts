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

  // Email to owner
  const ownerHtml = `
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
        Rispondi a: <a href="mailto:${email}" style="color: #4A90A4;">${email}</a>
      </p>
    </div>
  `;

  // Auto-reply to the sender
  const autoReplyHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2D3436;">
      <div style="text-align: center; padding: 32px 0 24px;">
        <p style="font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #4A90A4; margin: 0 0 8px;">
          Viareggio Homes
        </p>
        <h1 style="font-size: 28px; font-weight: 600; color: #2D3436; margin: 0;">
          Messaggio ricevuto
        </h1>
      </div>

      <div style="background: #F7F3EC; border-radius: 12px; padding: 24px 28px; margin-bottom: 24px;">
        <p style="margin: 0 0 12px; color: #2D3436;">Ciao ${name},</p>
        <p style="margin: 0 0 12px; color: #636E72; line-height: 1.6;">
          Grazie per averci scritto! Abbiamo ricevuto il tuo messaggio e ti risponderemo
          entro poche ore all'indirizzo <strong style="color: #2D3436;">${email}</strong>.
        </p>
        <p style="margin: 0; color: #636E72; line-height: 1.6;">
          Nel frattempo, puoi sfogliare i nostri appartamenti o contattarci direttamente
          su WhatsApp per una risposta ancora più rapida.
        </p>
      </div>

      <div style="background: white; border: 1px solid #E8DCC8; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
        <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #636E72; margin: 0 0 12px;">
          Il tuo messaggio
        </p>
        <p style="margin: 0 0 4px; font-weight: 600; color: #2D3436;">${subject}</p>
        <p style="margin: 0; color: #636E72; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</p>
      </div>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="https://viareggiohomes.it/appartamenti"
           style="display: inline-block; background: #4A90A4; color: white; text-decoration: none;
                  padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Sfoglia gli appartamenti
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #E8DCC8; margin: 0 0 16px;" />
      <p style="font-size: 12px; color: #636E72; text-align: center; margin: 0;">
        Viareggio Homes · Viareggio, Versilia ·
        <a href="https://viareggiohomes.it" style="color: #4A90A4; text-decoration: none;">viareggiohomes.it</a>
      </p>
    </div>
  `;

  try {
    const resendClient = getResend();
    if (resendClient) {
      // Send both emails concurrently (non-fatal individually)
      await Promise.allSettled([
        resendClient.emails.send({
          from: EMAIL_FROM,
          to: 'prenotazioni@viareggiohomes.it',
          replyTo: email,
          subject: `[Contatto] ${subject} — da ${name}`,
          html: ownerHtml,
        }),
        resendClient.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: `Abbiamo ricevuto il tuo messaggio — Viareggio Homes`,
          html: autoReplyHtml,
        }),
      ]);
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
