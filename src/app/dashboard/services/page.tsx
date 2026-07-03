import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { addService, deactivateService } from './actions'
import { Trash2, Plus } from 'lucide-react'

export default async function ServicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Cek Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isStaff = profile?.role === 'staff'

  // Fetch Services
  const { data: services } = await supabase
    .from('service_types')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Jenis Layanan</h1>
      </div>

      <div className={`grid grid-cols-1 gap-8 ${!isStaff ? 'lg:grid-cols-3' : ''}`}>
        {/* Form Tambah Layanan */}
        {!isStaff && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Tambah Layanan Baru</h2>
          <form action={async (formData) => {
            'use server'
            await addService(formData)
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan</label>
              <input type="text" name="name" required className="w-full px-3 py-2 border rounded-md" placeholder="Contoh: Kiloan Reguler" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <select name="unit" required className="w-full px-3 py-2 border rounded-md">
                <option value="kg">Per Kilogram (kg)</option>
                <option value="item">Per Item (Satuan)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Dasar (Rp)</label>
              <input type="number" name="base_price" required min="0" className="w-full px-3 py-2 border rounded-md" placeholder="Contoh: 6000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Durasi (Jam)</label>
              <input type="number" name="estimated_duration_hours" required min="1" className="w-full px-3 py-2 border rounded-md" placeholder="Contoh: 48 (untuk 2 hari)" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Layanan
            </button>
          </form>
        </div>
        )}

        {/* Daftar Layanan */}
        <div className={!isStaff ? "lg:col-span-2" : ""}>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 font-semibold text-gray-600">Nama Layanan</th>
                    <th className="p-4 font-semibold text-gray-600">Satuan</th>
                    <th className="p-4 font-semibold text-gray-600">Harga Dasar</th>
                    <th className="p-4 font-semibold text-gray-600">Estimasi</th>
                    {!isStaff && <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>}
                  </tr>
                </thead>
              <tbody>
                {services?.map((service) => (
                  <tr key={service.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-medium">{service.name}</td>
                    <td className="p-4 text-gray-600">{service.unit === 'kg' ? 'Kiloan' : 'Satuan'}</td>
                    <td className="p-4 text-gray-600">Rp {service.base_price.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-gray-600">{service.estimated_duration_hours} Jam</td>
                    {!isStaff && (
                      <td className="p-4 text-right">
                        <form action={async () => {
                          'use server'
                          await deactivateService(service.id)
                        }}>
                          <button type="submit" className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors" title="Nonaktifkan Layanan">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
                {(!services || services.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Belum ada jenis layanan aktif.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
