import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Webhook ini dipanggil oleh DOKU saat pelanggan berhasil bayar
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const headers = req.headers;
    
    // 1. Ambil Header DOKU
    const clientId = headers.get('client-id') || headers.get('Client-Id');
    const requestId = headers.get('request-id') || headers.get('Request-Id');
    const requestTimestamp = headers.get('request-timestamp') || headers.get('Request-Timestamp');
    const signature = headers.get('signature') || headers.get('Signature');
    
    const secretKey = process.env.DOKU_SECRET_KEY;
    const expectedClientId = process.env.DOKU_CLIENT_ID;

    // 2. Validasi Ketersediaan Header & Kunci Rahasia
    if (!clientId || !requestId || !requestTimestamp || !signature || !secretKey || !expectedClientId) {
      console.error('Missing DOKU headers or env variables');
      return NextResponse.json({ error: 'Unauthorized: Missing credentials' }, { status: 401 });
    }

    if (clientId !== expectedClientId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Client ID' }, { status: 401 });
    }

    // 3. Validasi HMAC SHA-256 Signature
    // Format DOKU: Client-Id:\nRequest-Id:\nRequest-Timestamp:\nRequest-Target:\nDigest:
    const targetPath = '/api/doku/webhook'; // Harus persis sama dengan path di server
    const digest = crypto.createHash('sha256').update(rawBody).digest('base64');
    const signatureString = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${targetPath}\nDigest:${digest}`;
    const hmac = crypto.createHmac('sha256', secretKey).update(signatureString).digest('base64');
    const expectedSignature = `HMACSHA256=${hmac}`;

    if (signature !== expectedSignature) {
      console.error('Signature Mismatch!', { received: signature, expected: expectedSignature });
      return NextResponse.json({ error: 'Unauthorized: Invalid Signature' }, { status: 401 });
    }

    // 4. Proses Payload (Setelah terbukti 100% dari DOKU asli)
    const body = JSON.parse(rawBody);
    console.log('DOKU Webhook (Verified) received:', body.order?.invoice_number);

    if (body.order && body.order.invoice_number && body.transaction && body.transaction.status === 'SUCCESS') {
      const trackingNumber = body.order.invoice_number;
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('tracking_number', trackingNumber);

      if (error) throw new Error(error.message);
      console.log(`Order ${trackingNumber} marked as PAID via Secure Webhook`);
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error: any) {
    console.error('DOKU Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
