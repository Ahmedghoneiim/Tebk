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
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t } = useTranslation()
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
    if (error) { toast.error(t('returns.error_submit')); return }
    setLocalItems(prev => [created, ...prev])
    setOpen(false)
    setForm(EMPTY_FORM)
    toast.success(t('returns.success_submit'))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">{t('returns.title')}</h1>
          <p className="text-muted text-sm mt-1">{t('returns.subtitle')}</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> {t('returns.new_return')}</Button>
      </div>

      {!isLoading && allItems.length === 0 ? (
        <EmptyState icon={RotateCcw} title={t('returns.empty')} description={t('returns.empty_desc')} />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  {[t('returns.col_return'), t('returns.col_product'), t('returns.col_reason'), t('returns.col_date'), t('returns.col_status')].map(h => (
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
            <DialogTitle>{t('returns.dialog_title')}</DialogTitle>
            <DialogDescription>{t('returns.dialog_desc')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-1">{t('returns.field_product')} <span className="text-danger">*</span></label>
              <Input
                placeholder={t('returns.field_product_ph')}
                value={form.product}
                onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">{t('returns.field_order_id')}</label>
              <Input
                placeholder={t('returns.field_order_ph')}
                value={form.order_id}
                onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-1">{t('returns.field_reason')} <span className="text-danger">*</span></label>
              <Input
                placeholder={t('returns.field_reason_ph')}
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('returns.cancel')}</Button>
              <Button type="submit" disabled={saving || !form.product.trim() || !form.reason.trim()}>
                {saving ? t('returns.submitting') : t('returns.submit')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
