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
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t } = useTranslation()
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
    if (error) { toast.error(t('purchase_requests.error_create')); return }
    setLocalItems(prev => [created, ...prev])
    setOpen(false)
    setForm(EMPTY_FORM)
    toast.success(t('purchase_requests.success_create'))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">{t('purchase_requests.title')}</h1>
          <p className="text-muted text-sm mt-1">{t('purchase_requests.subtitle')}</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> {t('purchase_requests.new_request')}</Button>
      </div>

      {!isLoading && allItems.length === 0 ? (
        <EmptyState icon={Layers} title={t('purchase_requests.empty')} description={t('purchase_requests.empty_desc')} />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  {[t('purchase_requests.col_title'), t('purchase_requests.col_desc'), t('purchase_requests.col_items'), t('purchase_requests.col_total'), t('purchase_requests.col_date'), t('purchase_requests.col_status')].map(h => (
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
            <DialogTitle>{t('purchase_requests.dialog_title')}</DialogTitle>
            <DialogDescription>{t('purchase_requests.dialog_desc')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-1">{t('purchase_requests.field_title')} <span className="text-danger">*</span></label>
              <Input
                placeholder={t('purchase_requests.field_title_ph')}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">{t('purchase_requests.field_desc')}</label>
              <Input
                placeholder={t('purchase_requests.field_desc_ph')}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">{t('purchase_requests.field_total')}</label>
              <Input
                type="number"
                min="0"
                placeholder={t('purchase_requests.field_total_ph')}
                value={form.total}
                onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('purchase_requests.cancel')}</Button>
              <Button type="submit" disabled={saving || !form.title.trim()}>
                {saving ? t('purchase_requests.submitting') : t('purchase_requests.submit')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
