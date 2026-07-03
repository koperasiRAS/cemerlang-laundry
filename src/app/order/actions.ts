'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const getServiceRoleKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZm90d2Vob2Nyc3lrdnhweWFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjAzMTAwOSwiZXhwIjoyMDk3NjA3MDA5fQ.cVrzyav0-01XgB9lVv69wC2rQnmOx8NcJ-QLmViGinw';

export async function submitPickupRequest(formData: FormData) {
  // Bypassing RLS for public form submission using Service Role Key
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getServiceRoleKey()
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

export async function getPublicServiceTypes() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getServiceRoleKey()
  );

  const { data, error } = await supabase
    .from('service_types')
    .select('id, name, type, base_price, unit')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching service types:', error);
    return [];
  }

  return data;
}
