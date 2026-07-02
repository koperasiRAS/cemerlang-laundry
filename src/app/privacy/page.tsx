import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Cemerlang Laundry',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Kebijakan Privasi</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p>Terakhir diperbarui: 2 Juli 2026</p>
            <p>Cemerlang Laundry sangat menghargai dan melindungi privasi informasi pelanggan kami. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h3>
            <p>Saat Anda menggunakan layanan kami (baik melalui aplikasi pemesanan online atau datang langsung), kami mengumpulkan informasi dasar berikut:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Nama Lengkap</li>
              <li>Nomor Telepon / WhatsApp</li>
              <li>Alamat Penjemputan / Pengantaran (jika menggunakan layanan kurir)</li>
              <li>Detail pesanan laundry dan preferensi layanan Anda.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Penggunaan Informasi</h3>
            <p>Data pribadi Anda kami gunakan **hanya** untuk keperluan operasional layanan kami, yang meliputi:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Mencatat pesanan dan menautkan nomor resi dengan identitas Anda.</li>
              <li>Menghubungi Anda via WhatsApp untuk konfirmasi penjemputan, status pesanan, dan konfirmasi pengantaran.</li>
              <li>Mengirimkan kurir kami ke alamat Anda secara akurat.</li>
              <li>Menyelesaikan proses pembayaran.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Keamanan Data</h3>
            <p>Cemerlang Laundry berkomitmen untuk menjaga keamanan data pribadi Anda. Kami menggunakan sistem basis data berstandar industri (Supabase) yang dienkripsi dan diakses secara terbatas hanya oleh staf yang bertugas (kasir dan kurir).</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Berbagi Informasi Pihak Ketiga</h3>
            <p>Kami **tidak akan pernah** menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk keperluan *marketing* atau apa pun, kecuali:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kepada penyedia layanan pembayaran resmi kami (DOKU Payment Gateway) hanya untuk keperluan pemrosesan transaksi yang diinisiasi oleh Anda.</li>
              <li>Bila diwajibkan oleh proses hukum atau otoritas pemerintahan yang sah.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Menghubungi Kami</h3>
            <p>Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, atau ingin meminta penghapusan data Anda dari sistem kami setelah layanan selesai, Anda dapat menghubungi kami melalui:</p>
            <p><strong>WhatsApp:</strong> 6287779560264<br/><strong>Email:</strong> admin@cemerlanglaundry.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
