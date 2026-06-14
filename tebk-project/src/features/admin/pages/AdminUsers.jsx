import { Badge } from '@/components/ui/badge'

const MOCK_USERS = [
  { id: 'u1', full_name: 'Dr. Ahmed Mohamed', email: 'ahmed@alshifa.com',     role: 'client',   clinic_name: 'Al Shifa Clinic',     created_at: '2025-01-10' },
  { id: 'u2', full_name: 'Dr. Sara Hassan',   email: 'sara@dentalcare.com',   role: 'client',   clinic_name: 'Dental Care Center',  created_at: '2025-02-05' },
  { id: 'u3', full_name: 'Med Supply Co.',    email: 'supply@medco.com',      role: 'supplier', clinic_name: null,                  created_at: '2025-01-22' },
  { id: 'u4', full_name: 'Admin User',        email: 'admin@tebk.com',        role: 'admin',    clinic_name: null,                  created_at: '2024-12-01' },
]

const ROLE_BADGE = { admin: 'default', client: 'secondary', supplier: 'success' }

export function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Users</h1>
        <p className="text-muted text-sm mt-1">{MOCK_USERS.length} registered users</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {['Name', 'Email', 'Role', 'Clinic', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_USERS.map(u => (
                <tr key={u.id} className="hover:bg-clinical transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{u.full_name}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3"><Badge variant={ROLE_BADGE[u.role]} className="capitalize">{u.role}</Badge></td>
                  <td className="px-4 py-3 text-muted">{u.clinic_name || '—'}</td>
                  <td className="px-4 py-3 text-muted">{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
