import { useState, useEffect } from 'react'
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

function NavLogo() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-7 h-7">
      <rect x="20" y="32" width="40" height="12" rx="5" fill="#1a3363" />
      <rect x="32" y="20" width="12" height="40" rx="5" fill="#1a3363" />
      <rect x="4"  y="18" width="40" height="12" rx="5" fill="#C1E3C4" />
      <rect x="18" y="4"  width="12" height="40" rx="5" fill="#C1E3C4" />
      <path d="M 8,52 A 44,44 0 0 1 52,8" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const { user, logout } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
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
    { to: '/about',      label: 'About' },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-40 py-3 px-4',
        'bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm',
        'animate-in slide-in-from-top-2 fade-in duration-500',
      )}
    >
      <div className="max-w-screen-xl mx-auto">
        <div
          className={cn(
            'flex items-center justify-between h-14 gap-4',
            'bg-slate-200 dark:bg-slate-800',
            'rounded-full px-5',
            'border border-slate-300/60 dark:border-slate-700',
            'transition-shadow duration-300',
            scrolled ? 'shadow-lg' : 'shadow-md'
          )}
        >

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0 group">
            <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <NavLogo />
            </div>
            <span className="font-display font-bold text-primary dark:text-white text-xl transition-colors duration-200 group-hover:text-secondary">
              TEBK
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-0.5">
            {NAV_LINKS.map(({ to, label, end }, index) => {
              const isBundlesHighlight = to === '/bundles' && user?.role === 'supplier'
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg',
                      'animate-in fade-in slide-in-from-top-2 duration-500',
                      'transition-all duration-200 hover:-translate-y-0.5',
                      isActive
                        ? 'text-secondary'
                        : 'text-muted hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isBundlesHighlight && (
                        <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-secondary text-white animate-bounce">
                          NEW
                        </span>
                      )}
                      {/* Sliding underline indicator */}
                      <span
                        className={cn(
                          'absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-secondary',
                          'transition-all duration-300 origin-left',
                          isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                        )}
                      />
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 animate-in fade-in slide-in-from-top-2 duration-500" style={{ animationDelay: '350ms' }}>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl hover:bg-slate-300/70 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-all duration-200 hover:scale-110"
            >
              {theme === 'dark'
                ? <Sun  className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
                : <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
              }
            </button>

            {/* Language pill */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-secondary text-muted hover:text-ink dark:border-slate-600 dark:text-slate-300 dark:hover:border-secondary dark:hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105"
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
                  className="w-9 h-9 rounded-xl hover:bg-slate-300/70 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-all duration-200 hover:scale-110 relative"
                >
                  <Heart className="w-4 h-4" />
                </Link>

                {/* Notifications bell */}
                <Link
                  to="/notifications"
                  className="w-9 h-9 rounded-xl hover:bg-slate-300/70 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-all duration-200 hover:scale-110 relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in duration-300">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="w-9 h-9 rounded-xl hover:bg-slate-300/70 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-all duration-200 hover:scale-110 relative"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in duration-300">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User avatar dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none transition-transform duration-200 hover:scale-105">
                      <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-secondary transition-all duration-200">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 animate-in fade-in slide-in-from-top-2 duration-200">
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
              <button
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:brightness-110"
                style={{ background: '#1a3363' }}
              >
                {t('nav.login_register')}
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden w-9 h-9 rounded-xl hover:bg-slate-300/70 dark:hover:bg-slate-700 flex items-center justify-center text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-all duration-200 hover:scale-110"
            >
              <span className={cn('transition-all duration-300', mobileOpen ? 'rotate-90' : 'rotate-0')}>
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — pill card below */}
      <div
        className={cn(
          'md:hidden mx-2 overflow-hidden transition-all duration-300 ease-in-out',
          'bg-slate-100 dark:bg-slate-800 rounded-3xl',
          'border border-slate-200 dark:border-slate-700',
          mobileOpen ? 'max-h-[32rem] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
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
