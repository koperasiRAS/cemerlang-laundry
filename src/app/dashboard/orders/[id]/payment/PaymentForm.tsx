'use client'

import { useState, useRef, useEffect } from 'react'
import { processPayment } from './actions'
import { useRouter } from 'next/navigation'
import { Loader2, Banknote, CreditCard, QrCode, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentForm({ orderId, defaultPrice }: { orderId: string, defaultPrice: number }) {
  const [method, setMethod] = useState('cash')
  const [finalPrice, setFinalPrice] = useState(defaultPrice)
  const [cashGiven, setCashGiven] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const cashInputRef = useRef<HTMLInputElement>(null)

  const given = parseInt(cashGiven) || 0
  const change = given - finalPrice

  useEffect(() => {
    if (method === 'cash') {
      cashInputRef.current?.focus()
    }
  }, [method])

  const quickAmounts = [
    Math.ceil(finalPrice / 10000) * 10000,
    Math.ceil(finalPrice / 50000) * 50000,
    Math.ceil(finalPrice / 100000) * 100000,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= finalPrice) // Unique and enough amounts

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (method === 'cash' && given < finalPrice) {
      toast.error('Uang yang diterima kurang dari total tagihan!')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Memproses pembayaran...')
    
    const res = await processPayment(orderId, method, finalPrice)
    
    if (res.error) {
      toast.error(res.error, { id: toastId })
      setLoading(false)
    } else {
      toast.success('Pembayaran berhasil!', { id: toastId })
      router.push(`/dashboard/orders/${orderId}?print=true`)
    }
  }

  return (
    <form onSubmit={handleProcess} className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-lg mx-auto mt-8">
      <div className="text-center mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Tagihan</h2>
        <div className="relative inline-block">
          <span className="absolute top-2 -left-8 text-2xl font-bold text-gray-400">Rp</span>
          <input 
            type="number" 
            value={finalPrice || ''} 
            onChange={(e) => setFinalPrice(parseInt(e.target.value) || 0)} 
            className="w-full bg-transparent border-b-2 border-dashed border-gray-300 focus:border-primary-500 text-5xl md:text-6xl font-black text-gray-900 text-center py-2 focus:outline-none transition-colors" 
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">*Dapat disesuaikan jika ada diskon/biaya tambahan</p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-3">Pilih Metode Pembayaran</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setMethod('cash')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
              method === 'cash' ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Banknote className={`w-6 h-6 ${method === 'cash' ? 'text-primary-600' : ''}`} />
            <span className="font-semibold text-sm">Tunai</span>
          </button>
          
          <button
            type="button"
            onClick={() => setMethod('transfer')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
              method === 'transfer' ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CreditCard className={`w-6 h-6 ${method === 'transfer' ? 'text-primary-600' : ''}`} />
            <span className="font-semibold text-sm">Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('qris')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
              method === 'qris' ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
            }`}
          >
            <QrCode className={`w-6 h-6 ${method === 'qris' ? 'text-primary-600' : ''}`} />
            <span className="font-semibold text-sm">QRIS Manual</span>
          </button>
        </div>
      </div>

      {method === 'cash' && (
        <div className="mb-8 space-y-5 p-5 md:p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-gray-700">Uang Diterima</label>
              {given < finalPrice && cashGiven !== '' && (
                <span className="text-xs font-bold text-red-500">Uang kurang!</span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
              <input 
                ref={cashInputRef}
                type="number" 
                required 
                value={cashGiven} 
                onChange={(e) => setCashGiven(e.target.value)} 
                className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-xl font-bold ${
                  given >= finalPrice || cashGiven === '' 
                    ? 'border-gray-200 focus:border-primary-500 focus:ring-primary-500/20' 
                    : 'border-red-300 focus:border-red-500 focus:ring-red-500/20 text-red-600'
                }`} 
                placeholder="0"
              />
            </div>
            
            {/* Quick amount suggestions */}
            {quickAmounts.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
                <button type="button" onClick={() => setCashGiven(finalPrice.toString())} className="shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:border-primary-200 transition-colors">
                  Uang Pas
                </button>
                {quickAmounts.map(amt => (
                  <button key={amt} type="button" onClick={() => setCashGiven(amt.toString())} className="shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:border-primary-200 transition-colors">
                    {(amt/1000).toString()}k
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Kembalian</label>
            <div className={`text-4xl font-black tracking-tight ${change < 0 ? 'text-red-500' : 'text-green-500'}`}>
              Rp {Math.max(0, change).toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      )}

      {(method === 'transfer' || method === 'qris') && (
        <div className="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
          <div className="shrink-0 mt-0.5">
             <CheckCircle2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Verifikasi Manual</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Pastikan Anda sudah mengecek mutasi rekening atau notifikasi {method.toUpperCase()} masuk sebelum menekan tombol Proses Pembayaran.
            </p>
          </div>
        </div>
      )}

        <button 
          disabled={loading || (method === 'cash' && given < finalPrice)} 
          type="submit" 
          className="w-full bg-primary-600 text-white px-4 py-4 rounded-xl hover:bg-primary-700 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/30"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Selesaikan Pembayaran'}
        </button>
    </form>
  )
}
