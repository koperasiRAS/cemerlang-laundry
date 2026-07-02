import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { addExpense } from './actions'
import { Plus } from 'lucide-react'

export default async function ExpensesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()

  const isStaff = profile?.role === 'staff'

  // Fetch expenses with user info
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengeluaran</h1>
          <p className="text-gray-600">Pencatatan biaya operasional, bahan baku, dll.</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-8 ${!isStaff ? 'lg:grid-cols-3' : ''}`}>
        {/* Form Tambah Pengeluaran */}
        {!isStaff && (
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
          <h2 className="text-xl font-semibold mb-4">Catat Pengeluaran Baru</h2>
          <form action={addExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="category" required className="w-full px-3 py-2 border rounded-md">
                <option value="operasional">Operasional (Listrik, Air, Sewa)</option>
                <option value="bahan_baku">Bahan Baku (Deterjen, Plastik)</option>
                <option value="gaji_karyawan">Gaji Karyawan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
              <input type="number" name="amount" required min="1" className="w-full px-3 py-2 border rounded-md" placeholder="Contoh: 50000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea name="description" required rows={3} className="w-full px-3 py-2 border rounded-md" placeholder="Contoh: Beli Rinso Anti Noda 2kg"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Simpan Pengeluaran
            </button>
          </form>
        </div>
        )}

        {/* Daftar Pengeluaran */}
        <div className={!isStaff ? "lg:col-span-2" : ""}>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 font-semibold text-gray-600">Tanggal</th>
                    <th className="p-4 font-semibold text-gray-600">Kategori</th>
                    <th className="p-4 font-semibold text-gray-600">Deskripsi</th>
                    <th className="p-4 font-semibold text-gray-600">Nominal</th>
                    <th className="p-4 font-semibold text-gray-600">Dicatat Oleh</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses?.map((expense) => (
                    <tr key={expense.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{new Date(expense.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year:'numeric'})}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 uppercase">
                          {expense.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{expense.description}</td>
                      <td className="p-4 font-bold text-red-600">Rp {expense.amount.toLocaleString('id-ID')}</td>
                      <td className="p-4 text-gray-600 text-sm">{expense.profiles?.name}</td>
                    </tr>
                  ))}
                  {(!expenses || expenses.length === 0) && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        Belum ada data pengeluaran.
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
