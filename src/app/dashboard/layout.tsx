import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from './Sidebar'
import NotificationBell from '@/components/NotificationBell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Verify auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Get user role safely using RPC
  const { data: role } = await supabase.rpc('get_current_user_role')

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Component with Role Passed */}
      <Sidebar userRole={role} userName={user.email?.split('@')[0] || 'User'} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center sticky top-0 z-20">
          <h1 className="font-bold text-primary-600 text-lg">Cemerlang</h1>
          <div className="flex items-center gap-2 pr-12">
            <NotificationBell />
          </div>
        </div>
        
        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
