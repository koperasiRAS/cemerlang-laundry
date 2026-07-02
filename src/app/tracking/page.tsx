import { Metadata } from 'next'
import TrackingClient from './TrackingClient'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Cek Status Laundry - Cemerlang Laundry',
  description: 'Lacak status pesanan laundry Anda secara real-time.',
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:p-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="mr-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Image 
              src="/images/logo-cemerlang-nobg.png" 
              alt="Cemerlang Laundry" 
              width={280} 
              height={80} 
              className="h-16 sm:h-20 w-auto object-contain"
              priority
            />
          </div>
          <Link href="/order" className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg transition-colors">
            Pesan Jemputan
          </Link>
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
