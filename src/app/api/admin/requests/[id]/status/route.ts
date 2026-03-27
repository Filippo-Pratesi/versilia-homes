import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { render } from '@react-email/components';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { getResend, EMAIL_FROM } from '@/lib/resend';
import BookingStatusChange, {
  subjectBookingStatusChange,
} from '@/emails/booking-status-change';

const statusSchema = z.object({
  status: z.enum(['confirmed', 'declined']),
});

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Richiesta non valida — JSON malformato' },
      { status: 400 }
    );
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Stato non valido. Usa "confirmed" o "declined".' },
      { status: 400 }
    );
  }

  const { status } = parsed.data;
  const admin = createAdminClient();

  // Update booking status
  const { data: updatedBooking, error: updateError } = await admin
    .from('booking_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('[admin/requests/status] Error updating status:', updateError);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento dello stato' },
      { status: 500 }
    );
  }

  if (!updatedBooking) {
    return NextResponse.json(
      { error: 'Richiesta non trovata' },
      { status: 404 }
    );
  }

  // Fetch full booking with property and owner
  const { data: property, error: propertyError } = await admin
    .from('properties')
    .select('*, owners(*)')
    .eq('id', updatedBooking.property_id)
    .single();

  if (propertyError || !property) {
    console.error('[admin/requests/status] Error fetching property:', propertyError);
    // Status was updated — return the booking even if email fails
    return NextResponse.json(updatedBooking);
  }

  const owner = (property as {
    owners: {
      name: string;
      email: string;
      whatsapp_number: string | null;
    };
  }).owners;

  // Send status change email to guest (non-fatal)
  try {
    const guestHtml = await render(
      BookingStatusChange({
        guestName: updatedBooking.guest_name,
        propertyTitle: property.title,
        checkIn: updatedBooking.check_in,
        checkOut: updatedBooking.check_out,
        status,
        ownerEmail: owner.email,
        ownerWhatsApp: owner.whatsapp_number,
      })
    );

    const resendClient = getResend();
    if (resendClient) {
      await resendClient.emails.send({
        from: EMAIL_FROM,
        to: updatedBooking.guest_email,
        subject: subjectBookingStatusChange(property.title, status),
        html: guestHtml,
      });
    }
  } catch (emailErr) {
    console.error('[admin/requests/status] Failed to send status email:', emailErr);
  }

  return NextResponse.json(updatedBooking);
}
