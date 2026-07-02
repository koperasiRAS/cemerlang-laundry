'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'

export default function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const currentQ = searchParams.get('q') || ''
  const currentStatus = searchParams.get('status') || 'semua'
  
  const [value, setValue] = useState(currentQ)

  useEffect(() => {
    setValue(currentQ)
  }, [currentQ])

  const handleSearch = (term: string) => {
    setValue(term)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (term) {
        params.set('q', term)
      } else {
        params.delete('q')
      }
      // maintain status
      if (currentStatus) {
        params.set('status', currentStatus)
      }
      router.replace(`/dashboard/orders?${params.toString()}`)
    })
  }

  return (
    <div className="relative w-full xl:w-72 shrink-0">
      <input 
        type="text" 
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Cari Resi atau Nama..." 
        className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white transition-all ${isPending ? 'opacity-70' : ''}`}
      />
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
    </div>
  )
}
