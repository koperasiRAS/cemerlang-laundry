'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Simple in-memory rate limiting map
// Key: IP address, Value: { count: number, resetAt: number }
const rateLimitMap = new Map<string, { count: number, resetAt: number }>()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute

export async function trackOrder(query: string) {
  // 1. Rate Limiting Check
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown-ip'
  
  const now = Date.now()
  const rateLimitData = rateLimitMap.get(ip)

  if (rateLimitData && now < rateLimitData.resetAt) {
    if (rateLimitData.count >= RATE_LIMIT_MAX) {
      return { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa menit.' }
    }
    rateLimitMap.set(ip, { ...rateLimitData, count: rateLimitData.count + 1 })
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
  }

  // 2. Input Validation
  if (!query || query.trim() === '') {
    return { error: 'Silakan masukkan nomor resi atau nomor WhatsApp.' }
  }

  const cleanQuery = query.trim()
  const supabase = await createClient()

  // 3. Search logic (like before): Try by tracking number first
  let { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      tracking_number,
      status,
      payment_status,
      estimated_price,
      final_price,
      estimated_completion_date,
      created_at,
      weight,
      customer_id,
      delivery_type,
      delivery_fee,
      delivery_address,
      special_notes,
      service_types(name),
      customers(name, phone_number),
      order_items(item_name),
      order_status_history(status, created_at)
    `)
    .eq('tracking_number', cleanQuery)

  // If not found, try by phone number
  if (!orders || orders.length === 0) {
    const cleanPhone = cleanQuery.replace(/[^0-9+]/g, '')
    if (cleanPhone.length >= 8) { // Only search phone if it looks like a phone number
      const { data: matchedCustomers } = await supabase
        .from('customers')
        .select('id')
        .ilike('phone_number', `%${cleanPhone}%`)

      if (matchedCustomers && matchedCustomers.length > 0) {
        const customerIds = matchedCustomers.map(c => c.id)
        const res = await supabase
          .from('orders')
          .select(`
            id,
            tracking_number,
            status,
            payment_status,
            estimated_price,
            final_price,
            estimated_completion_date,
            created_at,
            weight,
            customer_id,
            delivery_type,
            delivery_fee,
            delivery_address,
            special_notes,
            service_types(name),
            customers(name, phone_number),
            order_items(item_name),
            order_status_history(status, created_at)
          `)
          .in('customer_id', customerIds)
          .order('created_at', { ascending: false })
          .limit(5)
        
        orders = res.data
        error = res.error
      }
    }
  }

  if (error) {
    console.error("Track Error:", error)
    return { error: 'Terjadi kesalahan saat mencari pesanan.' }
  }

  if (!orders || orders.length === 0) {
    return { error: 'Data tidak ditemukan, periksa kembali nomor tracking atau nomor HP Anda.' }
  }

  return { orders }
}
