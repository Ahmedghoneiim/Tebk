import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Users } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { fetchAllUsers } from '@/services/adminUserService'
import { formatDate } from '@/lib/utils'

const ROLE_STYLES = {
  clinic_owner:        'badge-info',
  doctor:              'badge-info',
  staff:               'badge-default',
  procurement_officer: 'badge-default',
  supplier:            'badge-warning',
  admin:               'badge-danger',
}

const ROLE_LABELS = {
  clinic_owner:        'Clinic Owner',
  doctor:              'Doctor',
  staff:               'Staff',
  procurement_officer: 'Procurement',
  supplier:            'Supplier',
  admin:               'Admin',
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-slate-100 rounded" style={{ width: i === 1 ? '70%' : '45%' }} />
        </td>
      ))}
    </tr>
  )
}

export function Customers() {
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn:  fetchAllUsers,
  })
  const users = raw?.data || []

  const filtered = users.filter(u => {
    const matchSearch = (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
                        (u.clinic_name || '').toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const b2bCount      = users.filter(u => u.role === 'clinic_owner' || u.role === 'supplier').length
  const supplierCount = users.filter(u => u.role === 'supplier').length

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: 6 }, (_, i) => <TableRowSkeleton key={i} />)
    }
    if (filtered.length === 0) {
      return <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">No users found.</td></tr>
    }
    return filtered.map(u => (
      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
        <td className="px-5 py-3.5">
          <p className="font-medium text-ink">{u.full_name || '—'}</p>
          <p className="text-xs text-muted">{u.email}</p>
          {u.clinic_name && <p className="text-xs text-muted">{u.clinic_name}</p>}
        </td>
        <td className="px-5 py-3.5">
          <span className={ROLE_STYLES[u.role] || 'badge-default'}>
            {ROLE_LABELS[u.role] || u.role}
          </span>
        </td>
        <td className="px-5 py-3.5 text-center font-semibold text-ink">{u.order_count}</td>
        <td className="px-5 py-3.5 text-muted">{formatDate(u.created_at)}</td>
      </tr>
    ))
  }

  return (
    <div className="space-y-5">
      <h1 className="section-title">Customers & Users</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={isLoading ? '…' : users.length.toString()} icon={Users} />
        <StatCard title="B2B Clients"  value={isLoading ? '…' : b2bCount.toString()}    icon={Users} />
        <StatCard title="Suppliers"    value={isLoading ? '…' : supplierCount.toString()} icon={Users} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email or clinic…"
            className="input-base pl-10 text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="input-base text-sm"
        >
          <option value="all">All roles</option>
          <option value="clinic_owner">Clinic Owners</option>
          <option value="doctor">Doctors</option>
          <option value="supplier">Suppliers</option>
          <option value="staff">Staff</option>
          <option value="procurement_officer">Procurement</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-center">Orders</th>
                <th className="px-5 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {renderRows()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
