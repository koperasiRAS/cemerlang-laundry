import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

    const supabase = await createClient();
    const { data: order } = await supabase.from('orders').select('*, customers(*)').eq('id', orderId).single();
    
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.payment_status === 'paid') return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
    
    const clientId = process.env.DOKU_CLIENT_ID;
    const secretKey = process.env.DOKU_SECRET_KEY;
    
    if (!clientId || !secretKey) {
      return NextResponse.json({ error: 'DOKU keys are not configured on the server' }, { status: 500 });
    }

    // Default to sandbox unless explicitly production
    const isProd = process.env.DOKU_ENV === 'production';
    const baseUrl = isProd ? 'https://api.doku.com' : 'https://api-sandbox.doku.com';
    const targetPath = '/checkout/v1/payment';
    
    const requestId = crypto.randomUUID();
    const requestTimestamp = new Date().toISOString().slice(0, 19) + 'Z'; // YYYY-MM-DDTHH:MM:SSZ
    
    const totalAmount = (order.final_price || order.estimated_price) + (order.delivery_fee || 0);
    const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers;

    const body = {
      order: {
        amount: totalAmount,
        invoice_number: order.tracking_number,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/tracking?tracking=${order.tracking_number}`,
        notify_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/doku/webhook`,
        auto_redirect: true
      },
      payment: {
        payment_due_date: 120 // 2 hours expiration
      },
      customer: {
        id: order.customer_id,
        name: customer?.name || 'Customer',
        email: customer?.email || 'customer@cemerlanglaundry.com',
        phone: customer?.phone_number || '08000000000'
      }
    };

    // Generate Jokul Signature
    const digest = crypto.createHash('sha256').update(JSON.stringify(body)).digest('base64');
    const componentSignature = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${targetPath}\nDigest:${digest}`;
    const hmac = crypto.createHmac('sha256', secretKey).update(componentSignature).digest('base64');
    const signature = `HMACSHA256=${hmac}`;

    const response = await fetch(baseUrl + targetPath, {
      method: 'POST',
      headers: {
        'Client-Id': clientId,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        'Signature': signature,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('DOKU API Error:', data);
      return NextResponse.json({ error: 'Failed to generate payment link', details: data }, { status: 400 });
    }

    return NextResponse.json({ payment_url: data.response.payment.url });
  } catch (error: any) {
    console.error('DOKU Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
