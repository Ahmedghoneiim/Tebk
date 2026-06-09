import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { loginSchema } from '@/utils/validators'
import { toast } from '@/store/notificationStore'
import { usePageTitle } from '@/hooks/usePageTitle'

export function LoginPage() {
  usePageTitle('Login')
  const { login, loading, error, clearError, user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Sanitize the "from" destination — never send back to "/" or auth pages
  const rawFrom = location.state?.from?.pathname
  const from    = (rawFrom && rawFrom !== '/' && !rawFrom.startsWith('/login') && !rawFrom.startsWith('/register'))
    ? rawFrom : null

  // Single navigation source: this effect. Handles both "already logged in" and post-login.
  useEffect(() => {
    if (!user) return
    const dest = from || (user.role === 'supplier' ? '/products' : '/')
    navigate(dest, { replace: true })
  }, [user])

  useEffect(() => { return () => clearError() }, [])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    const { error } = await login(data.email, data.password)
    if (!error) toast.success('Welcome back!')
    // Navigation is handled by the useEffect above when user state updates
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #213360 0%, #1a2f58 55%, #0d7d74 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-10" style={{ background: '#21cdc0' }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full opacity-10" style={{ background: '#21cdc0' }} />
      <div className="absolute top-1/2 left-[5%] w-32 h-32 rounded-full opacity-5" style={{ background: '#ffffff' }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white rounded-3xl shadow-modal p-8">

          {/* Shield icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #21cdc0, #1bb3a7)' }}
            >
              <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-2xl font-display font-bold tracking-widest mb-1" style={{ color: '#0e204d' }}>
            LOGIN
          </h1>
          <p className="text-center text-sm text-muted mb-6">
            Enter your credentials to access the portal
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#435ba1' }}>
                E-mail Address
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  placeholder="name@hospital.com"
                  className="w-full pl-6 pr-2 py-2.5 text-sm border-0 border-b-2 border-border bg-transparent focus:outline-none focus:border-secondary transition-colors placeholder:text-muted/50"
                  style={{ color: '#0e204d' }}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#435ba1' }}>
                Password
              </label>
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
              <div className="flex justify-end mt-1.5">
                <Link to="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: '#21cdc0' }}>
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold mt-2 transition-opacity disabled:opacity-60"
              style={{ background: 'linear-gradient(90deg, #213360, #354d7a)' }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <>Login <span className="text-base leading-none">›</span></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted whitespace-nowrap">Or sign in with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons — decorative */}
          <div className="flex items-center justify-center gap-3">
            {['🍎', '🟦', '🔵'].map((icon, i) => (
              <button
                key={i}
                type="button"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-base hover:bg-clinical transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Footer link */}
          <p className="text-center text-xs text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#21cdc0' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
