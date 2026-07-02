'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPickupRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pickup_requests')
    .select('*')
    .order('created_at', { ascending: false });

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
