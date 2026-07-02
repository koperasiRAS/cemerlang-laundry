'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addExpense(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'staff') {
    throw new Error('Unauthorized. Staff cannot add expenses.')
  }

  const amount = Number(formData.get('amount'))
  const category = formData.get('category') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('expenses')
    .insert({
      amount,
      category,
      description,
      created_by: user.id
    })

  if (error) {
    console.error(error)
    throw new Error('Gagal menambahkan pengeluaran')
  }

  revalidatePath('/dashboard/expenses')
  redirect('/dashboard/expenses')
}
