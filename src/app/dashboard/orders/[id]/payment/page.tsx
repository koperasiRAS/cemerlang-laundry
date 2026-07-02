import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PaymentForm from './PaymentForm'

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { id } = await params

  const { data: order } = await supabase
    .from('orders')
    .select('*, customers(name)')
    .eq('id', id)
    .single()

  if (!order || order.payment_status === 'paid') {
    redirect(`/dashboard/orders/${id}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link href={`/dashboard/orders/${id}`} className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Kembali ke Detail Order
      </Link>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Pembayaran Order</h1>
        <p className="text-gray-600 mt-2">
          Pelanggan: <span className="font-semibold">{order.customers?.name}</span> | Resi: <span className="font-mono">{order.tracking_number}</span>
        </p>
      </div>

      <PaymentForm orderId={order.id} defaultPrice={order.estimated_price} />
    </div>
  )
}
