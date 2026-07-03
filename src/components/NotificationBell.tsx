'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function NotificationBell() {
  const [pendingCount, setPendingCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('pickup_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Baru')
      setPendingCount(count || 0)
    }
    
    fetchCount()
    
    const interval = setInterval(fetchCount, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Link href="/dashboard/pickups" className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100">
      <Bell size={24} />
      {pendingCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full animate-bounce">
          {pendingCount}
        </span>
      )}
    </Link>
  )
}
