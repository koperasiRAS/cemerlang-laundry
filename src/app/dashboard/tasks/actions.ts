'use server';

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTaskDeliveryStatus(orderId: string, status: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.rpc('fn_update_order_delivery', {
    p_order_id: orderId,
    p_staff_id: user.id,
    p_status: status,
    p_delivery_type: null,
    p_delivery_fee: null,
    p_delivery_address: null
  })

  if (error) {
    console.error('Error updating delivery status:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard/orders')
  return { success: true }
}
