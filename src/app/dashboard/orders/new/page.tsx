import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientForm from './ClientForm'

export default async function NewOrderPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch active services
  const { data: services } = await supabase
    .from('service_types')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Terima Order Baru</h1>
        <p className="text-gray-600">Catat transaksi baru dari pelanggan.</p>
      </div>

      <ClientForm services={services || []} />
    </div>
  )
}
