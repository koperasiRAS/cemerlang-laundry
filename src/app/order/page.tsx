'use client';

import { useState } from 'react';
import { submitPickupRequest } from './actions';
import { Droplets, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function OrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ reference: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await submitPickupRequest(formData);
      if (result.error) {
        toast.error('Gagal mengirim permintaan: ' + result.error);
      } else if (result.success && result.reference_number) {
        toast.success('Permintaan berhasil dikirim!');
        setSuccessData({ reference: result.reference_number });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan yang tidak terduga.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Permintaan Diterima!</h2>
          <p className="text-gray-600">
            Terima kasih, tim kami akan segera menghubungi Anda untuk konfirmasi jadwal penjemputan.
          </p>
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
            <p className="text-sm text-primary-700 font-medium mb-1">Nomor Referensi Anda</p>
            <p className="text-2xl font-bold text-primary-900">{successData.reference}</p>
          </div>
          <div className="pt-4 space-y-3">
            <Link 
              href="/tracking" 
              className="block w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Cek Status Pesanan
            </Link>
            <Link 
              href="/" 
              className="block w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 relative">
      <Link href="/" className="absolute top-4 left-4 sm:top-8 sm:left-8 p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-2 font-medium">
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Kembali</span>
      </Link>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <Image 
              src="/images/logo-cemerlang-nobg.png" 
              alt="Cemerlang Laundry" 
              width={400} 
              height={120} 
              className="h-24 sm:h-32 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Minta Penjemputan
          </h1>
          <p className="text-gray-600">
            Isi formulir di bawah ini dan kurir kami akan mengambil cucian langsung ke rumah Anda.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {/* Data Diri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Kontak</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nama Lengkap *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Budi Santoso"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nomor WhatsApp *</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="081234567890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Alamat Lengkap *</label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  placeholder="Jl. Mawar No. 123, RT 01/RW 02, Kelurahan..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Link Google Maps (Opsional)</label>
                <input
                  name="maps_link"
                  type="url"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="https://maps.app.goo.gl/..."
                />
                <p className="text-xs text-gray-500">Membantu kurir kami menemukan lokasi Anda dengan lebih cepat.</p>
              </div>
            </div>

            {/* Layanan & Jadwal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Detail Layanan</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estimasi Layanan</label>
                <select
                  name="service_type"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="Cuci Komplit (Kiloan)">Cuci Komplit (Kiloan)</option>
                  <option value="Setrika Saja (Kiloan)">Setrika Saja (Kiloan)</option>
                  <option value="Cuci Satuan">Cuci Satuan</option>
                  <option value="Belum Tahu (Cek di tempat)">Belum Tahu (Cek di tempat)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tanggal Jemput *</label>
                  <input
                    name="date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Waktu Jemput *</label>
                  <select
                    name="time_slot"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Pilih Waktu</option>
                    <option value="Pagi 08:00-12:00">Pagi (08:00 - 12:00)</option>
                    <option value="Siang 12:00-17:00">Siang (12:00 - 17:00)</option>
                    <option value="Sore 17:00-20:00">Sore (17:00 - 20:00)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Metode Pengembalian *</label>
                <select
                  name="return_method"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="ambil_sendiri">Ambil Sendiri di Toko</option>
                  <option value="diantar">Minta Diantar Kembali</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Catatan Khusus (Opsional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  placeholder="Misal: Pagar warna hitam, tolong klakson..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-primary-500/20"
              >
                {isSubmitting ? 'Memproses...' : (
                  <>
                    Pesan Sekarang <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Sudah pesan? <Link href="/tracking" className="text-primary-600 font-medium hover:underline">Lacak status pesanan Anda di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
