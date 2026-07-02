import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewStaffForm from './NewStaffForm'
import ToggleStatusButton from './ToggleStatusButton'
import { ShieldCheck, User } from 'lucide-react'

export default async function StaffPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/dashboard/orders')
  }

  const isSuperAdmin = profile.role === 'super_admin'
  const isStaff = profile.role === 'staff'

  // Fetch profiles based on role
  // Owner only sees staff
  // Super Admin sees owner and staff
  let query = supabase.from('profiles').select('id, name, role, is_active, created_at').order('created_at', { ascending: true })
  
  if (!isSuperAdmin) {
    query = query.eq('role', 'staff') // owner and staff only see staff list, not superadmin
  }

  const { data: staffList } = await query

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Pegawai</h1>
        <p className="text-gray-600">
          Kelola akun pegawai {isSuperAdmin && "dan owner"} yang memiliki akses ke sistem.
        </p>
      </div>

      {!isStaff && <NewStaffForm isSuperAdmin={isSuperAdmin} />}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Daftar Akun Sistem</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm">
                <th className="p-4 font-semibold text-gray-600">Nama</th>
                <th className="p-4 font-semibold text-gray-600">Role Akses</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Terdaftar Pada</th>
                <th className="p-4 font-semibold text-gray-600">Terdaftar Pada</th>
                {!isStaff && <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {staffList?.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{s.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center inline-flex gap-1 ${
                      s.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                      s.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {s.role === 'owner' ? <ShieldCheck className="w-3 h-3"/> : <User className="w-3 h-3"/>}
                      {s.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {s.is_active ? 'AKTIF' : 'NONAKTIF'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(s.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(s.created_at).toLocaleDateString('id-ID')}
                  </td>
                  {!isStaff && (
                    <td className="p-4 text-right flex justify-end">
                      {s.role !== 'super_admin' && (
                        <ToggleStatusButton id={s.id} isActive={s.is_active} targetRole={s.role as any} />
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {(!staffList || staffList.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Tidak ada akun ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
