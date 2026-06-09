import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Package, Check, X, Plus, Trash2 } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import {
  fetchAllProducts, updateProduct,
  fetchCategories, createProduct, createProductWithVariants,
} from '@/services/adminProductService'
import { formatCurrency, cn } from '@/lib/utils'

const STATUS_STYLES = {
  active:        'badge-success',
  low_stock:     'badge-warning',
  out_of_stock:  'badge-danger',
}

function stockStatus(stock) {
  if (stock === 0)  return 'out_of_stock'
  if (stock < 20)   return 'low_stock'
  return 'active'
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-slate-100 rounded" style={{ width: i === 1 ? '75%' : '50%' }} />
        </td>
      ))}
    </tr>
  )
}

const BLANK_FORM    = { title: '', description: '', category_id: '', price: '', stock: '', image: '' }
const BLANK_VARIANT = { size: '', price: '', quantity: '' }

export function Products() {
  const queryClient = useQueryClient()

  // ── existing list / inline-edit state ────────────────────────────────────
  const [search,     setSearch]   = useState('')
  const [editingId,  setEditing]  = useState(null)
  const [editValues, setEditVals] = useState({})

  // ── add-product modal state ──────────────────────────────────────────────
  const [showAdd,     setShowAdd]     = useState(false)
  const [productType, setProductType] = useState('single')
  const [form,        setForm]        = useState(BLANK_FORM)
  const [variants,    setVariants]    = useState([{ ...BLANK_VARIANT }])
  const [addError,    setAddError]    = useState('')

  // ── queries ──────────────────────────────────────────────────────────────
  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn:  fetchAllProducts,
  })
  const products = raw?.data || []

  const { data: catData } = useQuery({
    queryKey:  ['admin-categories'],
    queryFn:   fetchCategories,
    staleTime: Infinity,
  })
  const categories = catData?.data || []

  // ── mutations ────────────────────────────────────────────────────────────
  const { mutate: saveProduct, isPending: saving } = useMutation({
    mutationFn: ({ id, updates }) => updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      setEditing(null)
    },
  })

  const { mutate: addSingle, isPending: addingSingle } = useMutation({
    mutationFn: createProduct,
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); closeAdd() },
    onError:    (e) => setAddError(e.message || 'Failed to save product.'),
  })

  const { mutate: addWithVariants, isPending: addingVariants } = useMutation({
    mutationFn: ({ fields, vars }) => createProductWithVariants(fields, vars),
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); closeAdd() },
    onError:    (e) => setAddError(e.message || 'Failed to save product.'),
  })

  // ── existing inline-edit helpers ─────────────────────────────────────────
  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = products.filter(p => stockStatus(p.stock) === 'active').length
  const outCount    = products.filter(p => p.stock === 0).length

  const startEdit   = (p) => { setEditing(p.id); setEditVals({ price: p.price, stock: p.stock }) }
  const cancelEdit  = () => setEditing(null)
  const confirmEdit = (id) => {
    const price = Number(editValues.price)
    const stock = Number(editValues.stock)
    if (isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) return
    saveProduct({ id, updates: { price, stock } })
  }

  // ── add-modal helpers ────────────────────────────────────────────────────
  const openAdd  = () => {
    setShowAdd(true)
    setProductType('single')
    setForm({ ...BLANK_FORM })
    setVariants([{ ...BLANK_VARIANT }])
    setAddError('')
  }
  const closeAdd = () => setShowAdd(false)

  const setVar  = (i, field, val) => setVariants(vs => vs.map((v, j) => j === i ? { ...v, [field]: val } : v))
  const addRow  = () => setVariants(vs => [...vs, { ...BLANK_VARIANT }])
  const dropRow = (i) => setVariants(vs => vs.filter((_, j) => j !== i))

  const handleSubmit = (e) => {
    e.preventDefault()
    setAddError('')
    if (!form.title.trim()) { setAddError('Title is required.'); return }
    if (productType === 'variants') {
      if (!variants.some(v => v.size.trim())) { setAddError('Add at least one variant with a size.'); return }
      addWithVariants({ fields: form, vars: variants })
    } else {
      addSingle(form)
    }
  }

  const isSaving = addingSingle || addingVariants

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <h1 className="section-title">Products</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Products"  value={isLoading ? '…' : products.length.toString()} icon={Package} />
        <StatCard title="Active"          value={isLoading ? '…' : activeCount.toString()}      icon={Package} />
        <StatCard title="Out of Stock"    value={isLoading ? '…' : outCount.toString()}         icon={Package} />
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products or category…"
          className="input-base pl-10 text-sm"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-right">Price (EGP)</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
                : filtered.length === 0
                  ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No products found.</td></tr>
                  : filtered.map(p => {
                    const status    = stockStatus(p.stock)
                    const isEditing = editingId === p.id
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-ink max-w-[200px] truncate">{p.name}</td>
                        <td className="px-5 py-3.5 text-muted capitalize">{p.category}</td>
                        <td className="px-5 py-3.5 text-right">
                          {isEditing ? (
                            <input
                              type="number" min="1"
                              value={editValues.price}
                              onChange={e => setEditVals(v => ({ ...v, price: e.target.value }))}
                              className="input-base text-right text-sm w-24 py-1"
                            />
                          ) : formatCurrency(p.price)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-ink">
                          {isEditing ? (
                            <input
                              type="number" min="0"
                              value={editValues.stock}
                              onChange={e => setEditVals(v => ({ ...v, stock: e.target.value }))}
                              className="input-base text-right text-sm w-20 py-1"
                            />
                          ) : p.stock.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={STATUS_STYLES[status]}>{status.replace('_', ' ')}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => confirmEdit(p.id)} disabled={saving}
                                className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                              ><Check className="w-3.5 h-3.5" /></button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                              ><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <button onClick={() => startEdit(p)} className="text-xs text-primary hover:underline">
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Product Modal ──────────────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-ink">Add New Product</h2>
              <button onClick={closeAdd} className="p-1.5 rounded-lg hover:bg-slate-100 text-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Product type toggle */}
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Product Type</p>
                <div className="flex rounded-xl border border-border overflow-hidden text-sm">
                  <button
                    type="button"
                    onClick={() => setProductType('single')}
                    className={cn(
                      'flex-1 px-4 py-2.5 font-medium transition-colors',
                      productType === 'single' ? 'bg-primary text-white' : 'text-muted hover:bg-slate-50'
                    )}
                  >Single Product / Device</button>
                  <button
                    type="button"
                    onClick={() => setProductType('variants')}
                    className={cn(
                      'flex-1 px-4 py-2.5 font-medium transition-colors border-l border-border',
                      productType === 'variants' ? 'bg-primary text-white' : 'text-muted hover:bg-slate-50'
                    )}
                  >Product with Variants</button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Nitrile Examination Gloves"
                  className="input-base text-sm w-full"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short product description"
                  rows={2}
                  className="input-base text-sm w-full"
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Category + Image */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Category</label>
                  <select
                    value={form.category_id}
                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                    className="input-base text-sm w-full"
                  >
                    <option value="">— Select —</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Image URL</label>
                  <input
                    value={form.image}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://…"
                    className="input-base text-sm w-full"
                  />
                </div>
              </div>

              {/* Single product: price + stock */}
              {productType === 'single' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Price (EGP)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="0.00"
                      className="input-base text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Stock</label>
                    <input
                      type="number" min="0"
                      value={form.stock}
                      onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                      placeholder="0"
                      className="input-base text-sm w-full"
                    />
                  </div>
                </div>
              )}

              {/* Product with variants: dynamic rows */}
              {productType === 'variants' && (
                <div>
                  <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
                    Variants <span className="normal-case font-normal">(Size · Price · Stock)</span>
                  </p>
                  <div className="space-y-2">
                    {variants.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          value={v.size}
                          onChange={e => setVar(i, 'size', e.target.value)}
                          placeholder="Size (e.g. S, 5ml)"
                          className="input-base text-sm flex-1"
                        />
                        <input
                          type="number" min="0" step="1"
                          value={v.price}
                          onChange={e => setVar(i, 'price', e.target.value)}
                          placeholder="Price (EGP)"
                          className="input-base text-sm w-24"
                        />
                        <input
                          type="number" min="0"
                          value={v.quantity}
                          onChange={e => setVar(i, 'quantity', e.target.value)}
                          placeholder="Stock"
                          className="input-base text-sm w-20"
                        />
                        {variants.length > 1 && (
                          <button
                            type="button" onClick={() => dropRow(i)}
                            className="p-1.5 text-danger hover:opacity-70 shrink-0"
                          ><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button" onClick={addRow}
                    className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add variant
                  </button>
                </div>
              )}

              {addError && <p className="text-xs text-danger">{addError}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="button" onClick={closeAdd}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-slate-50 transition-colors"
                >Cancel</button>
                <button
                  type="submit" disabled={isSaving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >{isSaving ? 'Saving…' : 'Save Product'}</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
