import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, Bell, Sun, Moon, Menu, X,
  Package, LogOut, User,
  Globe, ChevronDown, ExternalLink,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { TebkIcon } from '@/components/shared/TebkLogo'

function isActive(pathname, to, end) {
  if (end || to === '/') return pathname === to
  return pathname.startsWith(to)
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout }            = useAuthStore()
  const { items }                   = useCartStore()
  const { theme, toggleTheme }      = useThemeStore()
  const { language, setLanguage }   = useLanguageStore()
  const { t }                       = useTranslation()
  const navigate                    = useNavigate()
  const { pathname }                = useLocation()

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
    navigate('/', { replace: true })
    logout()
  }

  const NAV_LINKS = [
    { to: '/',           label: t('nav.home'),       end: true },
    { to: '/products',   label: t('nav.products') },
    { to: '/categories', label: t('nav.categories') },
    { to: '/bundles',    label: t('nav.bundles') },
    { to: '/assistant',  label: t('nav.assistant') },
    { to: '/about',      label: t('nav.about') },
  ]

  return (
    // Outer wrapper: sticky, transparent — takes up 96px (pill h-16 + my-4*2)
    <header className="sticky top-0 z-50 w-full pointer-events-none">

      {/* ── Floating Capsule Pill ── */}
      <div className="pointer-events-auto my-4 mx-auto w-[92%] max-w-7xl rounded-full h-16 bg-skySoft-capsule/80 dark:bg-slate-800/90 backdrop-blur-xl shadow-card border border-white/70 dark:border-slate-700/60 flex items-center px-5 gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <TebkIcon className="w-7 h-7 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-display font-bold text-primary dark:text-white text-lg">TEBK</span>
        </Link>

        {/* Desktop Nav — centered with layoutId sliding dot */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
          {NAV_LINKS.map(({ to, label, end }) => {
            const active = isActive(pathname, to, end)
            const isNew  = to === '/bundles' && user?.role === 'supplier'
            return (
              <motion.div key={to} className="relative" whileHover={{ y: -1 }}>
                <Link
                  to={to}
                  className={cn(
                    'flex flex-col items-center px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 gap-0.5',
                    active
                      ? 'text-primary dark:text-white'
                      : 'text-muted hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {label}
                    {isNew && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-peach text-white">
                        NEW
                      </span>
                    )}
                  </span>
                  {/* Animated sliding dot using layoutId */}
                  <div className="h-1.5 flex items-center justify-center">
                    {active && (
                      <motion.div
                        layoutId="activeDot"
                        className="w-1.5 h-1.5 rounded-full bg-peach"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto md:ml-0">

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full hover:bg-white/60 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>

          {/* Language pill */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full border border-border/60 hover:border-secondary text-muted hover:text-ink dark:border-slate-600 dark:text-slate-300 dark:hover:border-secondary transition-colors text-xs font-medium"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'EN' : 'عر'}</span>
          </button>

          {user ? (
            <>
              {/* Wishlist */}
              <motion.div whileTap={{ scale: 0.92 }}>
                <Link
                  to="/wishlist"
                  className="w-8 h-8 rounded-full hover:bg-white/60 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Notifications */}
              <motion.div whileTap={{ scale: 0.92 }} className="relative">
                <Link
                  to="/notifications"
                  className="w-8 h-8 rounded-full hover:bg-white/60 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div whileTap={{ scale: 0.92 }} className="relative">
                <Link
                  to="/cart"
                  className="w-8 h-8 rounded-full hover:bg-white/60 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none ml-1">
                    <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-secondary transition-all">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
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
                      <ExternalLink className="w-4 h-4" /> {t('user_menu.admin_panel')}
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
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={() => navigate('/login')}
                className="hidden md:flex rounded-full bg-primary text-white hover:bg-primary-700 px-5 text-sm font-semibold ml-1 shadow-soft"
              >
                {t('nav.login_register')}
              </Button>
            </motion.div>
          )}

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden w-8 h-8 rounded-full hover:bg-white/60 dark:hover:bg-slate-700 flex items-center justify-center text-muted hover:text-ink dark:text-slate-400 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen
                ? <motion.div key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X    className="w-4 h-4" /></motion.div>
                : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-4 h-4" /></motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Dropdown Panel (floating below pill) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{    opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto absolute top-[88px] left-1/2 -translate-x-1/2 w-[90%] max-w-lg rounded-2xl bg-skySoft-capsule/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-card border border-white/60 dark:border-slate-700/60 p-4"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, end }) => {
                const active = isActive(pathname, to, end)
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      active
                        ? 'bg-white/70 dark:bg-slate-700/60 text-primary dark:text-white'
                        : 'text-muted hover:bg-white/50 dark:hover:bg-slate-700/40 hover:text-ink'
                    )}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-peach shrink-0" />}
                    {label}
                  </Link>
                )
              })}

              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-white/50 dark:hover:bg-slate-700/40 hover:text-ink transition-colors sm:hidden"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'English / العربية' : 'العربية / English'}
              </button>

              {!user && (
                <div className="mt-2 pt-2 border-t border-border/40">
                  <Button
                    className="w-full rounded-full bg-primary text-white hover:bg-primary-700"
                    onClick={() => { navigate('/login'); setMobileOpen(false) }}
                  >
                    {t('nav.login_register')}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
