import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { adminLoginSchema as schema } from '@/utils/validators'

export function LoginPage() {
  const { login, loading, error, clearError, user } = useAuthStore()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') navigate('/', { replace: true })
    else if (user)              navigate('/forbidden', { replace: true })
  }, [user, navigate])

  useEffect(() => () => clearError(), [clearError])

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email, password }) => {
    await login(email, password)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a1d2e 0%, #0f172a 60%, #1e1b4b 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-10" style={{ background: '#6366f1' }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10" style={{ background: '#6366f1' }} />
        <div className="absolute top-1/2 right-[10%] w-48 h-48 rounded-full opacity-5" style={{ background: '#ffffff' }} />

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#6366f1' }}
            >
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <span className="font-bold text-white text-2xl tracking-wide">TEBK</span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-widest text-white/60 border border-white/20">
                ADMIN
              </span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Secure Admin<br />Access Panel
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Full control over orders, inventory, users, and payments. Restricted to authorized administrators only.
          </p>
        </div>

        {/* Bottom: Stats */}
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">Role-Based</span>
            <span className="text-white/50 text-xs">Access Control</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">Supabase</span>
            <span className="text-white/50 text-xs">Secured Auth</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-col bg-white">
        <div className="flex-1 flex flex-col justify-center px-8 py-10">
          <div className="max-w-md w-full mx-auto">

            {/* Mobile-only heading */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#6366f1' }}
                >
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="font-bold text-xl text-ink">TEBK Admin</span>
              </div>
              <h1 className="text-2xl font-bold mb-1 text-ink">Sign In</h1>
              <p className="text-sm text-muted">Access the TEBK administrator panel.</p>
            </div>

            {/* Desktop sub-heading */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold mb-1 text-ink">Sign In</h1>
              <p className="text-sm text-muted">Sign in with your administrator account.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6366f1' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    placeholder="admin@tebk.com"
                    className="w-full pl-6 pr-2 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-muted/50"
                    style={{ color: '#0f172a' }}
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold" style={{ color: '#6366f1' }}>
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: '#6366f1' }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-6 pr-10 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-muted/50"
                    style={{ color: '#0f172a' }}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold mt-2 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg, #6366f1, #4f46e5)' }}
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                  : <>Sign In <span className="text-base leading-none">›</span></>
                }
              </button>
            </form>

            {/* Footer row */}
            <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-muted">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#6366f1' }}>
                  Create admin account
                </Link>
              </p>
              <div className="flex items-center gap-1 text-xs text-muted">
                <ShieldCheck className="w-3 h-3" style={{ color: '#6366f1' }} />
                <span>Admin Access Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
