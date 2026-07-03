import { createClient } from '@/lib/supabase/server'
import { MapPin, Truck, ExternalLink, Package } from 'lucide-react'

export default async function TasksPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // Fetch Pickups for today (status = Dikonfirmasi)
  const { data: pickups } = await supabase
    .from('pickup_requests')
    .select('*')
    .eq('status', 'Dikonfirmasi')
    .eq('preferred_date', today)

  // Fetch New Online Pickups (status = Baru)
  const { data: newPickups } = await supabase
    .from('pickup_requests')
    .select('*')
    .eq('status', 'Baru')

  // Fetch Deliveries (status = siap_diambil, delivery_type = delivery)
  const { data: deliveries } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'siap_diambil')
    .eq('delivery_type', 'delivery')

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          Tugas Hari Ini
        </h1>
        <p className="text-gray-500 mt-1">Daftar penjemputan dan pengantaran laundry untuk hari ini.</p>
      </div>

      {newPickups && newPickups.length > 0 && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
          <h2 className="text-lg font-bold text-red-800 flex items-center gap-2 mb-4">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            {newPickups.length} Permintaan Online Baru Perlu Konfirmasi!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newPickups.map(req => (
              <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{req.customer_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{req.customer_phone}</p>
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    Minta jemput: {new Date(req.preferred_date).toLocaleDateString('id-ID')} ({req.preferred_time_slot})
                  </p>
                </div>
                <a href={`/dashboard/pickups?filter=active`} className="mt-4 w-full text-center px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 text-sm font-semibold rounded-lg transition-colors">
                  Lihat Detail & Konfirmasi
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jemput */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="text-blue-500" /> Jadwal Penjemputan
          </h2>
          {(!pickups || pickups.length === 0) ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              Tidak ada jadwal jemput hari ini.
            </div>
          ) : (
            pickups.map(pickup => (
              <div key={pickup.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">JEMPUT</span>
                    <h3 className="font-bold text-gray-900 mt-2">{pickup.customer_name}</h3>
                    <p className="text-sm text-gray-600">{pickup.customer_phone}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">{pickup.preferred_time_slot}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 mt-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{pickup.customer_address}</p>
                    {pickup.maps_link && (
                      <a href={pickup.maps_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 font-medium inline-flex items-center gap-1 mt-1 hover:underline">
                        Buka di Maps <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Antar */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-green-500" /> Jadwal Pengantaran
          </h2>
          {(!deliveries || deliveries.length === 0) ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              Tidak ada order yang siap diantar.
            </div>
          ) : (
            deliveries.map(order => (
              <div key={order.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">ANTAR</span>
                    <h3 className="font-bold text-gray-900 mt-2">{order.customer_name}</h3>
                    <p className="text-sm text-gray-600">{order.customer_phone}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {order.tracking_number}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 mt-3 mb-4">
                  <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{order.delivery_address || 'Alamat tidak diatur'}</p>
                  </div>
                </div>
                
                <form action={async () => {
                  'use server';
                  const { updateTaskDeliveryStatus } = await import('./actions');
                  await updateTaskDeliveryStatus(order.id, 'selesai');
                }}>
                  <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Tandai Selesai Diantar
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
