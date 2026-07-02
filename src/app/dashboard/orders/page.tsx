import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Clock, ChevronRight, Package, Inbox, AlertTriangle } from 'lucide-react'
import SearchInput from './SearchInput'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string, q?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { status, q } = await searchParams

  let query = supabase
    .from('orders')
    .select('*, customers(name, phone_number), service_types(name)')
    .order('created_at', { ascending: false })

  if (status && status !== 'semua') {
    query = query.eq('status', status)
  } else {
    // Default: exclude selesai and dibatalkan to focus on active queue
    query = query.not('status', 'in', '("selesai","dibatalkan")')
  }

  if (q) {
    // Cari id pelanggan yang namanya cocok dengan query
    const { data: matchedCustomers } = await supabase
      .from('customers')
      .select('id')
      .ilike('name', `%${q}%`)
      
    const customerIds = matchedCustomers?.map(c => c.id) || []

    if (customerIds.length > 0) {
      query = query.or(`tracking_number.ilike.%${q}%,customer_id.in.(${customerIds.join(',')})`)
    } else {
      query = query.ilike('tracking_number', `%${q}%`)
    }
  }

  const { data: orders } = await query

  const tabs = [
    { id: 'semua', label: 'Kanban Antrian' },
    { id: 'diterima', label: 'Diterima' },
    { id: 'proses_cuci', label: 'Cuci' },
    { id: 'proses_kering', label: 'Kering' },
    { id: 'setrika_lipat', label: 'Setrika/Lipat' },
    { id: 'siap_diambil', label: 'Siap Diambil' },
    { id: 'selesai', label: 'Riwayat Selesai' },
  ]

  const currentTab = status || 'semua'

  // Kanban Grouping Logic
  const activeStatuses = ['diterima', 'proses_cuci', 'proses_kering', 'setrika_lipat', 'siap_diambil']
  const groupedOrders: Record<string, any[]> = {}
  activeStatuses.forEach(s => groupedOrders[s] = [])
  
  if (currentTab === 'semua' && orders) {
    orders.forEach(order => {
      if (groupedOrders[order.status]) {
        groupedOrders[order.status].push(order)
      }
    })
  }

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'diterima': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'proses_cuci': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'proses_kering': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'setrika_lipat': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'siap_diambil': return 'bg-green-100 text-green-800 border-green-200'
      case 'selesai': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Daftar Order</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Pantau antrian dan perbarui status cucian secara real-time.</p>
        </div>
        <Link href="/dashboard/orders/new" className="bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 font-semibold shadow-sm transition-colors flex items-center gap-2">
          <Package className="w-5 h-5" /> Terima Order Baru
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-gray-50/50">
          <div className="flex gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 hide-scrollbar snap-x">
            {tabs.map(tab => (
              <Link 
                key={tab.id}
                href={`/dashboard/orders?status=${tab.id}${q ? `&q=${q}` : ''}`}
                className={`snap-start px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  currentTab === tab.id 
                    ? 'bg-primary-100 text-primary-700 border-primary-200 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 border'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <SearchInput />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50/30 p-4 md:p-6">
          
          {currentTab === 'semua' && !q ? (
            /* Kanban Board View */
            <div className="flex flex-col lg:flex-row gap-6 min-w-full pb-4">
              {activeStatuses.map(statusKey => (
                <div key={statusKey} className="flex-1 min-w-[280px] bg-gray-50/50 rounded-2xl border border-gray-200/60 p-4 flex flex-col max-h-[calc(100vh-280px)]">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                      {statusKey.replace('_', ' ')}
                    </h3>
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">
                      {groupedOrders[statusKey].length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar pb-2 pr-1">
                    {groupedOrders[statusKey].map(order => {
                      const isOverdue = new Date(order.estimated_completion_date) < new Date()
                      return (
                        <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="block bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-300 hover:-translate-y-0.5 transition-all duration-300 group relative">
                          {isOverdue && (
                            <div className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm border border-white animate-pulse" title="Melewati batas waktu">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">{order.tracking_number}</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {order.payment_status}
                            </span>
                          </div>
                          <div className="font-semibold text-gray-900 mb-1 line-clamp-1">{Array.isArray(order.customers) ? order.customers[0]?.name : (order.customers as any)?.name}</div>
                          <div className="text-xs text-gray-500 mb-3 line-clamp-1">
                            {Array.isArray(order.service_types) ? order.service_types[0]?.name : (order.service_types as any)?.name} • {order.weight ? `${order.weight} kg` : 'Satuan'}
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100/60">
                            <div className="flex items-center gap-1.5 text-xs">
                              <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                              <span className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-500 font-medium'}>
                                {new Date(order.estimated_completion_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
                          </div>
                        </Link>
                      )
                    })}
                    {groupedOrders[statusKey].length === 0 && (
                      <div className="h-24 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        <Inbox className="w-6 h-6 mb-1 opacity-50" />
                        <span className="text-xs font-medium">Kosong</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View (For specific status or search) */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {orders?.map(order => {
                const isOverdue = new Date(order.estimated_completion_date) < new Date() && !['siap_diambil', 'selesai', 'dibatalkan'].includes(order.status)
                return (
                  <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden">
                    {isOverdue && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-red-500 to-red-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl">
                        OVERDUE
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="font-mono text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">{order.tracking_number}</span>
                        <h3 className="font-bold text-gray-900 mt-3 text-lg">{Array.isArray(order.customers) ? order.customers[0]?.name : (order.customers as any)?.name}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-5 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Layanan</span>
                        <span className="font-semibold text-gray-900">{Array.isArray(order.service_types) ? order.service_types[0]?.name : (order.service_types as any)?.name}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Berat/Item</span>
                        <span className="font-semibold text-gray-900">{order.weight ? `${order.weight} kg` : 'Satuan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pembayaran</span>
                        <span className={`font-bold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                          {order.payment_status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                        <span className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-500 font-medium'}>
                          {new Date(order.estimated_completion_date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <div className="text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Detail <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                )
              })}

              {(!orders || orders.length === 0) && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Inbox className="w-16 h-16 mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada pesanan</h3>
                  <p className="text-sm">Belum ada pesanan dalam status ini atau pencarian tidak cocok.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
