'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ReportFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [start, setStart] = useState(searchParams.get('start') || '')
  const [end, setEnd] = useState(searchParams.get('end') || '')

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (start && end) {
      router.push(`/dashboard/reports?start=${start}&end=${end}`)
    }
  }

  return (
    <form onSubmit={handleApply} className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-xl shadow-sm border mb-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
        <input 
          type="date" 
          value={start} 
          onChange={(e) => setStart(e.target.value)} 
          required 
          className="px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
        <input 
          type="date" 
          value={end} 
          onChange={(e) => setEnd(e.target.value)} 
          required 
          className="px-3 py-2 border rounded-md"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium h-[42px]">
        Terapkan Filter
      </button>
    </form>
  )
}
