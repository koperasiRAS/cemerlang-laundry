'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function submitPickupRequest(formData: FormData) {
  // Bypassing RLS for public form submission using Service Role Key
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const customer_name = formData.get('name') as string;
  const customer_phone = formData.get('phone') as string;
  const customer_address = formData.get('address') as string;
  const maps_link = formData.get('maps_link') as string;
  const service_type_estimate = formData.get('service_type') as string;
  const preferred_date = formData.get('date') as string;
  const preferred_time_slot = formData.get('time_slot') as string;
  const special_notes = formData.get('notes') as string;

  const { data, error } = await supabase
    .from('pickup_requests')
    .insert({
      customer_name,
      customer_phone,
      customer_address,
      maps_link,
      service_type_estimate,
      preferred_date,
      preferred_time_slot,
      special_notes
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting pickup request:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/pickups');
  return { success: true, reference_number: data.reference_number };
}
