import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientForm from './ClientForm'

export default async function NewOrderPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams; // In Next.js 15, searchParams should be awaited if we use it, wait, Next.js 16.2.9? No, Next.js is 14.x or 15.x. I'll just use it directly, but to be safe, I'll pass it down. Wait, in Next.js 15 it's a promise, but in Next.js 14 it's not. I'll pass the resolved params.
  const pickupId = typeof resolvedSearchParams.pickup_id === 'string' ? resolvedSearchParams.pickup_id : ''
  const name = typeof resolvedSearchParams.name === 'string' ? resolvedSearchParams.name : ''
  const phone = typeof resolvedSearchParams.phone === 'string' ? resolvedSearchParams.phone : ''
  const address = typeof resolvedSearchParams.address === 'string' ? resolvedSearchParams.address : ''
  const notes = typeof resolvedSearchParams.notes === 'string' ? resolvedSearchParams.notes : ''

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
        {pickupId && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 text-sm font-medium">
            Membuat order resmi dari Request Penjemputan
          </div>
        )}
      </div>

      <ClientForm 
        services={services || []} 
        initialData={{ pickupId, name, phone, address, notes }} 
      />
    </div>
  )
}
