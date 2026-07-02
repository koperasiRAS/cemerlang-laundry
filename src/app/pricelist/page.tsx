import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Daftar Harga Lengkap - Cemerlang Laundry',
}

export default function PricelistPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Daftar Harga Lengkap</h1>
          <p className="text-gray-500 text-lg">Transparan, jujur, tanpa biaya tersembunyi. Pilih layanan sesuai kebutuhan pakaian Anda.</p>
        </div>

        {/* Section 1: Kiloan */}
        <div className="mb-12">
          <div className="bg-primary-600 text-white rounded-t-2xl py-4 px-6">
            <h2 className="text-2xl font-bold">1. Layanan Kiloan</h2>
          </div>
          <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              
              {/* Cuci Komplit */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Cuci Komplit</h3>
                  <span className="text-xs bg-primary-100 text-primary-700 font-bold px-2 py-1 rounded">Cuci + Setrika</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center pb-4 border-b border-gray-100 border-dashed">
                    <span className="text-gray-600 font-medium">3 Hari Selesai</span>
                    <span className="font-bold text-gray-900">Rp 7.000<span className="text-xs text-gray-500">/kg</span></span>
                  </li>
                  <li className="flex justify-between items-center pb-4 border-b border-gray-100 border-dashed">
                    <span className="text-gray-600 font-medium">2 Hari Selesai</span>
                    <span className="font-bold text-gray-900">Rp 9.000<span className="text-xs text-gray-500">/kg</span></span>
                  </li>
                  <li className="flex justify-between items-center pb-4 border-b border-gray-100 border-dashed bg-yellow-50/50 -mx-4 px-4">
                    <span className="text-gray-900 font-bold">1 Hari Selesai (Kilat)</span>
                    <span className="font-bold text-primary-600 text-lg">Rp 10.000<span className="text-xs text-gray-500">/kg</span></span>
                  </li>
                  <li className="flex justify-between items-center pb-4 border-b border-gray-100 border-dashed">
                    <span className="text-gray-600 font-medium">12 Jam Selesai</span>
                    <span className="font-bold text-gray-900">Rp 15.000<span className="text-xs text-gray-500">/kg</span></span>
                  </li>
                  <li className="flex justify-between items-center pt-2">
                    <span className="text-gray-600 font-medium">Cuci Kering Lipat (3 Jam)</span>
                    <span className="font-bold text-gray-900">Rp 5.000<span className="text-xs text-gray-500">/kg</span></span>
                  </li>
                </ul>
              </div>

              {/* Setrika Saja */}
              <div className="p-6 md:p-8 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Setrika Komplit</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">Hanya Setrika</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center pb-4 border-b border-gray-100 border-dashed">
                    <span className="text-gray-600 font-medium">3 Hari Selesai</span>
                    <span className="font-bold text-gray-900">Rp 5.000<span className="text-xs text-gray-500">/kg</span></span>
                  </li>
                  <li className="flex justify-between items-center pb-4 border-b border-gray-100 border-dashed">
                    <span className="text-gray-600 font-medium">2 Hari Selesai</span>
                    <span className="font-bold text-gray-900">Rp 6.500<span className="text-xs text-gray-500">/kg</span></span>
                  </li>
                  <li className="flex justify-between items-center pt-2">
                    <span className="text-gray-600 font-medium">1 Hari Selesai</span>
                    <span className="font-bold text-gray-900">Rp 8.000<span className="text-xs text-gray-500">/kg</span></span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Section 2: Satuan Rumah Tangga */}
        <div className="mb-12">
          <div className="bg-slate-800 text-white rounded-t-2xl py-4 px-6">
            <h2 className="text-2xl font-bold">2. Satuan Rumah Tangga</h2>
          </div>
          <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <PriceRow name="Bed Cover Besar" price="35.000" />
              <PriceRow name="Bed Cover Kecil" price="25.000" />
              <PriceRow name="Selimut" price="15.000" />
              <PriceRow name="Sprei Biasa" price="10.000" />
              <PriceRow name="Sprei Rumbai" price="15.000" />
              <PriceRow name="Sprei 1 Set (Max Bantal 6)" price="20.000" />
              <PriceRow name="Boneka Besar" price="50.000" />
              <PriceRow name="Boneka Sedang" price="30.000" />
              <PriceRow name="Boneka Kecil" price="15.000" />
              <PriceRow name="Gordyn Tebal / Meter" price="7.000" />
              <PriceRow name="Gordyn Tipis (Vitrase) / Meter" price="5.000" />
              <PriceRow name="Tas Ransel" price="25.000" />
              <PriceRow name="Koper Besar" price="60.000" />
              <PriceRow name="Koper Kecil" price="45.000" />
              <PriceRow name="Handuk Besar" price="10.000" />
            </div>
          </div>
        </div>

        {/* Section 3: Satuan Pakaian Khusus */}
        <div className="mb-12">
          <div className="bg-slate-800 text-white rounded-t-2xl py-4 px-6">
            <h2 className="text-2xl font-bold">3. Satuan Pakaian & Khusus</h2>
          </div>
          <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <PriceRow name="Pakaian Pengantin" price="> 125.000" />
              <PriceRow name="Baju Pesta" price="> 75.000" />
              <PriceRow name="Jas Setelan" price="40.000" />
              <PriceRow name="Safari Setelan" price="35.000" />
              <PriceRow name="Rok & Blouse" price="35.000" />
              <PriceRow name="Kebaya Panjang" price="30.000" />
              <PriceRow name="Jas" price="25.000" />
              <PriceRow name="Long Dress" price="25.000" />
              <PriceRow name="Kebaya Pendek" price="20.000" />
              <PriceRow name="Safari" price="20.000" />
              <PriceRow name="Blouse" price="15.000" />
              <PriceRow name="Jacket Kulit" price="45.000" />
              <PriceRow name="Jacket" price="15.000" />
              <PriceRow name="Kemeja" price="15.000" />
              <PriceRow name="Sweater" price="15.000" />
              <PriceRow name="Celana Panjang" price="15.000" />
              <PriceRow name="Celana Jeans" price="17.000" />
              <PriceRow name="Celana Pendek" price="10.000" />
              <PriceRow name="Rok" price="15.000" />
              <PriceRow name="T-Shirt" price="12.000" />
              <PriceRow name="Sarung" price="10.000" />
              <PriceRow name="Rompi" price="10.000" />
              <PriceRow name="Topi" price="10.000" />
              <PriceRow name="Dasi" price="8.000" />
              <PriceRow name="Kerudung" price="8.000" />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12 pb-12">
          <Link 
            href="/order" 
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-primary-500/30 hover:-translate-y-1"
          >
            Pesan Jemputan Sekarang <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>

      </div>
    </div>
  )
}

function PriceRow({ name, price }: { name: string, price: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 border-dashed">
      <span className="text-gray-600 font-medium">{name}</span>
      <span className="font-bold text-gray-900">Rp {price}</span>
    </div>
  )
}
