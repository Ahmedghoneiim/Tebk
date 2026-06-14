import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Layers, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { fetchPurchaseRequests, createPurchaseRequest } from '@/services/purchaseRequestService'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/store/notificationStore'
import { formatCurrency, formatDate } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'

const STATUS_BADGE = { approved: 'success', pending: 'warning', rejected: 'danger' }

const EMPTY_FORM = { title: '', description: '', total: '' }

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <tr key={i} className="animate-pulse">
          {[1, 2, 3, 4, 5].map(j => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-clinical rounded" style={{ width: j === 1 ? '70%' : '50%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function PurchaseRequestsPage() {
  usePageTitle('Purchase Requests')
  const user = useAuthStore(s => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['purchase-requests', user?.id],
    queryFn:  () => fetchPurchaseRequests(user?.id),
    enabled:  !!user?.id,
  })

  const [localItems, setLocalItems] = useState([])
  const [open, setOpen]   = useState(false)
  const [form, setForm]   = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const serverItems = data?.data || []
  const allItems = [...localItems, ...serverItems]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    const { data: created, error } = await createPurchaseRequest(user?.id, form)
    setSaving(false)
    if (error) { toast.error('Failed to create request'); return }
    setLocalItems(prev => [created, ...prev])
    setOpen(false)
    setForm(EMPTY_FORM)
    toast.success('Purchase request submitted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Purchase Requests</h1>
          <p className="text-muted text-sm mt-1">B2B procurement approval workflow</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> New Request</Button>
      </div>

      {!isLoading && allItems.length === 0 ? (
        <EmptyState icon={Layers} title="No purchase requests" description="Create a purchase request to start the procurement approval flow." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  {['Title', 'Description', 'Items', 'Total', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? <TableSkeleton /> : allItems.map(r => (
                  <tr key={r.id} className="hover:bg-clinical transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">{r.title}</td>
                    <td className="px-4 py-3 text-muted max-w-[200px] truncate">{r.description || '—'}</td>
                    <td className="px-4 py-3 text-muted">{r.items ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{r.total ? formatCurrency(r.total) : '—'}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[r.status]} className="capitalize">{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Purchase Request</DialogTitle>
            <DialogDescription>Submit a procurement request for admin approval.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-1">Title <span className="text-danger">*</span></label>
              <Input
                placeholder="e.g. Monthly PPE Restock"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">Description</label>
              <Input
                placeholder="Briefly describe what you need and why"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">Estimated Total (EGP)</label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 3500"
                value={form.total}
                onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving || !form.title.trim()}>
                {saving ? 'Submitting…' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
