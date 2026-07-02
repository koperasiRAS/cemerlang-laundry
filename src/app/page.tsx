import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import FeaturedProducts from '@/components/FeaturedProducts'
import { 
  Package, 
  MapPin, 
  Truck, 
  Star, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  Phone,
  Mail,
  Shirt,
  ShoppingCart,
  Store,
  Map,
  Camera
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cemerlang Laundry - Solusi Cuci Bersih & Wangi',
  description: 'Layanan laundry premium dengan fasilitas antar-jemput gratis. Cuci komplit, setrika, karpet, dan sepatu.',
}

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-primary-200/50 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-96 h-96 bg-blue-200/50 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-semibold text-sm mb-8">
              <Star className="w-4 h-4 fill-primary-500" />
              <span>Laundry No.1 Pilihan Keluarga</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-tight">
              Cucian Numpuk? <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                Biar Kami Yang Urus!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nikmati waktu santai Anda tanpa pusing memikirkan cucian. Kami berikan layanan laundry premium dengan fasilitas antar-jemput tepat waktu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/order" 
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/30 hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                <Truck className="w-5 h-5 group-hover:animate-bounce" />
                Pesan Jemputan Sekarang
              </Link>
              <Link 
                href="/tracking" 
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                <Package className="w-5 h-5 text-primary-600" />
                Lacak Pesanan Saya
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-16 pt-10 border-t border-gray-200/60 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Garansi Bersih</h3>
                  <p className="text-sm text-gray-500">Cucian tidak bersih? Kami cuci ulang gratis tanpa biaya tambahan.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Tepat Waktu</h3>
                  <p className="text-sm text-gray-500">Pengerjaan super cepat dan pengantaran sesuai jadwal yang disepakati.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Antar Jemput</h3>
                  <p className="text-sm text-gray-500">Tinggal klik dari HP, kurir kami siap menjemput cucian ke depan pintu rumah.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Layanan Unggulan Kami</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Berbagai pilihan layanan disesuaikan dengan kebutuhan pakaian dan keluarga Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cuci Komplit (Kiloan)</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">Pakaian dicuci bersih, dikeringkan sempurna, dilipat rapi, dan disetrika wangi. Siap langsung masuk lemari.</p>
              <div className="font-black text-2xl text-primary-600 mb-4">Rp 7.000<span className="text-sm text-gray-500 font-medium">/kg</span></div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle /> Selesai 2 Hari</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle /> Setrika Uap</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle /> Parfum Premium</li>
              </ul>
              <Link href="/order" className="text-primary-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Pesan Sekarang <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-primary-600 rounded-3xl p-8 border border-primary-500 shadow-2xl shadow-primary-500/20 transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1.5 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider">
                Paling Laris
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cuci Kilat 1 Hari</h3>
              <p className="text-primary-100 mb-6 line-clamp-3">Butuh pakaian bersih segera? Layanan express kami menjamin pakaian Anda selesai dalam 24 jam.</p>
              <div className="font-black text-2xl text-white mb-4">Rp 10.000<span className="text-sm text-primary-200 font-medium">/kg</span></div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm text-primary-100"><CheckCircle isWhite /> Selesai 24 Jam</li>
                <li className="flex items-center gap-2 text-sm text-primary-100"><CheckCircle isWhite /> Prioritas Mesin</li>
                <li className="flex items-center gap-2 text-sm text-primary-100"><CheckCircle isWhite /> Garansi Tepat Waktu</li>
              </ul>
              <Link href="/order" className="bg-white text-primary-700 w-full py-3 rounded-xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors">
                Pesan Sekarang
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shirt className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cuci Satuan / Premium</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">Perawatan khusus untuk jas, gaun, sepatu, karpet, atau bed cover dengan penanganan profesional.</p>
              <div className="font-black text-2xl text-orange-600 mb-4">Mulai Rp 15k<span className="text-sm text-gray-500 font-medium">/item</span></div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle /> Treatment Khusus</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle /> Anti Luntur</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle /> Packing Premium</li>
              </ul>
              <Link href="/order" className="text-orange-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Pesan Sekarang <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/pricelist" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1">
              Lihat Daftar Harga Lengkap <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-slate-100 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary-600 font-bold mb-2">
                <Camera className="w-5 h-5" />
                <span>Galeri Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Mengintip Dapur Laundry</h2>
            </div>
            <p className="text-gray-500 max-w-md">Mesin cuci modern, lingkungan yang bersih, dan standar kerapian tinggi adalah kunci pelayanan kami.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group h-64 md:h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80" alt="Deretan Mesin Cuci" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-bold text-lg">Mesin Modern & Bersih</span>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden group h-40 md:h-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1582735689369-4fe89b715645?w=600&q=80" alt="Pakaian Terlipat Rapi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="relative rounded-3xl overflow-hidden group h-40 md:h-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=80" alt="Suasana Toko" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="col-span-2 relative rounded-3xl overflow-hidden group h-40 md:h-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80" alt="Tumpukan Baju Laundry" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="produk" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 font-bold mb-3 bg-primary-50 px-4 py-2 rounded-full">
              <Store className="w-4 h-4" />
              <span>Toko Cemerlang</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Perawatan Pakaian di Rumah</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Kami tidak hanya mencuci, kami juga menyediakan produk perawatan terbaik yang biasa kami gunakan untuk Anda bawa pulang.</p>
          </div>

          <FeaturedProducts />

          <div className="mt-12 text-center">
            <Link 
              href="/katalog" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1">
              Lihat Katalog Produk <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Location / Map Section */}
      <section id="lokasi" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-400 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary-400 font-bold mb-4 bg-primary-900/50 px-4 py-2 rounded-full border border-primary-500/30">
                <Map className="w-4 h-4" />
                <span>Kunjungi Kami</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6">Lokasi Strategis <br/>di Pusat Depok</h2>
              <p className="text-gray-400 text-lg mb-8">
                Toko kami mudah dijangkau dengan area parkir yang luas. Silakan mampir untuk melakukan *drop-off* cucian Anda secara langsung.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Alamat Lengkap</h4>
                    <p className="text-gray-400 mt-1 leading-relaxed">
                      Jl. Boulevard Grand Depok City,<br/>
                      Jatimulya, Kec. Cilodong,<br/>
                      Kota Depok, Jawa Barat 16413
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <Clock className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Jam Operasional</h4>
                    <p className="text-gray-400 mt-1">Setiap Hari: 07:00 - 21:00 WIB</p>
                  </div>
                </div>
              </div>
              
              <a 
                href="https://maps.google.com/?q=Jl.+Boulevard+Grand+Depok+City,+Jatimulya,+Kec.+Cilodong,+Kota+Depok,+Jawa+Barat+16413" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-10 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold transition-colors"
              >
                Arahkan ke Lokasi <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            
            <div className="h-[400px] lg:h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-gray-800">
               {/* Embed Google Maps */}
               <iframe 
                src="https://maps.google.com/maps?q=Jl.%20Boulevard%20Grand%20Depok%20City,%20Jatimulya,%20Kec.%20Cilodong,%20Kota%20Depok,%20Jawa%20Barat%2016413&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="cara-kerja" className="py-20 bg-slate-50 border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Cara Kerja Kami</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Hanya dengan 3 langkah mudah, serahkan urusan cuci mencuci kepada kami.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
            
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center relative z-10">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black border-4 border-white shadow-md">1</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Pesan Online</h4>
              <p className="text-gray-500 text-sm">Isi form penjemputan via website tanpa perlu registrasi akun.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center relative z-10">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black border-4 border-white shadow-md">2</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Kami Jemput & Cuci</h4>
              <p className="text-gray-500 text-sm">Kurir kami akan mengambil cucian Anda, dan tim kami mencuci hingga bersih.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center relative z-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black border-4 border-white shadow-md">3</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Selesai & Diantar</h4>
              <p className="text-gray-500 text-sm">Cucian yang sudah wangi dan rapi akan diantar kembali ke pintu rumah Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <Image 
                  src="/images/logo-cemerlang-nobg.png" 
                  alt="Cemerlang Laundry" 
                  width={240} 
                  height={72} 
                  className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 mb-8 max-w-sm">
                Mitra kebersihan pakaian keluarga Anda. Solusi cerdas untuk hidup yang lebih praktis dan efisien.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Pintasan</h4>
              <ul className="space-y-3">
                <li><Link href="/order" className="text-gray-400 hover:text-white transition-colors">Pesan Jemputan</Link></li>
                <li><Link href="/tracking" className="text-gray-400 hover:text-white transition-colors">Cek Status Pesanan</Link></li>
                <li><a href="#produk" className="text-gray-400 hover:text-white transition-colors">Katalog Produk</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Informasi Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Kebijakan Privasi</Link></li>
                <li><Link href="/refund" className="text-gray-400 hover:text-white transition-colors">Kebijakan Refund</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Cemerlang Laundry. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Jl. Boulevard Grand Depok City</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> 6287779560264</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CheckCircle({ isWhite = false }: { isWhite?: boolean }) {
  return (
    <svg 
      className={`w-5 h-5 ${isWhite ? 'text-primary-100' : 'text-primary-600'}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
