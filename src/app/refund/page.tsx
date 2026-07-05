import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kebijakan Pengembalian Dana - Cemerlang Laundry',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Kebijakan Pengembalian Dana (Refund)</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p>Terakhir diperbarui: 2 Juli 2026</p>
            <p>Cemerlang Laundry senantiasa berusaha memberikan layanan terbaik. Namun, kami memahami bahwa terkadang kendala dapat terjadi. Berikut adalah kebijakan pengembalian dana (refund) untuk layanan kami.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Kondisi yang Memenuhi Syarat Refund</h3>
            <p>Pengembalian dana hanya dapat diajukan jika memenuhi salah satu kondisi berikut:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Pesanan Dibatalkan:</strong> Pelanggan membatalkan pesanan *sebelum* kurir kami melakukan penjemputan atau sebelum cucian masuk ke proses pencucian (berlaku untuk pembayaran di muka).</li>
              <li><strong>Kelebihan Pembayaran (Overcharge):</strong> Terdapat kesalahan sistem atau kasir yang menyebabkan pelanggan membayar lebih dari total nota yang seharusnya.</li>
              <li><strong>Barang Hilang atau Rusak Parah:</strong> Seperti yang tertulis pada Syarat & Ketentuan, jika pakaian pelanggan hilang atau rusak parah akibat proses kami, pelanggan berhak menerima kompensasi maksimal 10x dari harga jasa item/kiloan tersebut.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Kondisi yang Tidak Memenuhi Syarat Refund</h3>
            <p>Kami **tidak melayani** pengembalian dana untuk kondisi berikut:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Pakaian sudah selesai dicuci namun pelanggan merasa hasilnya kurang memuaskan (untuk kasus ini, kami memberikan **Garansi Cuci Ulang Gratis**, bukan *refund*).</li>
              <li>Pelanggan membatalkan pesanan secara sepihak *setelah* pakaian mulai dicuci.</li>
              <li>Komplain diajukan lebih dari 1x24 jam setelah pakaian diserahkan kembali kepada pelanggan.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Prosedur Pengajuan Refund</h3>
            <p>Untuk mengajukan pengembalian dana, pelanggan harus mengikuti langkah-langkah berikut:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Hubungi layanan pelanggan kami via WhatsApp di nomor <strong>6282138056837</strong>.</li>
              <li>Sertakan Nomor Resi Pesanan (`LDY-xxxx`), nama lengkap, dan alasan pengajuan *refund*.</li>
              <li>Lampirkan bukti foto atau video jika terkait kerusakan barang.</li>
              <li>Tim kami akan meninjau laporan Anda selambat-lambatnya 2x24 jam kerja.</li>
            </ol>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Proses Pengiriman Dana</h3>
            <p>Jika pengajuan pengembalian dana disetujui, dana akan dikirimkan kembali melalui transfer bank ke rekening atas nama pemesan dalam waktu 1-3 hari kerja sejak tanggal persetujuan.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
