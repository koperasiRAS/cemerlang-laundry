import { Metadata } from 'next'
import TrackingClient from './TrackingClient'
import { Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cek Status Laundry - Cemerlang Laundry',
  description: 'Lacak status pesanan laundry Anda secara real-time.',
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:p-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <Package className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Cemerlang Laundry</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 md:p-8 pt-12 md:pt-20">
        <TrackingClient />
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Cemerlang Laundry. All rights reserved.</p>
        <p className="mt-1 text-xs text-gray-400">Hubungi kami jika ada pertanyaan mengenai pesanan Anda.</p>
      </footer>
    </div>
  )
}
