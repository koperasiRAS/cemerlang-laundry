import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReportFilter from './ReportFilter'

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string, end?: string }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
  const { start, end } = await searchParams

  // Default to first day of current month to today if no params
  let startDateStr = start
  let endDateStr = end

  const wibOffset = 7 * 60 * 60 * 1000;
  
  if (!startDateStr || !endDateStr) {
    const now = new Date();
    const wibDate = new Date(now.getTime() + wibOffset); 
    
    // YYYY-MM-DD for WIB today
    endDateStr = wibDate.toISOString().split('T')[0]
    
    // First day of month WIB
    wibDate.setDate(1)
    startDateStr = wibDate.toISOString().split('T')[0]
  }

  // Convert string YYYY-MM-DD to UTC timestamps that correspond to 00:00:00 and 23:59:59 WIB
  // Start: YYYY-MM-DD 00:00:00+07
  const startWibStr = `${startDateStr}T00:00:00+07:00`
  const p_start_date = new Date(startWibStr).toISOString()

  // End: YYYY-MM-DD 23:59:59+07
  const endWibStr = `${endDateStr}T23:59:59+07:00`
  const p_end_date = new Date(endWibStr).toISOString()

  // Fetch from RPC
  const { data: statsData } = await supabase.rpc('fn_get_dashboard_stats', {
    p_start_date,
    p_end_date
  })
  
  const stats = statsData || { 
    total_orders: 0, 
    total_omset: 0, 
    avg_order: 0, 
    service_breakdown: [], 
    payment_breakdown: [] 
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Laporan Keuangan</h1>
        <p className="text-gray-600">Ringkasan performa berdasarkan periode yang dipilih.</p>
      </div>

      <ReportFilter />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Order Lunas</p>
          <p className="text-3xl font-bold text-gray-800">{stats.total_orders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Omset</p>
          <p className="text-3xl font-bold text-green-700">Rp {(stats.total_omset || 0).toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-purple-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Rata-rata Nilai Order</p>
          <p className="text-3xl font-bold text-purple-700">Rp {(stats.avg_order || 0).toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Breakdown Metode Pembayaran</h2>
          {stats.payment_breakdown && stats.payment_breakdown.length > 0 ? (
            <div className="space-y-4">
              {stats.payment_breakdown.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <span className="font-medium text-gray-700 capitalize">{p.payment_method}</span>
                  <div className="text-right">
                    <div className="text-gray-500 text-sm">{p.order_count} Transaksi</div>
                    <div className="font-bold text-green-600">Rp {(p.omset || 0).toLocaleString('id-ID')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada data pembayaran</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Breakdown Layanan Terpopuler</h2>
          {stats.service_breakdown && stats.service_breakdown.length > 0 ? (
            <div className="space-y-4">
              {stats.service_breakdown.map((s: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <span className="font-medium text-gray-700">{s.service_name}</span>
                  <div className="text-right">
                    <div className="text-gray-500 text-sm">{s.order_count} Transaksi</div>
                    <div className="font-bold text-blue-600">Rp {(s.omset || 0).toLocaleString('id-ID')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-gray-500 text-center py-4">Belum ada data layanan</p>
          )}
        </div>
      </div>
    </div>
  )
}
