'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from './actions'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  ListOrdered, 
  Users, 
  UserSquare2, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Droplets,
  FileText,
  Package,
  Wallet,
  Truck,
  ClipboardList
} from 'lucide-react'

export default function Sidebar({ userRole, userName }: { userRole: string, userName: string }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false) // For mobile
  const [isCollapsed, setIsCollapsed] = useState(false) // For desktop

  const isOwner = userRole === 'owner' || userRole === 'super_admin'

  const navItems = [
    { name: 'Tugas Hari Ini', href: '/dashboard/tasks', icon: ClipboardList, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Request Jemput', href: '/dashboard/pickups', icon: Truck, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Terima Order', href: '/dashboard/orders/new', icon: ShoppingCart, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Daftar Order', href: '/dashboard/orders', icon: ListOrdered, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Laporan', href: '/dashboard/reports', icon: FileText, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Pelanggan', href: '/dashboard/customers', icon: Users, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Pegawai', href: '/dashboard/staff', icon: UserSquare2, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Layanan', href: '/dashboard/services', icon: Package, roles: ['staff', 'owner', 'super_admin'] },
    { name: 'Pengeluaran', href: '/dashboard/expenses', icon: Wallet, roles: ['staff', 'owner', 'super_admin'] },
  ]

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 right-4 z-40 p-2 bg-white rounded-md shadow-sm border text-gray-600"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 flex flex-col transition-all duration-300 ease-in-out transform shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'w-72'}`}
      >
        {/* Brand Area */}
        <div className="flex items-center h-16 px-4 border-b border-gray-100 justify-between">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600 shrink-0">
              <Droplets size={24} strokeWidth={2.5} />
            </div>
            {!isCollapsed && <span className="font-bold text-xl text-gray-900 tracking-tight">Cemerlang</span>}
          </div>
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className={`px-4 py-4 border-b border-gray-100 ${isCollapsed ? 'items-center' : ''} flex flex-col`}>
          {!isCollapsed ? (
            <>
              <p className="text-sm font-medium text-gray-900 truncate">Halo, {userName}</p>
              <p className="text-xs text-primary-600 font-medium uppercase tracking-wider mt-0.5">{userRole}</p>
            </>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase">
              {userName.charAt(0)}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredNavItems.map((item) => {
            // Check active (exact match for dashboard, prefix for others)
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.href)

            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-sm ring-1 ring-primary-500/20 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'}`} 
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <form action={logoutAction}>
            <button 
              type="submit"
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? "Keluar" : undefined}
            >
              <LogOut size={22} className="text-red-400 group-hover:text-red-600" />
              {!isCollapsed && <span className="font-medium">Keluar</span>}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
