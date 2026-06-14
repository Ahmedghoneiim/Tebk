import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, User, Mail, Lock, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { registerSchema } from '@/utils/validators'
import { toast } from '@/store/notificationStore'
import { usePageTitle } from '@/hooks/usePageTitle'

export function RegisterPage() {
  usePageTitle('Create Account')
  const { register: registerUser, loading, error, clearError, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const dest = user.role === 'admin' ? '/admin' : user.role === 'supplier' ? '/products' : '/'
    navigate(dest, { replace: true })
  }, [user])

  useEffect(() => { return () => clearError() }, [])

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'supplier' },
  })

  const role = watch('role')

  const onSubmit = async (data) => {
    const { data: result, error } = await registerUser(data)
    if (!error) {
      if (result?.session) {
        // Auto-confirm is enabled — user is now logged in, useEffect will redirect to /dashboard
      } else {
        // Email confirmation required
        toast.success('Account created! Please check your email to verify.')
        navigate('/login')
      }
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #213360 0%, #1a2f58 60%, #0d7d74 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-10" style={{ background: '#21cdc0' }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10" style={{ background: '#21cdc0' }} />
        <div className="absolute top-1/2 right-[10%] w-48 h-48 rounded-full opacity-5" style={{ background: '#ffffff' }} />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#21cdc0' }}>
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-display font-bold text-white text-2xl tracking-wide">TEBK</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-display font-bold text-white leading-tight mb-4">
            Save Your<br />Account Now
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Get unlimited access to medical supply procurement, AI recommendations, and clinical support. Precision starts here.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">15k+</span>
            <span className="text-white/60 text-xs">Medical Devices</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">Global</span>
            <span className="text-white/60 text-xs">Regulatory Support</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-col justify-between bg-white">
        <div className="flex-1 flex flex-col justify-center px-8 py-10">
          <div className="max-w-md w-full mx-auto">

            {/* Mobile heading (hidden on lg — left panel handles it) */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#213360' }}>
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="font-display font-bold text-xl" style={{ color: '#213360' }}>TEBK</span>
              </div>
              <h1 className="text-2xl font-display font-bold mb-1" style={{ color: '#0e204d' }}>Save Your Account Now</h1>
              <p className="text-sm text-muted">Get unlimited access to medical supply procurement.</p>
            </div>

            {/* Desktop sub-heading */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-display font-bold mb-1" style={{ color: '#0e204d' }}>Save Your Account Now</h1>
              <p className="text-sm text-muted">Get unlimited access to equipment forms, technical support, and clinical responses. Precision starts here.</p>
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
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#435ba1' }}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    placeholder="John Doe"
                    className="w-full pl-6 pr-2 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-secondary transition-colors placeholder:text-muted/50"
                    style={{ color: '#0e204d' }}
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#435ba1' }}>E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    placeholder="example@healthcare.com"
                    className="w-full pl-6 pr-2 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-secondary transition-colors placeholder:text-muted/50"
                    style={{ color: '#0e204d' }}
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#435ba1' }}>Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'supplier', label: 'Supplier' },
                    { value: 'clinic',   label: 'Client'   },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors text-sm font-medium ${
                        role === value
                          ? 'border-secondary bg-clinical text-secondary'
                          : 'border-border text-muted hover:bg-clinical'
                      }`}
                    >
                      <input type="radio" value={value} className="sr-only" {...register('role')} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#435ba1' }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-6 pr-2 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-secondary transition-colors placeholder:text-muted/50"
                    style={{ color: '#0e204d' }}
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#435ba1' }}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-6 pr-2 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-secondary transition-colors placeholder:text-muted/50"
                    style={{ color: '#0e204d' }}
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold mt-2 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg, #21cdc0, #1bb3a7)' }}
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                  : <>Register <span className="text-base leading-none">›</span></>
                }
              </button>
            </form>

            <p className="text-center text-xs text-muted mt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: '#21cdc0' }}>
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-8 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="flex gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#21cdc0' }} />
              <span className="w-2 h-2 rounded-full bg-border" />
              <span className="w-2 h-2 rounded-full bg-border" />
            </span>
            <span>Step 1 of 3</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <ShieldCheck className="w-3 h-3" style={{ color: '#21cdc0' }} />
            <span>ISO Certified</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <a href="mailto:support@tebk.com" className="hover:underline">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  )
}
