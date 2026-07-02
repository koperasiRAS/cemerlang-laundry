'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function checkPermission(targetRole: 'staff' | 'owner') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role === 'staff') {
    throw new Error('Unauthorized')
  }

  // Owner can only create/manage staff
  if (profile.role === 'owner' && targetRole !== 'staff') {
    throw new Error('Owner hanya dapat mengelola akun Staff.')
  }

  return { adminClient: createAdminClient(), currentUserRole: profile.role }
}

export async function createStaffAccount(data: FormData) {
  try {
    const email = data.get('email') as string
    const password = data.get('password') as string
    const fullName = data.get('full_name') as string
    const role = (data.get('role') as 'staff' | 'owner') || 'staff'

    const { adminClient } = await checkPermission(role)

    // 1. Create User in Auth using Admin API
    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (createError) throw new Error(createError.message)

    // 2. The trigger creates the profile as 'staff' automatically.
    // If the requested role is 'owner' (by super_admin), we must update it.
    if (role === 'owner' && userData.user) {
      await adminClient
        .from('profiles')
        .update({ role: 'owner' })
        .eq('id', userData.user.id)
    }

    revalidatePath('/dashboard/staff')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Terjadi kesalahan' }
  }
}

export async function toggleStaffStatus(id: string, currentStatus: boolean, targetRole: 'staff' | 'owner') {
  try {
    const { adminClient } = await checkPermission(targetRole)
    
    // We use adminClient to bypass RLS since Owner might not have update permissions on everything, or just to be safe.
    const { error } = await adminClient
      .from('profiles')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/staff')
    return { success: true }
  } catch(e:any) {
    return { error: e.message }
  }
}
