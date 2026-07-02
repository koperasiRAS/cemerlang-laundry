'use client'

import { toggleStaffStatus } from './actions'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function ToggleStatusButton({ id, isActive, targetRole }: { id: string, isActive: boolean, targetRole: 'staff'|'owner' }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (!confirm(`Apakah Anda yakin ingin ${isActive ? 'menonaktifkan' : 'mengaktifkan'} akun ini?`)) return
    
    setLoading(true)
    const res = await toggleStaffStatus(id, isActive, targetRole)
    if (res.error) {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1 text-xs font-bold rounded-full ${
        isActive 
          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
          : 'bg-green-100 text-green-700 hover:bg-green-200'
      } disabled:opacity-50 flex items-center justify-center`}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isActive ? 'Nonaktifkan' : 'Aktifkan'}
    </button>
  )
}
