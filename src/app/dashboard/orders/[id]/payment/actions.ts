'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

export async function processPayment(orderId: string, paymentMethod: string, finalPrice: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // 0. Validate final price against estimated price to prevent excessive manual discount abuse
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('estimated_price, delivery_fee, payment_status, payment_method, final_price')
    .eq('id', orderId)
    .single()
    
  if (orderError || !orderData) return { error: 'Order tidak ditemukan' }
  
  const expectedTotal = (orderData.estimated_price || 0) + (orderData.delivery_fee || 0)
  const maxDiscount = expectedTotal * 0.5 // Maximum 50% discount without manager override
  
  if (finalPrice < expectedTotal - maxDiscount) {
     return { error: 'Diskon terlalu besar (Maks 50%). Hubungi owner untuk diskon khusus.' }
  }

  // 1. Update order
  const { error: updateError } = await supabase
    .from('orders')
    .update({ 
      payment_status: 'paid',
      payment_method: paymentMethod,
      final_price: finalPrice
    })
    .eq('id', orderId)

  if (updateError) return { error: updateError.message }

  // 2. AUDIT LOGGING
  if (orderData.payment_status === 'paid') {
    // Already paid, maybe they are editing it
    if (orderData.payment_method !== paymentMethod) {
      await logAudit(orderId, 'PAYMENT_METHOD_CHANGED', {
        old_method: orderData.payment_method,
        new_method: paymentMethod
      })
    }
    if (orderData.final_price !== finalPrice) {
      await logAudit(orderId, 'PAYMENT_PRICE_CHANGED_AFTER_PAID', {
        old_price: orderData.final_price,
        new_price: finalPrice
      })
    }
  } else {
    // First time paying
    if (finalPrice !== expectedTotal) {
      await logAudit(orderId, 'PAYMENT_PRICE_EDITED', {
        expected_total: expectedTotal,
        final_price: finalPrice,
        method: paymentMethod
      })
    }
  }

  revalidatePath(`/dashboard/orders/${orderId}`)
  revalidatePath('/dashboard/orders')
  return { success: true }
}
