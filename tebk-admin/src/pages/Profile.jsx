import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/services/supabaseClient'
import { adminProfileSchema as schema } from '@/utils/validators'

export function Profile() {
  const { user, refreshProfile } = useAuthStore()
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [saveError, setSaveErr] = useState(null)

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.full_name || '',
      phone:    user?.phone     || '',
      city:     user?.city      || '',
      address:  user?.address   || '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true); setSuccess(false); setSaveErr(null)
    const { error } = await supabase.from('profiles').update({
      full_name: data.fullName,
      phone:     data.phone    || null,
      city:      data.city     || null,
      address:   data.address  || null,
    }).eq('id', user.id)
    setLoading(false)
    if (error) { setSaveErr(error.message); return }
    await refreshProfile()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="section-title">Profile</h1>

      {/* Avatar card */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          {initials}
        </div>
        <div>
          <p className="font-semibold text-ink">{user?.full_name || 'Administrator'}</p>
          <p className="text-sm text-muted">{user?.email}</p>
          <span className="badge badge-warning mt-1">Administrator</span>
        </div>
      </div>

      {/* Edit form */}
      <div className="card">
        <h2 className="text-sm font-semibold text-ink mb-5">Edit Profile</h2>

        {saveError && (
          <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3 mb-4">{saveError}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">Profile updated successfully!</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Full Name</label>
              <input className="input-base" {...register('fullName')} />
              {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Phone</label>
              <input className="input-base" placeholder="+20 10x xxx xxxx" {...register('phone')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">City</label>
              <input className="input-base" placeholder="Cairo" {...register('city')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Email</label>
              <input className="input-base" value={user?.email || ''} disabled readOnly />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted mb-1.5">Address</label>
              <input className="input-base" placeholder="123 Medical District…" {...register('address')} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
