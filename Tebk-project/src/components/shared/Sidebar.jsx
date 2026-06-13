import { NavLink } from 'react-router-dom'
import { ShoppingBag, Heart, Bell, User, Layers, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/hooks/useTranslation'
import { TebkIcon } from '@/components/shared/TebkLogo'

function SidebarLink({ to, icon: Icon, label, end, index }) {
  return (
    <NavLink
      to={to}
      end={end}
      className="block"
    >
      {({ isActive }) => (
        <motion.div
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.06, duration: 0.2, ease: 'easeOut' }}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer select-none',
            isActive
              ? 'bg-white shadow-card dark:bg-slate-700/60 dark:shadow-md'
              : 'hover:bg-clinical dark:hover:bg-slate-700/40'
          )}
        >
          {/* Icon pill — solid filled square when active, plain when not */}
          <span
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200',
              isActive
                ? 'bg-primary text-white dark:bg-secondary dark:text-slate-900'
                : 'text-muted dark:text-slate-400'
            )}
          >
            <Icon className="w-4 h-4" />
          </span>

          {/* Label */}
          <span
            className={cn(
              'flex-1 transition-colors duration-200',
              isActive
                ? 'text-primary font-semibold dark:text-white'
                : 'text-muted hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
            )}
          >
            {label}
          </span>

          {/* Active indicator dot */}
          <AnimatePresence>
            {isActive && (
              <motion.span
                key="dot"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
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
    <aside className="hidden lg:flex flex-col w-56 shrink-0 m-3 rounded-2xl shadow-card bg-white dark:bg-slate-800 py-5 px-3 sticky top-[108px] h-[calc(100vh-120px)] overflow-y-auto border border-transparent dark:border-slate-700">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2.5 px-1 mb-6"
      >
        <TebkIcon className="w-8 h-8 shrink-0" />
        <span className="font-display font-bold text-primary dark:text-white text-lg">TEBK</span>
      </motion.div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon, label }, index) => (
          <SidebarLink key={to} to={to} icon={icon} label={label} index={index} />
        ))}
      </nav>
    </aside>
  )
}
