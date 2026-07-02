import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Webhook ini akan dipanggil oleh DOKU saat pelanggan berhasil bayar
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('DOKU Webhook received:', body);

    if (body.order && body.order.invoice_number && body.transaction && body.transaction.status === 'SUCCESS') {
      const trackingNumber = body.order.invoice_number;
      
      // Kita butuh admin client karena Webhook nggak punya cookies (nggak ada user login)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

      // Update status di Supabase jadi 'paid'
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('tracking_number', trackingNumber);

      if (error) {
        console.error('Webhook Supabase Error:', error);
        return NextResponse.json({ error: 'Failed to update order in database' }, { status: 500 });
      }

      console.log(`Order ${trackingNumber} marked as PAID via DOKU Webhook`);
    }

    // Wajib balas 200 OK ke DOKU supaya DOKU tahu notifikasinya nyampe
    return NextResponse.json({ message: 'OK' });
  } catch (error: any) {
    console.error('DOKU Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
