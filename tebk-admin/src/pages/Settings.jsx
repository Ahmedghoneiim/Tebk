import { Bell, Globe, CreditCard, ShieldCheck, Mail, Check } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'

function Toggle({ defaultChecked, onChange }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button
      type="button"
      onClick={() => { setOn(v => !v); onChange?.(!on) }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${on ? 'bg-primary' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

function SettingRow({ label, description, defaultChecked }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <Toggle defaultChecked={defaultChecked} />
    </div>
  )
}

const SECTIONS = [
  {
    icon: Bell,
    title: 'Notifications',
    rows: [
      { label: 'Email alerts for new orders',   desc: 'Receive an email when a new order is placed',         checked: true },
      { label: 'Low stock alerts',               desc: 'Notify when a product falls below reorder level',    checked: true },
      { label: 'New user registrations',         desc: 'Alert when a new supplier or client registers',      checked: false },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments',
    rows: [
      { label: 'Paymob integration active',      desc: 'Accept card and wallet payments via Paymob',          checked: true },
      { label: 'Send payment receipts',          desc: 'Automatic email receipt on successful payment',       checked: true },
    ],
  },
  {
    icon: Globe,
    title: 'Localisation',
    rows: [
      { label: 'Default currency: EGP',          desc: 'All prices displayed in Egyptian Pounds',             checked: true },
      { label: 'Arabic RTL support',             desc: 'Enable full right-to-left layout when Arabic active', checked: true },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    rows: [
      { label: 'Two-factor authentication',      desc: 'Require 2FA for admin sign-ins',                     checked: false },
      { label: 'Login activity log',             desc: 'Record all admin sign-in events',                    checked: true },
    ],
  },
]

export function Settings() {
  const { user } = useAuthStore()
  const [email, setEmail] = useState(user?.email || 'support@tebk.com')
  const [saved, setSaved]  = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="section-title">Settings</h1>

      {SECTIONS.map(({ icon: Icon, title, rows }) => (
        <div key={title} className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
          </div>
          {rows.map(r => <SettingRow key={r.label} label={r.label} description={r.desc} defaultChecked={r.checked} />)}
        </div>
      ))}

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-ink">Support Contact</h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-base flex-1"
          />
          <button onClick={handleSave} className="btn-primary shrink-0 flex items-center gap-1.5">
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
