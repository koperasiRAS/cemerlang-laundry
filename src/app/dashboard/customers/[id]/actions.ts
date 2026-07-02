'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCustomer(id: string, data: { name: string, phone_number: string, address: string }) {
  const supabase = await createClient()

  // Verify Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'staff') {
    return { error: 'Staff tidak diizinkan mengubah data master pelanggan.' }
  }

  const { error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/customers/${id}`)
  revalidatePath('/dashboard/customers')
  return { success: true }
}
