import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package, Warehouse, Users,
  CreditCard, BarChart2, Bell, User, Settings, LogOut,
  Menu, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ToastContainer } from '@/components/shared/ToastContainer'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
  { to: '/admin',                 icon: LayoutDashboard, label: 'Dashboard',     end: true },
  { to: '/admin/orders',          icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products',        icon: Package,         label: 'Products' },
  { to: '/admin/inventory',       icon: Warehouse,       label: 'Inventory' },
  { to: '/admin/users',           icon: Users,           label: 'Customers' },
  { to: '/admin/payments',        icon: CreditCard,      label: 'Payments' },
  { to: '/admin/reports',         icon: BarChart2,       label: 'Reports' },
  { to: '/admin/notifications',   icon: Bell,            label: 'Notifications' },
  { to: '/admin/profile',         icon: User,            label: 'Profile' },
  { to: '/admin/settings',        icon: Settings,        label: 'Settings' },
]

export function AdminPanelLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  const handleLogout = () => {
    navigate('/', { replace: true })
    logout()
  }

  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: '#0e204d' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#C1E3C4' }}>
            <span className="text-white font-bold text-base">T</span>
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-white text-lg leading-none">TEBK</p>
            <p className="text-white/40 text-[10px] font-semibold tracking-widest mt-0.5">ADMIN PANEL</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {ADMIN_NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs font-bold" style={{ background: '#C1E3C4', color: '#fff' }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">

        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-6 gap-4 shrink-0"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Admin Portal
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}
