import { getPickupRequests, updatePickupStatus } from './actions'
import { Truck, MapPin, Phone, Calendar, Clock, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function PickupsPage({ searchParams }: { searchParams: { filter?: string } }) {
  const filter = searchParams.filter || 'active'
  const allRequests = await getPickupRequests()
  
  const requests = filter === 'active' 
    ? allRequests.filter(req => req.status !== 'Dibatalkan' && !req.order_id)
    : allRequests

  const handleStatusChange = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;
    await updatePickupStatus(id, status);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Baru': return 'bg-red-100 text-red-800 border-red-200'
      case 'Dikonfirmasi': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Sudah Dijemput': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Dibatalkan': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Truck className="text-primary-600" /> Manajemen Penjemputan
          </h1>
          <p className="text-gray-500 mt-1">Kelola permintaan penjemputan dari pelanggan online.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <a href="/dashboard/pickups?filter=active" className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'active' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Aktif</a>
          <a href="/dashboard/pickups?filter=all" className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'all' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Semua Riwayat</a>
        </div>
      </div>

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Belum ada permintaan penjemputan.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div 
              key={req.id} 
              className={`bg-white rounded-2xl border ${req.status === 'Baru' ? 'border-red-300 shadow-md ring-1 ring-red-100' : 'border-gray-200 shadow-sm'} p-6 transition-all hover:shadow-md`}
            >
              <div className="flex flex-col xl:flex-row gap-6 justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      {req.reference_number}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary-50 p-2 rounded-lg text-primary-600 shrink-0"><Phone size={18} /></div>
                        <div>
                          <p className="font-semibold text-gray-900">{req.customer_name}</p>
                          <p className="text-sm text-gray-600">{req.customer_phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-50 p-2 rounded-lg text-gray-600 shrink-0"><MapPin size={18} /></div>
                        <div>
                          <p className="text-sm text-gray-800">{req.customer_address}</p>
                          {req.maps_link && (
                            <a href={req.maps_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 font-medium inline-flex items-center gap-1 mt-1 hover:underline">
                              Buka di Maps <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary-50 p-2 rounded-lg text-primary-600 shrink-0"><Calendar size={18} /></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Jadwal Jemput</p>
                          <p className="text-sm text-gray-600">{new Date(req.preferred_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                          <p className="text-sm text-gray-600 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">{req.preferred_time_slot}</p>
                        </div>
                      </div>
                      
                      {req.return_method && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 p-2 rounded-lg font-medium">
                          Pengembalian: <span className="text-primary-700">{req.return_method === 'ambil_sendiri' ? 'Ambil Sendiri di Toko' : 'Diantar Kembali'}</span>
                        </div>
                      )}
                      {req.special_notes && (
                        <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                          <strong>Catatan:</strong> {req.special_notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>



                <div className="flex flex-col gap-3 min-w-[200px] border-t xl:border-t-0 xl:border-l border-gray-100 pt-4 xl:pt-0 xl:pl-6 justify-center">
                  <a
                    href={`https://wa.me/${req.customer_phone.replace(/^0/, '62')}?text=${encodeURIComponent(`Halo Bapak/Ibu ${req.customer_name}, ini dari Cemerlang Laundry. Kami konfirmasi jadwal jemput untuk referensi ${req.reference_number} pada ${new Date(req.preferred_date).toLocaleDateString('id-ID')} (${req.preferred_time_slot}). Mohon kesediaannya menunggu.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center px-4 py-2 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#128C7E] transition-colors shadow-sm"
                  >
                    Hubungi via WhatsApp
                  </a>

                  <form action={handleStatusChange} className="flex gap-2">
                    <input type="hidden" name="id" value={req.id} />
                    <select 
                      name="status" 
                      defaultValue={req.status}
                      className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    >
                      <option value="Baru">Baru</option>
                      <option value="Dikonfirmasi">Dikonfirmasi</option>
                      <option value="Sudah Dijemput">Sudah Dijemput</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                    <button type="submit" className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700">
                      Update
                    </button>
                  </form>

                  {req.status === 'Sudah Dijemput' && !req.order_id && (
                    <Link 
                      href={`/dashboard/orders/new?pickup_id=${req.id}&name=${encodeURIComponent(req.customer_name)}&phone=${encodeURIComponent(req.customer_phone)}&address=${encodeURIComponent(req.customer_address)}&notes=${encodeURIComponent(req.special_notes || '')}`}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/30"
                    >
                      Buat Order Resmi <ArrowRight size={16} />
                    </Link>
                  )}
                  {req.order_id && (
                    <div className="mt-2 text-center p-2 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
                      Order Resmi Dibuat
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
