'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPickupRequests(filter = 'active') {
  const supabase = await createClient();
  
  let query = supabase
    .from('pickup_requests')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (filter === 'active') {
    query = query.neq('status', 'Dibatalkan').is('order_id', null);
  } else {
    // Limit to latest 50 for "all history" so it doesn't grow infinitely
    query = query.limit(50);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pickup requests:', error);
    return [];
  }
  return data;
}

export async function updatePickupStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('pickup_requests')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating pickup status:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/pickups');
  revalidatePath('/dashboard/tasks');
  return { success: true };
}
