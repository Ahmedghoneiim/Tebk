import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Shield, Activity, Package, Boxes, Scissors, Star } from 'lucide-react'
import { fetchCategories, fetchProducts } from '@/services/productService'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const COLORS = [
  { bg: 'bg-blue-50',   icon: 'text-blue-500',   hover: 'hover:border-blue-200'   },
  { bg: 'bg-teal-50',   icon: 'text-teal-500',   hover: 'hover:border-teal-200'   },
  { bg: 'bg-purple-50', icon: 'text-purple-500', hover: 'hover:border-purple-200' },
  { bg: 'bg-amber-50',  icon: 'text-amber-500',  hover: 'hover:border-amber-200'  },
  { bg: 'bg-green-50',  icon: 'text-green-500',  hover: 'hover:border-green-200'  },
  { bg: 'bg-rose-50',   icon: 'text-rose-500',   hover: 'hover:border-rose-200'   },
]

const ICONS = [Shield, Activity, Package, Boxes, Scissors, Star]

function CategorySkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <Skeleton className="w-12 h-12 rounded-xl mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}

export function CategoriesPage() {
  usePageTitle('Categories')
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: catData, isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn:  fetchCategories,
  })

  const { data: prodData, isLoading: prodsLoading } = useQuery({
    queryKey: ['products', {}],
    queryFn:  () => fetchProducts({}),
  })

  const categories = catData?.data || []
  const products   = prodData?.data || []
  const isLoading  = catsLoading || prodsLoading

  const getCount = (cat) =>
    products.filter(p => p.category === cat.id || p.category_id === cat.id).length

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="section-title">{t('categories.title')}</h1>
        <p className="text-muted text-sm mt-1">{t('categories.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
          : categories.map((cat, idx) => {
              const color = COLORS[idx % COLORS.length]
              const Icon  = ICONS[idx % ICONS.length]
              const count = getCount(cat)

              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?cat=${cat.id}`)}
                  className={cn(
                    'card p-6 text-left group border border-border transition-all duration-200 hover:shadow-card',
                    color.hover
                  )}
                >
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', color.bg)}>
                    <Icon className={cn('w-6 h-6', color.icon)} />
                  </div>
                  <h2 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors mb-1">
                    {cat.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">{count} {count === 1 ? t('categories.product') : t('categories.products')}</p>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              )
            })
        }
      </div>
    </div>
  )
}
