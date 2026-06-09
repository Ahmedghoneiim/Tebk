import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, Bell, Sun, Moon, Menu, X,
  Package, LogOut, User,
  Globe, ChevronDown, ExternalLink,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useThemeStore } from '@/store/themeStore'
import { useLanguageStore } from '@/store/languageStore'
import { useTranslation } from '@/hooks/useTranslation'
import { fetchNotifications } from '@/services/notificationService'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { items }        = useCartStore()
  const { theme, toggleTheme } = useThemeStore()
  const { language, setLanguage } = useLanguageStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn:  () => fetchNotifications(user.id),
    enabled:  !!user?.id,
    select:   r => (r.data || []).filter(n => !n.read).length,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  })

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)
  const initials  = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const handleLogout = () => {
    navigate('/', { replace: true })  // leave protected route before state clears
    logout()
  }

  const NAV_LINKS = [
    { to: '/',           label: t('nav.home'),      end: true },
    { to: '/products',   label: t('nav.products') },
    { to: '/categories', label: 'Categories' },
    { to: '/bundles',    label: t('nav.bundles') },
    { to: '/assistant',  label: t('nav.assistant') },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border dark:border-slate-700 shadow-soft">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-display font-bold text-primary dark:text-white text-xl">TEBK</span>
          </Link>

          {/* Desktop Nav — centered */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-0.5">
            {NAV_LINKS.map(({ to, label, end }) => {
              const isBundlesHighlight = to === '/bundles' && user?.role === 'supplier'
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-px rounded-lg',
                      isActive ? 'text-secondary' : 'text-muted hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 animate-in fade-in duration-200" />
                      )}
                      {label}
                      {isBundlesHighlight && (
                        <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-secondary text-white animate-bounce">
                          NEW
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl hover:bg-clinical dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language pill */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-secondary text-muted hover:text-ink dark:border-slate-600 dark:text-slate-300 dark:hover:border-secondary dark:hover:text-white transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'Eng' : 'عر'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {user ? (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="w-9 h-9 rounded-xl hover:bg-clinical dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-colors relative"
                >
                  <Heart className="w-4 h-4" />
                </Link>

                {/* Notifications bell */}
                <Link
                  to="/notifications"
                  className="w-9 h-9 rounded-xl hover:bg-clinical dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="w-9 h-9 rounded-xl hover:bg-clinical dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-colors relative"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User avatar dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-secondary transition-all">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>{user.full_name || user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4" /> {t('user_menu.profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <Package className="w-4 h-4" /> {t('user_menu.orders')}
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => { window.location.href = '/admin' }}>
                        <ExternalLink className="w-4 h-4" /> Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-danger">
                      <LogOut className="w-4 h-4" /> {t('user_menu.sign_out')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="hidden md:flex rounded-full border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors px-5"
              >
                {t('nav.login_register')}
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden w-9 h-9 rounded-xl hover:bg-clinical dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slide-down animation */}
      <div
        className={cn(
          'md:hidden border-t border-border dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 ease-in-out',
          mobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="page-container py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive ? 'bg-clinical text-secondary dark:bg-teal-900/30' : 'text-ink hover:bg-clinical dark:text-slate-300 dark:hover:bg-slate-700'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />}
                  {label}
                </>
              )}
            </NavLink>
          ))}

          {/* Mobile language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-clinical dark:text-slate-400 dark:hover:bg-slate-700 transition-colors sm:hidden"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'English / العربية' : 'العربية / English'}</span>
          </button>

          {!user && (
            <div className="mt-2 pt-2 border-t border-border">
              <Button
                className="w-full rounded-full"
                onClick={() => { navigate('/login'); setMobileOpen(false) }}
              >
                {t('nav.login_register')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
