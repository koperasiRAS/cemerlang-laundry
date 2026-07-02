import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - Cemerlang Laundry',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Syarat dan Ketentuan Layanan</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p>Terakhir diperbarui: 2 Juli 2026</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Layanan Kami</h3>
            <p>Cemerlang Laundry menyediakan layanan pencucian, pengeringan, dan penyetrikaan pakaian (kiloan maupun satuan) serta fasilitas antar-jemput. Dengan menggunakan layanan kami, Anda menyetujui seluruh syarat dan ketentuan yang berlaku.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Perhitungan Berat dan Harga</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Berat pakaian ditimbang dan dicatat oleh staf kami saat penerimaan/penjemputan.</li>
              <li>Untuk layanan kiloan, jika ada item khusus (seperti jas, selimut, karpet), akan dihitung terpisah sesuai harga satuan.</li>
              <li>Harga akhir adalah harga yang tertera di nota digital yang kami berikan.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Waktu Pengerjaan dan Pengantaran</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Layanan reguler diselesaikan dalam estimasi waktu 2 (dua) hari kerja sejak pakaian diterima di toko.</li>
              <li>Jika layanan antar-jemput mengalami keterlambatan karena kendala cuaca atau teknis, staf kami akan menginformasikan melalui WhatsApp.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Komplain dan Ganti Rugi (Garansi)</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Komplain atas pakaian hilang, rusak, atau luntur wajib dilaporkan selambat-lambatnya 1 x 24 jam setelah pakaian diterima oleh pelanggan.</li>
              <li>Komplain wajib menyertakan video *unboxing* paket pakaian sebagai bukti.</li>
              <li>Cemerlang Laundry memberikan garansi cuci ulang gratis untuk pakaian yang dianggap masih kotor atau bau.</li>
              <li>Ganti rugi pakaian hilang atau rusak maksimal adalah 10x (sepuluh kali) harga jasa cuci item tersebut, tidak menanggung nilai faktual pakaian.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Pengambilan Barang</h3>
            <p>Pakaian yang telah selesai dicuci dan tidak diambil lebih dari 30 hari kalender bukan lagi menjadi tanggung jawab Cemerlang Laundry apabila terjadi kehilangan atau kerusakan. Setelah 60 hari, pakaian dapat disumbangkan oleh pihak manajemen.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Pembayaran</h3>
            <p>Kami menerima pembayaran melalui Transfer Bank, QRIS (DOKU Payment Gateway), dan Tunai. Pembayaran harus dilunasi sebelum atau pada saat pakaian diserahkan kembali kepada Anda.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
