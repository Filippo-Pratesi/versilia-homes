import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { render } from '@react-email/components';
import { createAdminClient } from '@/lib/supabase/admin';
import { getResend, EMAIL_FROM } from '@/lib/resend';
import { calculatePrice } from '@/lib/pricing';
import BookingRequestOwner, {
  subjectBookingRequestOwner,
} from '@/emails/booking-request-owner';
import BookingConfirmationGuest, {
  subjectBookingConfirmationGuest,
} from '@/emails/booking-confirmation-guest';

const bookingRequestSchema = z.object({
  property_id: z.string().uuid('ID proprietà non valido'),
  guest_name: z.string().min(2, 'Il nome è obbligatorio'),
  guest_email: z.string().email('Email non valida'),
  guest_phone: z.string().optional().nullable(),
  check_in: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido (YYYY-MM-DD)'),
  check_out: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido (YYYY-MM-DD)'),
  guests_count: z
    .number()
    .int()
    .min(1, 'Almeno 1 ospite')
    .max(20, 'Massimo 20 ospiti')
    .default(1),
  message: z.string().max(2000).optional().nullable(),
});

function buildWhatsAppUrl(
  ownerWhatsApp: string | null,
  ownerName: string,
  propertyTitle: string,
  checkIn: string,
  checkOut: string,
  guestsCount: number,
  guestName: string,
  guestEmail: string
): string | null {
  if (!ownerWhatsApp) return null;

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(
      new Date(d)
    );

  const text = `Ciao ${ownerName}, ho appena inviato una richiesta di prenotazione per ${propertyTitle} dal ${formatDate(checkIn)} al ${formatDate(checkOut)} per ${guestsCount} ospiti. Il mio nome è ${guestName}, email: ${guestEmail}.`;

  const cleaned = ownerWhatsApp.replace(/\D/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

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

  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dati non validi', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    property_id,
    guest_name,
    guest_email,
    guest_phone,
    check_in,
    check_out,
    guests_count,
    message,
  } = parsed.data;

  // Validate check_in < check_out
  if (check_in >= check_out) {
    return NextResponse.json(
      { error: 'La data di check-out deve essere successiva al check-in' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Check for blocked dates in the selected range
  const { data: blockedDates, error: blockedError } = await admin
    .from('blocked_dates')
    .select('date')
    .eq('property_id', property_id)
    .gte('date', check_in)
    .lt('date', check_out);

  if (blockedError) {
    console.error('[booking-request] Error checking blocked dates:', blockedError);
    return NextResponse.json(
      { error: 'Errore nella verifica della disponibilità' },
      { status: 500 }
    );
  }

  if (blockedDates && blockedDates.length > 0) {
    return NextResponse.json(
      {
        error: 'Le date selezionate non sono disponibili',
        blockedDates: blockedDates.map((b) => b.date),
      },
      { status: 409 }
    );
  }

  // Fetch pricing rules and calculate estimated price
  const { data: pricingRules, error: pricingError } = await admin
    .from('pricing_rules')
    .select('*')
    .eq('property_id', property_id);

  if (pricingError) {
    console.error('[booking-request] Error fetching pricing rules:', pricingError);
    // Non-fatal: we'll proceed with null estimated_price
  }

  const priceCalc = calculatePrice(pricingRules ?? [], check_in, check_out);
  const estimated_price = priceCalc?.totalPrice ?? null;

  // Insert the booking request
  const { data: bookingRequest, error: insertError } = await admin
    .from('booking_requests')
    .insert({
      property_id,
      guest_name,
      guest_email,
      guest_phone: guest_phone ?? null,
      check_in,
      check_out,
      guests_count,
      message: message ?? null,
      estimated_price,
      status: 'pending',
    })
    .select()
    .single();

  if (insertError) {
    console.error('[booking-request] Error inserting booking request:', insertError);
    return NextResponse.json(
      { error: 'Errore nel salvataggio della richiesta' },
      { status: 500 }
    );
  }

  // Fetch property with owner
  const { data: property, error: propertyError } = await admin
    .from('properties')
    .select('*, owners(*)')
    .eq('id', property_id)
    .single();

  if (propertyError || !property) {
    console.error('[booking-request] Error fetching property with owner:', propertyError);
    // The booking is saved — return success with no WhatsApp URL
    return NextResponse.json({ success: true, whatsappUrl: null });
  }

  const owner = (property as { owners: { name: string; email: string; whatsapp_number: string | null } }).owners;

  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://viareggiohomes.it'}/admin`;

  // Send owner email (non-fatal)
  try {
    const ownerHtml = await render(
      BookingRequestOwner({
        guestName: guest_name,
        guestEmail: guest_email,
        guestPhone: guest_phone ?? null,
        checkIn: check_in,
        checkOut: check_out,
        guestsCount: guests_count,
        message: message ?? null,
        estimatedPrice: estimated_price,
        propertyTitle: property.title,
        adminUrl,
      })
    );

    const resendClient = getResend();
    if (resendClient) {
      await resendClient.emails.send({
        from: EMAIL_FROM,
        to: owner.email,
        subject: subjectBookingRequestOwner(property.title, check_in, check_out),
        html: ownerHtml,
      });
    }
  } catch (emailErr) {
    console.error('[booking-request] Failed to send owner email:', emailErr);
  }

  // Send guest confirmation email (non-fatal)
  try {
    const guestHtml = await render(
      BookingConfirmationGuest({
        guestName: guest_name,
        propertyTitle: property.title,
        checkIn: check_in,
        checkOut: check_out,
        guestsCount: guests_count,
        estimatedPrice: estimated_price,
      })
    );

    const resendClient = getResend();
    if (resendClient) {
      await resendClient.emails.send({
        from: EMAIL_FROM,
        to: guest_email,
        subject: subjectBookingConfirmationGuest(property.title),
        html: guestHtml,
      });
    }
  } catch (emailErr) {
    console.error('[booking-request] Failed to send guest email:', emailErr);
  }

  // Build WhatsApp URL
  const whatsappUrl = buildWhatsAppUrl(
    owner.whatsapp_number,
    owner.name,
    property.title,
    check_in,
    check_out,
    guests_count,
    guest_name,
    guest_email
  );

  return NextResponse.json(
    { success: true, bookingId: bookingRequest.id, whatsappUrl },
    { status: 201 }
  );
}
