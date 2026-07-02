import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditCustomerForm from './EditCustomerForm'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { id } = await params

  const { data: customer, error } = await supabase
    .from('customers')
    .select('*, orders(*, service_types(name))')
    .eq('id', id)
    .single()

  if (error || !customer) {
    return <div className="p-8">Pelanggan tidak ditemukan.</div>
  }

  const isStaff = profile?.role === 'staff'
  const orders = customer.orders || []
  const totalSpent = orders.filter((o:any) => o.payment_status === 'paid').reduce((sum:number, o:any) => sum + (o.final_price || 0), 0)

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Link href="/dashboard/customers" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Kembali ke Daftar Pelanggan
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Profil & Summary */}
        <div className="space-y-6">
          {isStaff ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                  <p className="text-gray-500">Pelanggan sejak {new Date(customer.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nomor HP</p>
                  <p className="font-medium">{customer.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Alamat</p>
                  <p className="font-medium">{customer.address || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <EditCustomerForm customer={customer} />
          )}

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-sm text-white">
             <h3 className="text-blue-100 font-medium mb-1">Total Belanja Lunas</h3>
             <p className="text-3xl font-bold mb-4">Rp {totalSpent.toLocaleString('id-ID')}</p>
             <h3 className="text-blue-100 font-medium mb-1">Total Order Dibuat</h3>
             <p className="text-xl font-bold">{orders.length} kali</p>
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Order */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <h2 className="text-lg font-semibold p-6 border-b">Riwayat Transaksi</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-sm">
                  <tr>
                    <th className="p-4 text-gray-600 font-semibold">Tanggal</th>
                    <th className="p-4 text-gray-600 font-semibold">Resi</th>
                    <th className="p-4 text-gray-600 font-semibold">Layanan</th>
                    <th className="p-4 text-gray-600 font-semibold">Status</th>
                    <th className="p-4 text-gray-600 font-semibold">Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {orders.sort((a:any, b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((o: any) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="p-4 font-mono font-medium text-blue-600"><Link href={`/dashboard/orders/${o.id}`}>{o.tracking_number}</Link></td>
                      <td className="p-4 text-gray-700">{o.service_types?.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 border text-gray-700 uppercase">
                          {o.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-medium">Rp {(o.final_price || o.estimated_price).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">Belum ada riwayat transaksi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
