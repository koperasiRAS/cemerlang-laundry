'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addService(formData: FormData) {
  const supabase = await createClient()

  // Verify Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'staff') throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const unit = formData.get('unit') as string
  const base_price = parseInt(formData.get('base_price') as string, 10)
  const estimated_duration_hours = parseInt(formData.get('estimated_duration_hours') as string, 10)

  const { error } = await supabase.from('service_types').insert({
    name,
    unit,
    base_price,
    estimated_duration_hours,
  })

  if (error) {
    console.error('Error adding service:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/services')
  return { success: true }
}

export async function deactivateService(id: string) {
  const supabase = await createClient()

  // Verify Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'staff') throw new Error('Unauthorized')

  const { error } = await supabase
    .from('service_types')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deactivating service:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/services')
  return { success: true }
}
