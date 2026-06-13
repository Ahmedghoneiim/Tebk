import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RotateCcw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { fetchReturns, createReturn } from '@/services/returnService'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/store/notificationStore'
import { formatDate } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'

const STATUS_BADGE = { approved: 'success', pending: 'warning', rejected: 'danger', processed: 'default' }

const EMPTY_FORM = { product: '', order_id: '', reason: '' }

function TableSkeleton() {
  return (
    <>
      {[1, 2].map(i => (
        <tr key={i} className="animate-pulse">
          {[1, 2, 3, 4, 5].map(j => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-clinical rounded" style={{ width: j === 2 ? '70%' : '50%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function ReturnsPage() {
  usePageTitle('Returns')
  const user = useAuthStore(s => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['returns', user?.id],
    queryFn:  () => fetchReturns(user?.id),
    enabled:  !!user?.id,
  })

  const [localItems, setLocalItems] = useState([])
  const [open, setOpen]     = useState(false)
  const [form, setForm]     = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const serverItems = data?.data || []
  const allItems = [...localItems, ...serverItems]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.product.trim() || !form.reason.trim()) return
    setSaving(true)
    const { data: created, error } = await createReturn(user?.id, form)
    setSaving(false)
    if (error) { toast.error('Failed to submit return'); return }
    setLocalItems(prev => [created, ...prev])
    setOpen(false)
    setForm(EMPTY_FORM)
    toast.success('Return request submitted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Returns</h1>
          <p className="text-muted text-sm mt-1">Manage product return requests</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> New Return</Button>
      </div>

      {!isLoading && allItems.length === 0 ? (
        <EmptyState icon={RotateCcw} title="No returns" description="You haven't submitted any return requests." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  {['Return #', 'Product', 'Reason', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? <TableSkeleton /> : allItems.map(r => (
                  <tr key={r.id} className="hover:bg-clinical transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-secondary">#{r.id.toString().slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3 font-medium text-ink">{r.product}</td>
                    <td className="px-4 py-3 text-muted">{r.reason}</td>
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
            <DialogTitle>New Return Request</DialogTitle>
            <DialogDescription>Submit a return for an item from a recent order.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-1">Product Name <span className="text-danger">*</span></label>
              <Input
                placeholder="e.g. Nitrile Gloves Box 100"
                value={form.product}
                onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">Order ID</label>
              <Input
                placeholder="e.g. o1"
                value={form.order_id}
                onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">Reason <span className="text-danger">*</span></label>
              <Input
                placeholder="e.g. Wrong size delivered"
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving || !form.product.trim() || !form.reason.trim()}>
                {saving ? 'Submitting…' : 'Submit Return'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
