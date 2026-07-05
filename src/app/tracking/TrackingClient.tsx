'use client'

import { useState } from 'react'
import { trackOrder } from './actions'
import { Search, Loader2, CheckCircle2, CreditCard, ShoppingBag, Calendar, AlignLeft, Building2, QrCode } from 'lucide-react'

export default function TrackingClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<any[]>([])

  // Nomor WhatsApp toko
  const STORE_WHATSAPP = '6282138056837'

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    setOrders([])

    try {
      const res = await trackOrder(searchQuery)
      if (res.error) {
        setError(res.error)
      } else if (res.orders) {
        setOrders(res.orders)
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mencari order.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusStep = (status: string, deliveryType: string) => {
    if (status === 'dibatalkan') return -1
    if (status === 'siap_diambil' || status === 'diantar') return 4
    if (status === 'selesai') return 5
    const steps = ['diterima', 'proses_cuci', 'proses_kering', 'setrika_lipat']
    return steps.indexOf(status)
  }

  const getStepsList = (deliveryType: string) => [
    { id: 'diterima', label: 'Diterima' },
    { id: 'proses_cuci', label: 'Dicuci' },
    { id: 'proses_kering', label: 'Dikeringkan' },
    { id: 'setrika_lipat', label: 'Disetrika' },
    { id: deliveryType === 'delivery' ? 'diantar' : 'siap_diambil', label: deliveryType === 'delivery' ? 'Diantar' : 'Siap Diambil' },
    { id: 'selesai', label: 'Selesai' },
  ]


  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Search Box */}
      <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-300">
          <Search className="w-8 h-8 md:w-10 md:h-10 text-primary-500" />
        </div>
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">Cek Status Cucian</h2>
        <p className="text-sm md:text-base text-gray-500 mb-8 max-w-md mx-auto">Masukkan Nomor Resi atau Nomor WhatsApp yang terdaftar untuk melacak pesanan Anda.</p>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4 max-w-md mx-auto">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nomor Resi / No HP" 
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-base md:text-lg shadow-sm"
          />
          <button 
            type="submit" 
            disabled={loading || !searchQuery.trim()}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 font-bold text-lg hover:-translate-y-1 active:translate-y-0 w-full mt-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Lacak Pesanan'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 max-w-md mx-auto">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {orders.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {orders.map(order => {
            const customerName = order?.customers ? (Array.isArray(order.customers) ? order.customers[0]?.name : order.customers.name) : ''
            const serviceName = order?.service_types ? (Array.isArray(order.service_types) ? order.service_types[0]?.name : order.service_types.name) : ''
            const currentStepIndex = order ? getStatusStep(order.status, order.delivery_type) : 0
            const isOverdue = order ? new Date(order.estimated_completion_date) < new Date() && !['siap_diambil', 'selesai', 'dibatalkan', 'diantar'].includes(order.status) : false
            const isCancelled = order?.status === 'dibatalkan'
            
            const waMessage = `Halo Cemerlang Laundry, saya ingin menanyakan status pesanan saya dengan nomor resi *${order?.tracking_number}*.`
            const waLink = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(waMessage)}`

            return (
              <div key={order.id} className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                {isOverdue && !isCancelled && (
                   <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                     TERLAMBAT
                   </div>
                )}
                {isCancelled && (
                   <div className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                     DIBATALKAN
                   </div>
                )}

                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-50 pb-6">
                  <div>
                    <span className="inline-block font-mono text-xs md:text-sm font-bold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg mb-2">{order.tracking_number}</span>
                    <h4 className="font-bold text-gray-900 text-lg md:text-xl">{customerName}</h4>
                    <p className="text-sm text-gray-500 mt-1">{serviceName} • {order.weight ? `${order.weight} kg` : 'Satuan'}</p>
                  </div>
                  <div className="text-left md:text-right bg-gray-50 p-4 rounded-2xl border border-gray-100 w-full md:w-auto">
                    <p className="text-xs text-gray-500 font-medium mb-1">Estimasi Selesai</p>
                    <p className={`font-bold text-base md:text-lg ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(order.estimated_completion_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>

                {/* Visual Tracker */}
                {!isCancelled ? (
                  <div className="mb-10 mt-4 px-2 md:px-6">
                    <div className="relative">
                      {/* Tracking Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 transition-all duration-1000 ease-out"
                          style={{ width: `${(Math.max(0, currentStepIndex) / (getStepsList(order.delivery_type).length - 1)) * 100}%` }}
                        />
                      </div>

                      {/* Tracking Points */}
                      <div className="relative flex justify-between">
                        {getStepsList(order.delivery_type).map((step, idx) => {
                          const isCompleted = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;
                          return (
                            <div key={step.id} className="flex flex-col items-center">
                              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 z-10 ${
                                isCurrent ? 'bg-primary-500 scale-125 ring-4 ring-primary-100' :
                                isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                              }`}>
                                {isCompleted ? <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" /> : <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />}
                              </div>
                              <span className={`text-[9px] md:text-xs font-semibold mt-3 text-center w-14 md:w-20 hidden sm:block ${isCurrent ? 'text-primary-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {/* Mobile Only Status Text */}
                    <div className="sm:hidden mt-6 text-center">
                       <span className="text-xs font-medium text-gray-500">Status saat ini:</span>
                       <h3 className="text-lg font-bold text-primary-600 uppercase tracking-wide mt-1">
                          {order.status.replace('_', ' ')}
                       </h3>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 p-6 bg-gray-50 rounded-2xl text-center border border-gray-200">
                    <p className="font-bold text-gray-700">Pesanan ini telah dibatalkan.</p>
                  </div>
                )}

                {/* Special Notes & Order Items (if any) */}
                {(order.special_notes || (order.order_items && order.order_items.length > 0)) && (
                  <div className="mb-6 space-y-4">
                    {order.special_notes && (
                      <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-2xl flex gap-3">
                        <AlignLeft className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-yellow-800 mb-1">Catatan Pesanan:</p>
                          <p className="text-sm text-yellow-900">{order.special_notes}</p>
                        </div>
                      </div>
                    )}
                    
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                          <ShoppingBag className="w-4 h-4 text-gray-500" />
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Daftar Barang</p>
                        </div>
                        <ul className="space-y-2">
                          {order.order_items.map((item: any, idx: number) => (
                            <li key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                              <span className="text-gray-700">{item.item_name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Status History Timeline */}
                {order.order_status_history && order.order_status_history.length > 0 && (
                  <div className="mb-8 border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-bold text-gray-800">Riwayat Status</p>
                    </div>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                      {order.order_status_history.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((hist: any, idx: number) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-gray-300 group-[.is-active]:bg-primary-500 text-gray-500 group-[.is-active]:text-primary-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0 md:ml-auto md:mr-auto"></div>
                          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-gray-100 bg-white shadow-sm ml-4 md:ml-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm text-gray-900 capitalize">{hist.status.replace('_', ' ')}</span>
                              <span className="text-xs text-gray-400">{new Date(hist.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50/80 p-4 rounded-2xl border border-gray-100 mb-6">
                  <div className="flex flex-col gap-1 mb-2 sm:mb-0 w-full sm:w-auto text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600 font-medium">Total Tagihan:</span>
                      <span className="font-bold text-gray-900">Rp {((order.final_price || order.estimated_price) + (order.delivery_fee || 0)).toLocaleString('id-ID')}</span>
                    </div>
                    {order.delivery_fee > 0 && (
                      <div className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                        Termasuk ongkir: Rp {order.delivery_fee.toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider block text-center ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </div>
                </div>

                {order.payment_status !== 'paid' && !isCancelled && (
                  <div className="mb-6 space-y-4">
                    <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-blue-900">Transfer Bank</h4>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Bank BCA</p>
                        <p className="text-xl font-bold text-gray-900 tracking-wider">1234 5678 90</p>
                        <p className="text-sm text-gray-700 font-medium mt-1">a.n Cemerlang Laundry</p>
                      </div>
                    </div>

                    <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <QrCode className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold text-purple-900">QRIS</h4>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <div className="w-48 h-48 bg-gray-100 mx-auto flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 mb-3">
                          <span className="text-gray-400 font-medium text-sm">Gambar QRIS</span>
                        </div>
                        <p className="text-sm text-gray-600">Scan QRIS ini menggunakan aplikasi M-Banking atau e-Wallet Anda.</p>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">
                        Setelah melakukan pembayaran, mohon infokan bukti transfer via WhatsApp di bawah.
                      </p>
                    </div>
                  </div>
                )}

                {/* WA Button */}
                <a 
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 hover:-translate-y-1"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Hubungi Kami via WhatsApp
                </a>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
