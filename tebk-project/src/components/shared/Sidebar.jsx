import { NavLink } from 'react-router-dom'
import { ShoppingBag, Heart, Bell, User, Layers, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/hooks/useTranslation'

function SidebarLink({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
          isActive
            ? 'bg-clinical text-primary dark:bg-teal-900/30 dark:text-secondary'
            : 'text-muted hover:text-ink hover:bg-clinical dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700'
        )
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </NavLink>
  )
}

export function Sidebar() {
  const { user } = useAuthStore()
  const { t }    = useTranslation()

  const SHARED_LINKS = [
    { to: '/orders',            icon: ShoppingBag, label: t('sidebar.orders') },
    { to: '/subscriptions',     icon: RefreshCw,   label: t('sidebar.subscriptions') },
    { to: '/purchase-requests', icon: Layers,      label: t('sidebar.purchase_requests') },
    { to: '/wishlist',          icon: Heart,       label: t('sidebar.wishlist') },
    { to: '/notifications',     icon: Bell,        label: t('sidebar.notifications') },
    { to: '/profile',           icon: User,        label: t('sidebar.profile') },
  ]

  const links = SHARED_LINKS

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 m-3 rounded-2xl shadow-card bg-white dark:bg-slate-800 py-5 px-3 sticky top-[calc(4rem+12px)] h-[calc(100vh-5rem-24px)] overflow-y-auto border border-transparent dark:border-slate-700">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-1 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <span className="font-display font-bold text-primary dark:text-white text-lg">TEBK</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon, label }) => (
          <SidebarLink key={to} to={to} icon={icon} label={label} />
        ))}
      </nav>
    </aside>
  )
}
