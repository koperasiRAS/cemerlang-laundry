'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

  // Link pickup request if provided
  if (data.pickup_request_id && trackingNumber) {
    const { data: orderData } = await supabase
      .from('orders')
      .select('id')
      .eq('tracking_number', trackingNumber)
      .single()

    if (orderData?.id) {
      await supabase
        .from('pickup_requests')
        .update({ order_id: orderData.id })
        .eq('id', data.pickup_request_id)
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
