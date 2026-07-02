'use client'

import { useState } from 'react'
import { createStaffAccount } from './actions'
import { Loader2, Plus } from 'lucide-react'

export default function NewStaffForm({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createStaffAccount(formData)
    
    if (res.error) {
      alert(res.error)
    } else {
      setIsOpen(false)
      ;(e.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium">
        <Plus className="w-5 h-5" /> Tambah Akun
      </button>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 mb-8 max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Buat Akun Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
          <input type="text" name="full_name" required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" required placeholder="staff1@cemerlang.com" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="text" name="password" required minLength={6} placeholder="Minimal 6 karakter" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        
        {isSuperAdmin && (
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select name="role" className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="staff">Staff</option>
              <option value="owner">Owner</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Hanya Super Admin yang dapat membuat akun Owner.</p>
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Buat Akun
          </button>
          <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium">
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
