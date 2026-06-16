import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { fetchProducts, fetchCategories } from '@/services/productService'
import { ProductCard } from '@/components/shared/ProductCard'
import { ProductCardSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Input } from '@/components/ui/input'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'name_asc',   label: 'Name A–Z' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export function CatalogPage() {
  usePageTitle('Product Catalog')
  const [searchParams, setSearchParams] = useSearchParams()
  const [search,      setSearch]      = useState('')
  const [sortBy,      setSortBy]      = useState('name_asc')

  const category = searchParams.get('cat') || 'all'
  const setCategory = (val) => setSearchParams(p => {
    const next = new URLSearchParams(p)
    val === 'all' ? next.delete('cat') : next.set('cat', val)
    return next
  }, { replace: true })

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
  const { data: allData, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn:  () => fetchProducts({}),
  })

  const categories = catData?.data || []
  const allProducts = allData?.data || []

  // All filtering and sorting done client-side — instant, no extra API calls
  const products = useMemo(() => {
    let results = [...allProducts]
    if (category !== 'all') {
      const catId = parseInt(category, 10)
      results = results.filter(p => p.category_id === catId)
    }
    if (search)
      results = results.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      )
    if (sortBy === 'price_asc')  results.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') results.sort((a, b) => b.price - a.price)
    if (sortBy === 'name_asc')   results.sort((a, b) => a.name?.localeCompare(b.name))
    return results
  }, [allProducts, category, search, sortBy])

  return (
    <div className="page-container py-8">
      <div className="mb-6">
        <h1 className="section-title">Medical Supplies</h1>
        <p className="text-muted text-sm mt-1">
          {search || category !== 'all'
            ? `${products.length} of ${allProducts.length} products`
            : `${allProducts.length} products available`}
        </p>
      </div>

      {/* Search + controls */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:text-slate-400 dark:hover:text-slate-100">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-base w-auto cursor-pointer"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategory('all')}
          className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
            category === 'all' ? 'bg-primary text-white' : 'bg-white border border-border text-muted hover:border-primary hover:text-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-secondary dark:hover:text-secondary')}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(category === String(c.id) ? 'all' : c.id)}
            className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              category === String(c.id) ? 'bg-primary text-white' : 'bg-white border border-border text-muted hover:border-primary hover:text-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-secondary dark:hover:text-secondary')}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <p className="text-center py-16 text-danger text-sm">Failed to load products. Please refresh.</p>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or category filter."
          action={() => { setSearch(''); setCategory('all') }}
          actionLabel="Clear filters"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
