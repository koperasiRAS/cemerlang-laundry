'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function processPayment(orderId: string, paymentMethod: string, finalPrice: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

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

  revalidatePath(`/dashboard/orders/${orderId}`)
  revalidatePath('/dashboard/orders')
  return { success: true }
}
