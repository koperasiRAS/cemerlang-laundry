import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isStaff = profile?.role === 'staff'

  const { q } = await searchParams

  let query = supabase
    .from('customers')
    .select('id, name, phone_number, address, created_at, orders(id, final_price, payment_status)')
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`name.ilike.%${q}%,phone_number.ilike.%${q}%`)
  }

  const { data: customersRaw } = await query

  const customers = customersRaw?.map(c => {
    const totalOrders = c.orders.length
    const totalSpent = c.orders
      .filter((o: any) => o.payment_status === 'paid')
      .reduce((sum: number, o: any) => sum + (o.final_price || 0), 0)
    
    return {
      ...c,
      totalOrders,
      totalSpent
    }
  })

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Pelanggan</h1>
          <p className="text-gray-600">Daftar pelanggan dan riwayat transaksi.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-end">
          <form className="relative w-full md:w-72">
             <input 
               type="text" 
               name="q"
               defaultValue={q}
               placeholder="Cari Nama / No HP..." 
               className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
             <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b text-sm">
                <th className="p-4 font-semibold text-gray-600">Nama Pelanggan</th>
                <th className="p-4 font-semibold text-gray-600">No. HP</th>
                <th className="p-4 font-semibold text-gray-600">Total Transaksi</th>
                <th className="p-4 font-semibold text-gray-600">Total Belanja (Lunas)</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map((cust) => (
                <tr key={cust.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{cust.name}</td>
                  <td className="p-4 text-gray-600">{cust.phone_number}</td>
                  <td className="p-4 text-gray-600">{cust.totalOrders} kali</td>
                  <td className="p-4 font-medium text-green-600">Rp {cust.totalSpent.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-right">
                    <Link href={`/dashboard/customers/${cust.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-4">
                      Riwayat & Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {(!customers || customers.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Tidak ada pelanggan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
