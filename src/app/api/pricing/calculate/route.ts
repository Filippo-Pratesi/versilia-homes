import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculatePrice, calculateNights } from '@/lib/pricing';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const property_id = searchParams.get('property_id');
  const check_in = searchParams.get('check_in');
  const check_out = searchParams.get('check_out');

  // Validate required params
  if (!property_id || !check_in || !check_out) {
    return NextResponse.json(
      { error: 'Parametri obbligatori: property_id, check_in, check_out' },
      { status: 400 }
    );
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(check_in) || !dateRegex.test(check_out)) {
    return NextResponse.json(
      { error: 'Le date devono essere nel formato YYYY-MM-DD' },
      { status: 400 }
    );
  }

  if (check_in >= check_out) {
    return NextResponse.json(
      { error: 'La data di check-out deve essere successiva al check-in' },
      { status: 400 }
    );
  }

  const nights = calculateNights(check_in, check_out);
  if (nights < 1) {
    return NextResponse.json(
      { error: 'Il soggiorno deve essere di almeno 1 notte' },
      { status: 400 }
    );
  }

  try {
    const admin = createAdminClient();
    const { data: rules, error } = await admin
      .from('pricing_rules')
      .select('*')
      .eq('property_id', property_id);

    if (error) {
      console.error('[pricing/calculate] Error fetching pricing rules:', error);
      return NextResponse.json(
        { error: 'Errore nel recupero delle tariffe' },
        { status: 500 }
      );
    }

    const result = calculatePrice(rules ?? [], check_in, check_out);

    if (!result) {
      return NextResponse.json(
        { pricePerNight: null, nights, totalPrice: null, currency: 'EUR', minNights: null },
        { status: 200 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[pricing/calculate] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
