import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Lock, Eye, EyeOff, ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { adminResetPasswordSchema as schema } from '@/utils/validators'

export function ResetPasswordPage() {
  const { updatePassword, loading, error, clearError, user, initializing } = useAuthStore()
  const navigate = useNavigate()
  const [showPw, setShowPw]           = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess]         = useState(false)

  useEffect(() => () => clearError(), [clearError])

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ password }) => {
    const { error: err } = await updatePassword(password)
    if (!err) setSuccess(true)
  }

  /* ── Loading while auth initializes ──────────────────────── */
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  /* ── Expired / invalid link ───────────────────────────────── */
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a1d2e 0%, #0f172a 60%, #1e1b4b 100%)' }}
      >
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10" style={{ background: '#6366f1' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10" style={{ background: '#6366f1' }} />

        <div className="relative z-10 w-full max-w-sm mx-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">Link Expired</h2>
            <p className="text-sm text-muted mb-6">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center w-full py-3 rounded-xl text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(90deg, #6366f1, #4f46e5)' }}
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Success screen ───────────────────────────────────────── */
  if (success) {
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
            <h2 className="text-xl font-bold text-ink mb-2">Password Updated</h2>
            <p className="text-sm text-muted mb-6">
              Your password has been reset successfully. Sign in with your new password.
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

  /* ── Reset form ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a1d2e 0%, #0f172a 60%, #1e1b4b 100%)' }}
      >
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-10" style={{ background: '#6366f1' }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10" style={{ background: '#6366f1' }} />
        <div className="absolute top-1/2 right-[10%] w-48 h-48 rounded-full opacity-5" style={{ background: '#ffffff' }} />

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
            Reset Your<br />Password
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Choose a strong password to protect your admin account.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">Secure</span>
            <span className="text-white/50 text-xs">Password Policy</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">8+ chars</span>
            <span className="text-white/50 text-xs">Minimum Length</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-col justify-between bg-white">
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
              <h1 className="text-2xl font-bold mb-1 text-ink">Reset Password</h1>
              <p className="text-sm text-muted">Enter your new password below.</p>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold mb-1 text-ink">Reset Password</h1>
              <p className="text-sm text-muted">Enter and confirm your new password.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6366f1' }}>
                  New Password
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
                    placeholder="Re-enter new password"
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
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                  : <>Update Password <span className="text-base leading-none">›</span></>
                }
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-8 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Remember your password?{' '}
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
  )
}
