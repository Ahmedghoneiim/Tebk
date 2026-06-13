import { NavLink } from 'react-router-dom'
import { Home, Search, ShoppingCart, LayoutDashboard, Bot } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const items     = useCartStore((s) => s.items)
  const cartCount = items.reduce((s, i) => s + i.quantity, 0)
  const { t }     = useTranslation()

  const LINKS = [
    { to: '/',         icon: Home,            label: t('mobile_nav.home') },
    { to: '/products', icon: Search,          label: t('mobile_nav.products') },
    { to: '/assistant',icon: Bot,             label: t('mobile_nav.assistant') },
    { to: '/cart',     icon: ShoppingCart,    label: t('mobile_nav.cart') },
    { to: '/dashboard',icon: LayoutDashboard, label: t('mobile_nav.account') },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-border dark:border-slate-700 flex">
      {LINKS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn('flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors',
              isActive ? 'text-primary dark:text-secondary' : 'text-muted dark:text-slate-400')
          }
        >
          <div className="relative">
            <Icon className="w-5 h-5" />
            {to === '/cart' && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
