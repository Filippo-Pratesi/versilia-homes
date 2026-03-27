import { Resend } from 'resend';

export const EMAIL_FROM = process.env.EMAIL_FROM || 'prenotazioni@viareggiohomes.it';

// Lazy singleton — only instantiate when actually sending (avoids build crash when key is missing)
let _resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[resend] RESEND_API_KEY is not set — email skipped');
    return null;
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}
