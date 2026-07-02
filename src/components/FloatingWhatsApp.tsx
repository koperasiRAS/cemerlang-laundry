"use client"

import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function FloatingWhatsApp() {
  const pathname = usePathname()
  
  // Hanya tampilkan di Landing Page dan Halaman Tracking (untuk customer)
  if (pathname !== '/' && !pathname?.startsWith('/tracking')) {
    return null
  }

  const WHATSAPP_NUMBER = "6287779560264"
  const message = "Halo Cemerlang Laundry, saya ingin bertanya tentang layanan Anda."

  return (
    <a 
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg shadow-green-500/30 hover:scale-105 transition-transform duration-300 flex items-center gap-2 font-medium"
    >
      <MessageCircle className="w-5 h-5" />
      Chat via WhatsApp
    </a>
  )
}
