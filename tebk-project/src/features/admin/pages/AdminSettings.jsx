import { Settings, Globe, Bell, ShieldCheck, CreditCard, Mail } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ defaultChecked }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-10 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:bg-secondary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
    </label>
  )
}

const SECTIONS = [
  {
    icon: Bell,
    title: 'Notifications',
    rows: [
      { label: 'Email alerts for new orders',      desc: 'Receive an email when a new order is placed',       checked: true },
      { label: 'Low stock alerts',                  desc: 'Get notified when a product falls below reorder level', checked: true },
      { label: 'New user registrations',            desc: 'Alert when a new supplier or client registers',    checked: false },
    ],
  },
  {
    icon: Globe,
    title: 'Localisation',
    rows: [
      { label: 'Default currency: EGP',            desc: 'All prices displayed in Egyptian Pounds',           checked: true },
      { label: 'Arabic RTL support',                desc: 'Enable full right-to-left layout when Arabic is selected', checked: true },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments',
    rows: [
      { label: 'Paymob integration active',         desc: 'Accept card and wallet payments via Paymob',        checked: true },
      { label: 'Send payment receipt emails',        desc: 'Automatic email receipt on successful payment',    checked: true },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    rows: [
      { label: 'Two-factor authentication',         desc: 'Require 2FA for admin logins',                     checked: false },
      { label: 'Login activity log',                desc: 'Record all admin sign-in events',                  checked: true },
    ],
  },
]

export function AdminSettings() {
  usePageTitle('Settings — Admin')

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="section-title">Settings</h1>

      {SECTIONS.map(({ icon: Icon, title, rows }) => (
        <div key={title} className="card">
          <div className="flex items-center gap-2 mb-4">
            <Icon className="w-4 h-4 text-secondary" />
            <h2 className="font-semibold text-primary">{title}</h2>
          </div>
          <div>
            {rows.map(r => (
              <SettingRow key={r.label} label={r.label} description={r.desc}>
                <Toggle defaultChecked={r.checked} />
              </SettingRow>
            ))}
          </div>
        </div>
      ))}

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-secondary" />
          <h2 className="font-semibold text-primary">Support Contact</h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            defaultValue="support@tebk.com"
            className="flex-1 text-sm border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-secondary transition-colors"
          />
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
            style={{ background: 'linear-gradient(90deg, #C1E3C4, #1bb3a7)' }}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
