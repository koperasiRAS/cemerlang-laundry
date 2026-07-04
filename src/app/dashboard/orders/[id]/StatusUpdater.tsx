'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'
import { Loader2, ArrowRightCircle, XCircle, Truck, Store } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StatusUpdater({ orderId, currentStatus, defaultAddress, serviceName = '', flowType = 'cuci_komplit', weight = 0 }: { orderId: string, currentStatus: string, defaultAddress: string, serviceName?: string, flowType?: string, weight?: number }) {
  const [loading, setLoading] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState<number | ''>(weight >= 5 ? 0 : '')
  const [deliveryAddress, setDeliveryAddress] = useState(defaultAddress)

  // Standard full flow
  let statusFlow = ['diterima', 'proses_cuci', 'proses_kering', 'setrika_lipat', 'siap_diambil', 'diantar', 'selesai', 'dibatalkan']
  let lastOpStep = 'setrika_lipat'
  
  if (flowType === 'setrika_saja') {
    statusFlow = ['diterima', 'setrika_lipat', 'siap_diambil', 'diantar', 'selesai', 'dibatalkan']
    lastOpStep = 'setrika_lipat'
  } else if (flowType === 'cuci_kering_lipat' || flowType === 'cuci_saja') {
    // cuci -> kering -> siap_diambil
    statusFlow = ['diterima', 'proses_cuci', 'proses_kering', 'siap_diambil', 'diantar', 'selesai', 'dibatalkan']
    lastOpStep = 'proses_kering'
  }
  
  const currentIndex = statusFlow.indexOf(currentStatus)
  
  let nextStatus: string | null = null
  if (currentStatus === lastOpStep) {
    nextStatus = 'siap_diambil_or_diantar'
  } else if (currentStatus === 'siap_diambil' || currentStatus === 'diantar') {
    nextStatus = 'selesai'
  } else if (currentIndex >= 0 && currentIndex < statusFlow.indexOf(lastOpStep)) {
    nextStatus = statusFlow[currentIndex + 1]
  }

  const handleUpdate = async (status: string, deliveryInfo?: { type: 'pickup' | 'delivery', fee: number, address: string }) => {
    setLoading(true)
    const toastId = toast.loading('Mengupdate status...')
    const res = await updateOrderStatus(orderId, status, deliveryInfo)
    if (res?.error) {
      toast.error(res.error, { id: toastId })
    } else {
      toast.success(`Status berhasil diubah ke ${status.replace('_', ' ').toUpperCase()}`, { id: toastId })
      setShowDeliveryModal(false)
      
      // Auto-show WA prompt for specific statuses (Opsi A: Siap Diambil / Diantar saja)
      if (['siap_diambil', 'diantar'].includes(status)) {
         // Reload page to get new data first, then trigger WA via query param
         window.location.href = `/dashboard/orders/${orderId}?waPrompt=true`
      } else {
         window.location.reload()
      }
    }
    setLoading(false)
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 w-full sm:w-auto mt-4 md:mt-0">
        {nextStatus === 'siap_diambil_or_diantar' ? (
            <button
              disabled={loading}
              onClick={() => setShowDeliveryModal(true)}
              className="flex-1 sm:flex-none bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Barang Selesai & Lanjut
                  <ArrowRightCircle className="w-5 h-5" />
                </>
              )}
            </button>
        ) : nextStatus ? (
          <button
            disabled={loading}
            onClick={() => handleUpdate(nextStatus as string)}
            className="flex-1 sm:flex-none bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Lanjut ke {nextStatus.replace('_', ' ').toUpperCase()}
                <ArrowRightCircle className="w-5 h-5" />
              </>
            )}
          </button>
        ) : null}
        
        {currentStatus !== 'selesai' && currentStatus !== 'dibatalkan' && (
          <button
            disabled={loading}
            onClick={() => {
              if (confirm('Yakin ingin membatalkan order ini?')) handleUpdate('dibatalkan')
            }}
            className="flex-1 sm:flex-none bg-white text-red-600 px-6 py-3 rounded-xl border border-red-200 hover:bg-red-50 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            <XCircle className="w-5 h-5" />
            Batalkan
          </button>
        )}
      </div>

      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Pilih Opsi Pengambilan</h2>
              <p className="text-sm text-gray-500 mt-1">Order ini sudah selesai disetrika dan siap dikembalikan ke pelanggan.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleUpdate('siap_diambil', { type: 'pickup', fee: 0, address: '' })}
                  disabled={loading}
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all"
                >
                  <Store className="w-10 h-10 text-gray-400 mb-3" />
                  <span className="font-bold text-gray-900">Ambil di Toko</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">Pelanggan ambil sendiri</span>
                </button>
                
                <button
                  onClick={() => document.getElementById('delivery-form')?.classList.remove('hidden')}
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all focus:border-primary-500 focus:bg-primary-50"
                >
                  <Truck className="w-10 h-10 text-primary-500 mb-3" />
                  <span className="font-bold text-gray-900">Antar ke Rumah</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">Dikirim via kurir/staf</span>
                </button>
              </div>

              <div id="delivery-form" className="hidden mt-6 space-y-4 border-t border-gray-100 pt-6 animate-in slide-in-from-top-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ongkos Kirim (Rp)</label>
                  <input 
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0 (jika gratis)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Rekomendasi: Berat &ge; 5kg = Gratis, &lt; 5kg = Rp5.000</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Tujuan</label>
                  <textarea 
                    rows={3}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Alamat lengkap pengiriman..."
                  />
                </div>
                
                <button
                  onClick={() => {
                    handleUpdate('diantar', { type: 'delivery', fee: Number(deliveryFee) || 0, address: deliveryAddress })
                  }}
                  disabled={loading || !deliveryAddress}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Proses Pengantaran'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
