'use client'

import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'

interface Props {
  orderId: string
  className?: string
}

export default function DokuCheckoutButton({ orderId, className = '' }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/doku/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pembayaran')
      }
      
      // Redirect to DOKU payment page
      if (data.payment_url) {
        window.location.href = data.payment_url
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <button 
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 hover:-translate-y-1"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
        Bayar Sekarang (DOKU)
      </button>
      {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
    </div>
  )
}
