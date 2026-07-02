import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardCharts from './DashboardCharts'
import { Clock, CheckCircle, TrendingUp, AlertTriangle, PackageSearch, LayoutDashboard } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isStaff = profile?.role === 'staff'

  // --- Date Calculations in WIB (Asia/Jakarta) ---
  const now = new Date();
  const utcTime = now.getTime();
  const wibOffset = 7 * 60 * 60 * 1000;
  const wibDate = new Date(utcTime + wibOffset); 

  // Start of today WIB
  const startOfTodayWib = new Date(wibDate);
  startOfTodayWib.setUTCHours(0,0,0,0);
  const startOfTodayUtc = new Date(startOfTodayWib.getTime() - wibOffset).toISOString();

  // End of today WIB
  const endOfTodayWib = new Date(wibDate);
  endOfTodayWib.setUTCHours(23,59,59,999);
  const endOfTodayUtc = new Date(endOfTodayWib.getTime() - wibOffset).toISOString();

  // Start of 7 days ago WIB
  const startOf7DaysWib = new Date(startOfTodayWib);
  startOf7DaysWib.setUTCDate(startOf7DaysWib.getUTCDate() - 6); 
  const startOf7DaysUtc = new Date(startOf7DaysWib.getTime() - wibOffset).toISOString();

  // --- Fetch RPC Data ---
  const { data: todayStatsData } = await supabase.rpc('fn_get_dashboard_stats_v2', {
    p_start_date: startOfTodayUtc,
    p_end_date: endOfTodayUtc
  })
  const todayStats = todayStatsData || { total_pemasukan: 0, total_pengeluaran: 0, laba_bersih: 0, total_orders_lunas: 0 }

  const { data: weeklyStatsData } = await supabase.rpc('fn_get_dashboard_stats_v2', {
    p_start_date: startOf7DaysUtc,
    p_end_date: endOfTodayUtc
  })
  const weeklyStats = weeklyStatsData || { cashflow_trend: [], service_breakdown: [] }

  // --- Fetch Additional Realtime Operational Data ---
  const { count: activeCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .not('status', 'in', '("selesai","dibatalkan")')

  const { count: completedTodayCount } = await supabase
    .from('order_status_history')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'selesai')
    .gte('created_at', startOfTodayUtc)
    .lte('created_at', endOfTodayUtc)

  const { data: queueStats } = await supabase
    .from('orders')
    .select('status')
    .not('status', 'in', '("selesai","dibatalkan")')
  
  const queueCounts = queueStats?.reduce((acc: any, curr: any) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1
    return acc
  }, {}) || {}

  const { data: overdueOrders } = await supabase
    .from('orders')
    .select('id, tracking_number, status, estimated_completion_date, customers(name)')
    .lt('estimated_completion_date', new Date().toISOString())
    .not('status', 'in', '("siap_diambil","selesai","dibatalkan")')
    .order('estimated_completion_date', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Utama</h1>
          <p className="text-gray-500 mt-1">Ringkasan performa bisnis dan antrian hari ini.</p>
        </div>
        <Link href="/dashboard/reports" className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors">
          Lihat Laporan Lengkap &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50/50 rounded-full group-hover:scale-125 transition-transform duration-500 ease-out"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-semibold text-gray-600 text-sm">Order Aktif<br/><span className="text-xs font-medium text-gray-400">(Antrian)</span></h3>
            </div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{activeCount || 0}</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50/50 rounded-full group-hover:scale-125 transition-transform duration-500 ease-out"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                <PackageSearch size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-semibold text-gray-600 text-sm">Order Masuk<br/><span className="text-xs font-medium text-gray-400">Hari Ini</span></h3>
            </div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{todayStats.total_orders || 0}</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50/50 rounded-full group-hover:scale-125 transition-transform duration-500 ease-out"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                <CheckCircle size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-semibold text-gray-600 text-sm">Selesai<br/><span className="text-xs font-medium text-gray-400">Hari Ini</span></h3>
            </div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{completedTodayCount || 0}</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50/50 rounded-full group-hover:scale-125 transition-transform duration-500 ease-out"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-semibold text-gray-600 text-sm">Pengeluaran<br/><span className="text-xs font-medium text-gray-400">Hari Ini</span></h3>
            </div>
            <p className="text-2xl font-black text-gray-900 tracking-tight mt-2">
              Rp {(todayStats.total_pengeluaran || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300 text-white">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/20 rounded-xl text-white backdrop-blur-md">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-medium text-primary-50 text-sm">Laba Bersih<br/><span className="text-xs opacity-80">Hari Ini</span></h3>
            </div>
            <p className="text-2xl font-black tracking-tight mt-2">
              Rp {(todayStats.laba_bersih || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary-500 rounded-full"></div>
            Tren Arus Kas (7 Hari Terakhir)
          </h2>
          <div className="h-[300px]">
            <DashboardCharts dailyTrend={weeklyStats.cashflow_trend || []} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              Status Antrian
            </h2>
            <div className="space-y-5">
              {['diterima', 'proses_cuci', 'proses_kering', 'setrika_lipat', 'siap_diambil'].map(status => {
                const count = queueCounts[status] || 0;
                const maxQueue = Math.max(...Object.values(queueCounts) as number[], 1);
                const percentage = (count / maxQueue) * 100;
                
                return (
                  <div key={status} className="group">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{status.replace('_', ' ')}</span>
                      <span className="text-xs font-bold text-gray-700">{count}</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          status === 'diterima' ? 'bg-blue-500' :
                          status === 'proses_cuci' ? 'bg-orange-500' :
                          status === 'proses_kering' ? 'bg-amber-500' :
                          status === 'setrika_lipat' ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Layanan Terpopuler</h2>
            <div className="space-y-0">
              {(weeklyStats.service_breakdown || []).slice(0,5).map((s: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-bold w-4">{idx + 1}.</span>
                    <span className="font-semibold text-gray-700">{s.service_name}</span>
                  </div>
                  <span className="font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">{s.order_count} order</span>
                </div>
              ))}
              {(!weeklyStats.service_breakdown || weeklyStats.service_breakdown.length === 0) && (
                <div className="text-center text-sm text-gray-500 py-4">Belum ada data layanan</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {overdueOrders && overdueOrders.length > 0 && (
        <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> 
              {overdueOrders.length} Order Melewati Batas Waktu!
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white rounded-xl overflow-hidden border border-red-100 shadow-sm">
              <thead className="bg-red-100/50 text-red-800 text-sm">
                <tr>
                  <th className="p-4 font-bold">No. Resi</th>
                  <th className="p-4 font-bold">Pelanggan</th>
                  <th className="p-4 font-bold">Status Terakhir</th>
                  <th className="p-4 font-bold">Tenggat Waktu</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-red-50">
                {overdueOrders.map(o => (
                  <tr key={o.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="p-4 font-mono text-red-700 font-bold">{o.tracking_number}</td>
                    <td className="p-4 font-semibold text-gray-800">
                      {Array.isArray(o.customers) ? o.customers[0]?.name : (o.customers as any)?.name}
                    </td>
                    <td className="p-4"><span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded-md">{o.status.replace('_', ' ')}</span></td>
                    <td className="p-4 text-red-600 font-bold">{new Date(o.estimated_completion_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/orders/${o.id}`} className="text-red-600 hover:text-red-800 font-bold bg-white px-3 py-1.5 rounded-md border border-red-200 shadow-sm transition-colors">
                        Periksa &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
