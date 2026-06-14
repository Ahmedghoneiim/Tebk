import { useState, useRef, useEffect, useMemo } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  LayoutDashboard, ShoppingBag, Package, Users, CreditCard,
  Bell, User, Settings, LogOut, Menu, X, ChevronRight,
  ChevronDown, ExternalLink, Search, Shield, AlertTriangle,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { fetchAllProducts } from '@/services/adminProductService'
import { fetchAllUsers } from '@/services/adminUserService'
import { fetchAllOrders } from '@/services/adminOrderService'

const NAV_GROUPS = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard Home',
    to: '/',
    end: true,
  },
  {
    icon: Package,
    label: 'Inventory & SKUs',
    basePaths: ['/inventory', '/products'],
    children: [
      { to: '/inventory', label: 'Stock Levels' },
      { to: '/products', label: 'Combo Packages' },
    ],
  },
  {
    icon: ShoppingBag,
    label: 'Orders & Fulfillments',
    basePaths: ['/orders'],
    children: [
      { to: '/orders', label: 'Retail (B2C)' },
      { to: '/orders', label: 'Wholesale (B2B)' },
    ],
  },
  {
    icon: Users,
    label: 'User Management',
    basePaths: ['/users'],
    children: [
      { to: '/users', label: 'Retail Clients' },
      { to: '/users', label: 'B2B Suppliers/Clinics' },
    ],
  },
  {
    icon: CreditCard,
    label: 'Financials & Credit',
    basePaths: ['/payments'],
    children: [
      { to: '/payments', label: 'Invoices & Terms' },
      { to: '/payments', label: 'Credit Limits' },
    ],
  },
  {
    icon: Settings,
    label: 'Platform Settings',
    to: '/settings',
  },
]

function NavGroupItem({ group, isExpanded, onToggle, onNavClick }) {
  const location = useLocation()
  const Icon = group.icon
  const isGroupActive = group.basePaths?.some(p => location.pathname.startsWith(p))

  if (!group.children) {
    return (
      <NavLink
        to={group.to}
        end={group.end}
        onClick={onNavClick}
        className={({ isActive }) => cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group w-full',
          isActive ? 'bg-primary/20 text-white' : 'text-white/55 hover:bg-white/8 hover:text-white/90'
        )}
      >
        {({ isActive }) => (
          <>
            <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/70')} />
            <span className="flex-1">{group.label}</span>
            {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary/60 shrink-0" />}
          </>
        )}
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
          isGroupActive ? 'text-white bg-white/5' : 'text-white/55 hover:bg-white/8 hover:text-white/90'
        )}
      >
        <Icon className={cn('w-4 h-4 shrink-0', isGroupActive ? 'text-primary' : 'text-white/40')} />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown className={cn(
          'w-3.5 h-3.5 shrink-0 transition-transform duration-200',
          isGroupActive ? 'text-primary/60' : 'text-white/30',
          isExpanded && 'rotate-180'
        )} />
      </button>
      {isExpanded && (
        <div className="mt-0.5 ml-4 pl-3 border-l border-white/10 space-y-0.5">
          {group.children.map((child, idx) => (
            <NavLink
              key={idx}
              to={child.to}
              onClick={onNavClick}
              className={({ isActive }) => cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                isActive ? 'text-white bg-white/10' : 'text-white/45 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  const [expandedGroups, setExpandedGroups] = useState(() => {
    const init = {}
    NAV_GROUPS.forEach(g => {
      if (g.basePaths) init[g.label] = g.basePaths.some(p => location.pathname.startsWith(p))
    })
    return init
  })

  const toggleGroup = (label) => setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }))

  const handleLogout = async () => {
    navigate('/login', { replace: true })
    await logout()
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: '#1a1d2e' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#6366f1' }}>
            <span className="text-white font-bold text-base">T</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-lg leading-none">TEBK</p>
            <p className="text-white/40 text-[10px] font-semibold tracking-[0.15em] mt-0.5">MEDICAL CO.</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {NAV_GROUPS.map(group => (
            <NavGroupItem
              key={group.label}
              group={group}
              isExpanded={!!expandedGroups[group.label]}
              onToggle={() => toggleGroup(group.label)}
              onNavClick={onClose}
            />
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name || 'Administrator'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:bg-white/8 hover:text-white/90 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0 text-white/40" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

function UserDropdown() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  useEffect(() => {
    function onMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    navigate('/login', { replace: true })
    await logout()
  }

  const go = (path) => { navigate(path); setOpen(false) }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ background: '#6366f1' }}>
          {initials}
        </div>
        <div className="hidden sm:block text-left max-w-[100px]">
          <p className="text-xs font-semibold text-ink leading-none truncate">{user?.full_name || 'Admin'}</p>
          <p className="text-[10px] text-muted mt-0.5 leading-none">Admin</p>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-panel border border-border overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-ink truncate">{user?.full_name || 'Administrator'}</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">Administrator</span>
          </div>
          <div className="py-1">
            <button onClick={() => go('/profile')} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ink hover:bg-slate-50 transition-colors">
              <User className="w-4 h-4 text-muted shrink-0" /> Profile
            </button>
            <button onClick={() => go('/settings')} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ink hover:bg-slate-50 transition-colors">
              <Settings className="w-4 h-4 text-muted shrink-0" /> Settings
            </button>
            <button onClick={() => { window.location.href = '/'; setOpen(false) }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ink hover:bg-slate-50 transition-colors">
              <ExternalLink className="w-4 h-4 text-muted shrink-0" /> Main Website
            </button>
          </div>
          <div className="border-t border-border py-1">
            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors" style={{ color: '#ef4444' }}>
              <LogOut className="w-4 h-4 shrink-0" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function GlobalSearch({ users, products }) {
  const navigate = useNavigate()
  const [searchQ, setSearchQ] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const results = useMemo(() => {
    if (!searchQ.trim()) return { users: [], products: [] }
    const q = searchQ.toLowerCase()
    return {
      users: users
        .filter(u =>
          (u.full_name || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          (u.clinic_name || '').toLowerCase().includes(q)
        )
        .slice(0, 4),
      products: products
        .filter(p => p.name.toLowerCase().includes(q))
        .slice(0, 4),
    }
  }, [searchQ, users, products])

  const hasResults = results.users.length > 0 || results.products.length > 0
  const showDropdown = open && searchQ.trim().length > 0

  useEffect(() => {
    function onMouseDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  return (
    <div ref={containerRef} className="relative hidden md:flex flex-1 max-w-sm">
      <div className="flex items-center gap-2 w-full bg-slate-50 rounded-xl px-3 py-2 border border-border focus-within:border-primary/40 transition-colors">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          value={searchQ}
          onChange={e => { setSearchQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Enter' && searchQ.trim()) {
              navigate(`/orders?q=${encodeURIComponent(searchQ.trim())}`)
              setOpen(false)
              setSearchQ('')
            }
            if (e.key === 'Escape') setOpen(false)
          }}
          placeholder="Search orders, products, clients…"
          className="bg-transparent text-sm outline-none flex-1 text-ink placeholder:text-muted min-w-0"
        />
        {searchQ && (
          <button onClick={() => { setSearchQ(''); setOpen(false) }} className="text-muted hover:text-ink transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-2xl shadow-lg border border-border overflow-hidden z-50">
          {hasResults ? (
            <>
              {results.users.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-muted uppercase tracking-wide">Clients</p>
                  {results.users.map(u => (
                    <button
                      key={u.id}
                      onMouseDown={() => { navigate('/users'); setOpen(false); setSearchQ('') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{(u.full_name || u.email || '?')[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{u.clinic_name || u.full_name || '—'}</p>
                        <p className="text-xs text-muted truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.products.length > 0 && (
                <div className={results.users.length > 0 ? 'border-t border-border' : ''}>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-muted uppercase tracking-wide">Products</p>
                  {results.products.map(p => (
                    <button
                      key={p.id}
                      onMouseDown={() => { navigate('/products'); setOpen(false); setSearchQ('') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-teal-600">P</span>
                      </div>
                      <p className="text-sm text-ink truncate">{p.name}</p>
                    </button>
                  ))}
                </div>
              )}
              <div className="border-t border-border px-4 py-2.5">
                <p className="text-xs text-muted">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono">Enter</kbd> to search in orders</p>
              </div>
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-muted">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono">Enter</kbd> to search orders for "<span className="text-ink font-medium">{searchQ}</span>"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Topbar({ onMenuClick, pendingOrdersCount, lowStockCount, pendingVerifCount, users, products }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-4 lg:px-6 gap-3 shrink-0 shadow-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-muted transition-colors shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      <GlobalSearch users={users} products={products} />

      <div className="flex-1" />

      {/* Pending Orders */}
      <button
        onClick={() => navigate('/orders')}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 shrink-0 hover:bg-red-100 transition-colors"
      >
        <ShoppingBag className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <span className="text-xs font-medium text-red-700">{pendingOrdersCount} Pending Orders</span>
      </button>

      {/* Mode badge */}
      <button
        onClick={() => navigate('/settings')}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 shrink-0 hover:bg-indigo-100 transition-colors"
      >
        <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-xs font-semibold text-primary">Mode: Hybrid</span>
      </button>

      {/* Pending Verifications */}
      <button
        onClick={() => navigate('/')}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 shrink-0 hover:bg-amber-100 transition-colors"
      >
        <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-xs font-medium text-amber-700">{pendingVerifCount} Pending Verifications</span>
      </button>

      {/* Low Stock */}
      <button
        onClick={() => navigate('/inventory')}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 shrink-0 hover:bg-amber-100 transition-colors"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-xs font-medium text-amber-700">{lowStockCount} Low Stock</span>
      </button>

      <UserDropdown />
    </header>
  )
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: productsData } = useQuery({ queryKey: ['admin-products'], queryFn: fetchAllProducts, staleTime: 0, refetchInterval: 60 * 1000 })
  const { data: usersData }    = useQuery({ queryKey: ['admin-users'],    queryFn: fetchAllUsers,    staleTime: 0, refetchInterval: 60 * 1000 })
  const { data: ordersData }   = useQuery({ queryKey: ['admin-orders'],   queryFn: fetchAllOrders,   staleTime: 0, refetchInterval: 30 * 1000 })

  const products = productsData?.data || []
  const users    = usersData?.data    || []
  const orders   = ordersData?.data   || []

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length
  const lowStockCount      = products.filter(p => typeof p.stock === 'number' && p.stock > 0 && p.stock < 20).length
  const pendingVerifCount  = users.filter(u => (u.role === 'clinic_owner' || u.role === 'supplier') && !u.verified).length

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          pendingOrdersCount={pendingOrdersCount}
          lowStockCount={lowStockCount}
          pendingVerifCount={pendingVerifCount}
          users={users}
          products={products}
        />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
