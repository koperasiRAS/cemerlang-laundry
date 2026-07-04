import { createClient } from './supabase/server'

export async function logAudit(
  orderId: string,
  action: string,
  details: any
) {
  const supabase = await createClient()
  
  // Try to get user
  const { data: { user } } = await supabase.auth.getUser()
  let userName = 'System'

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
    if (profile?.name) {
      userName = profile.name
    } else {
      userName = user.email || 'User'
    }
  }

  const { error } = await supabase
    .from('audit_logs')
    .insert({
      order_id: orderId,
      user_id: user?.id || null,
      user_name: userName,
      action: action,
      details: details
    })

  if (error) {
    console.error('Failed to insert audit log:', error)
  }
}
