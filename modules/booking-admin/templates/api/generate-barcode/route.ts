/**
 * TEMPLATE: kopiraj kao src/app/api/generate-barcode/route.ts
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateHUB3Barcode, generateEPCQR } from 'MODULE_ROOT/lib/barcode';

export async function POST(request: NextRequest) {
  try {
    const { amount, guestName, reference } = await request.json();

    if (!amount || !guestName || !reference) {
      return NextResponse.json(
        { error: 'Missing fields: amount, guestName, reference' },
        { status: 400 },
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const [hub3Result, epcResult] = await Promise.allSettled([
      generateHUB3Barcode(parsedAmount, String(guestName), String(reference)),
      generateEPCQR(parsedAmount, String(guestName), String(reference)),
    ]);

    return NextResponse.json({
      hub3: hub3Result.status === 'fulfilled' ? hub3Result.value : null,
      epc: epcResult.status === 'fulfilled' ? epcResult.value : null,
    });
  } catch (error) {
    console.error('[generate-barcode] Error:', error);
    return NextResponse.json({ error: 'Error generating barcode' }, { status: 500 });
  }
}
