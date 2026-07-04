'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

export async function updateOrderStatus(
  orderId: string, 
  newStatus: string,
  deliveryInfo?: { type: 'pickup' | 'delivery', fee: number, address: string }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // 1. Update order
  const updateData: any = { status: newStatus }
  if (deliveryInfo) {
    updateData.delivery_type = deliveryInfo.type
    updateData.delivery_fee = deliveryInfo.fee
    updateData.delivery_address = deliveryInfo.address
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (updateError) return { error: updateError.message }

  // 2. Insert history
  await supabase
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status: newStatus,
      changed_by: user.id
    })

  // 3. AUDIT LOGGING
  if (newStatus === 'dibatalkan') {
    await logAudit(orderId, 'ORDER_VOIDED', {
      reason: 'Dibatalkan manual oleh pengguna'
    })
  }

  revalidatePath(`/dashboard/orders/${orderId}`)
  revalidatePath('/dashboard/orders')
  return { success: true }
}
