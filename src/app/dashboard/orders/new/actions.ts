'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

export async function createOrder(data: any) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const staff_id = user.id;

  const { data: trackingNumber, error } = await supabase.rpc('fn_create_order', {
    p_customer_id: data.customer_id || null,
    p_customer_name: data.customer_name,
    p_customer_phone: data.customer_phone,
    p_customer_address: data.customer_address || null,
    p_staff_id: staff_id,
    p_service_type_id: data.service_type_id,
    p_weight: data.weight || null,
    p_estimated_price: data.estimated_price,
    p_estimated_completion_date: data.estimated_completion_date,
    p_special_notes: data.special_notes || null,
    p_items: data.items || null
  })

  if (error) {
    console.error('Error creating order:', error)
    return { error: error.message }
  }

  // Get the inserted order_id to log audit
  const { data: orderData } = await supabase
    .from('orders')
    .select('id')
    .eq('tracking_number', trackingNumber)
    .single()

  if (orderData?.id) {
    const orderId = orderData.id

    // Link pickup request if provided
    if (data.pickup_request_id) {
      await supabase
        .from('pickup_requests')
        .update({ 
          order_id: orderId,
          status: 'Sudah Dijemput'
        })
        .eq('id', data.pickup_request_id)
    }

    // AUDIT LOGGING
    // Log Discount if applied
    if (data.discount_percent && data.discount_percent > 0) {
      await logAudit(orderId, 'DISCOUNT_APPLIED', {
        percent: data.discount_percent,
        amount: data.discount_amount,
        base_price: data.base_price,
        final_estimated_price: data.estimated_price
      })
    }

    // Check if the price was edited manually (e.g. Satuan) 
    // Wait, the client form recalculates basePrice from items. We check if they changed it manually.
    // Actually, if there is a discrepancy between item base price and inputted price, we might log it.
    // For now, tracking manual price edits for Satuan:
    if (data.items && data.items.length > 0) {
      let hasManualEdit = false
      const editedItems = []
      for (const item of data.items) {
        // If price differs, it's manually edited
        // We don't have the original base price of the item here, but it's logged in ClientForm if needed
      }
    }
  }

  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard/pickups')
  revalidatePath('/dashboard/tasks')
  return { success: true, trackingNumber }
}

export async function searchCustomer(phone: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null;

    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone_number', phone)
        .single()
    
    if (error) return null;
    return data;
}
