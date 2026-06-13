import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/authStore'
import { updateProfile } from '@/services/authService'
import { profileSchema } from '@/utils/validators'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/store/notificationStore'
import { usePageTitle } from '@/hooks/usePageTitle'

export function AdminProfile() {
  usePageTitle('Profile — Admin')
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName:   user?.full_name   || '',
      phone:      user?.phone       || '',
      clinicName: user?.clinic_name || '',
      address:    user?.address     || '',
      city:       user?.city        || '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    const { error } = await updateProfile(user.id, {
      full_name:   data.fullName,
      phone:       data.phone,
      clinic_name: data.clinicName,
      address:     data.address,
      city:        data.city,
    })
    setLoading(false)
    if (error) { toast.error('Failed to update profile'); return }
    toast.success('Profile updated!')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="section-title">Admin Profile</h1>

      <div className="card flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="text-xl font-bold" style={{ background: '#21cdc0', color: '#fff' }}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-primary">{user?.full_name || '—'}</p>
          <p className="text-sm text-muted">{user?.email}</p>
          <span className="badge-primary mt-1">Administrator</span>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-primary mb-5">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
              <Input {...register('fullName')} />
              {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Phone</label>
              <Input {...register('phone')} placeholder="+20 10x xxx xxxx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Organisation</label>
              <Input {...register('clinicName')} placeholder="TEBK HQ" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">City</label>
              <Input {...register('city')} placeholder="Cairo" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink mb-1.5">Address</label>
              <Input {...register('address')} placeholder="123 Medical District…" />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  )
}
