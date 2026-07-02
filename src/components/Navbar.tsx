'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart()

  return (
    <>
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24 md:h-28">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo-cemerlang-nobg.png" 
                alt="Cemerlang Laundry" 
                width={360} 
                height={100} 
                className="h-20 md:h-24 w-auto object-contain"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#layanan" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Layanan</Link>
              <Link href="/katalog" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Katalog</Link>
              <Link href="/#lokasi" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Lokasi</Link>
              <Link href="/tracking" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
                Lacak Pesanan
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link 
                href="/order" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5"
              >
                Pesan Jemputan
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  )
}
