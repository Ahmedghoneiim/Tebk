import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, User, Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { adminSignUpSchema as schema } from '@/utils/validators'

export function SignUpPage() {
  const { register: registerAdmin, loading, error, clearError, user } = useAuthStore()
  const navigate = useNavigate()
  const [emailSent, setEmailSent]     = useState(false)
  const [showPw, setShowPw]           = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') navigate('/', { replace: true })
  }, [user, navigate])

  useEffect(() => () => clearError(), [clearError])

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ fullName, email, password }) => {
    const { data, error: err } = await registerAdmin(email, password, fullName)
    if (err) return
    if (data.requiresEmailConfirmation) setEmailSent(true)
  }

  /* ── Email confirmation sent ──────────────────────────────── */
  if (emailSent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a1d2e 0%, #0f172a 60%, #1e1b4b 100%)' }}
      >
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10" style={{ background: '#6366f1' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10" style={{ background: '#6366f1' }} />

        <div className="relative z-10 w-full max-w-sm mx-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">Check your email</h2>
            <p className="text-sm text-muted mb-1">We sent a confirmation link to</p>
            <p className="text-sm font-semibold text-ink mb-6">{getValues('email')}</p>
            <p className="text-xs text-muted mb-6">
              Click the link in the email to activate your admin account, then sign in.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 rounded-xl text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(90deg, #6366f1, #4f46e5)' }}
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Two-column sign-up form ──────────────────────────────── */
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

          {/* Headline */}
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
              <h1 className="text-2xl font-bold mb-1 text-ink">Create Admin Account</h1>
              <p className="text-sm text-muted">Register a new administrator for TEBK.</p>
            </div>

            {/* Desktop sub-heading */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold mb-1 text-ink">Create Admin Account</h1>
              <p className="text-sm text-muted">Register a new administrator. Only admins can access this panel.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6366f1' }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    placeholder="Ahmed Hassan"
                    className="w-full pl-6 pr-2 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-muted/50"
                    style={{ color: '#0f172a' }}
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
              </div>

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
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6366f1' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6366f1' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    className="w-full pl-6 pr-10 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-muted/50"
                    style={{ color: '#0f172a' }}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold mt-2 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg, #6366f1, #4f46e5)' }}
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                  : <>Register <span className="text-base leading-none">›</span></>
                }
              </button>
            </form>

            {/* Footer row */}
            <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: '#6366f1' }}>
                  Sign in
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
