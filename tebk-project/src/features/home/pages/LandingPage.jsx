import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bot, Package, RefreshCw, Warehouse, Camera, ShieldCheck, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shared/ProductCard'
import { MOCK_PRODUCTS, MOCK_BUNDLES } from '@/utils/mockData'
import { formatCurrency } from '@/utils/format'

const FEATURES = [
  { icon: Bot,        title: 'AI Buyer Assistant',     desc: 'Answer 4 questions, get a full procurement recommendation tailored to your clinic type and budget.' },
  { icon: Package,    title: 'Smart Bundles',          desc: 'Pre-built, AI-adjusted supply bundles for dental, ICU, lab, and general clinics — buy more, save more.' },
  { icon: RefreshCw,  title: 'Auto-Refill',            desc: 'Subscribe to consumables and never run out. Pause, resume, or change frequency anytime.' },
  { icon: Warehouse,  title: 'Inventory Management',   desc: 'Track stock levels, get low-stock alerts, and generate reorder suggestions automatically.' },
  { icon: Camera,     title: 'Image Search',           desc: 'Photograph any medical item and instantly find the exact product or the closest alternative.' },
  { icon: ShieldCheck,title: 'B2B Verified',           desc: 'Purpose-built for clinics, hospitals, and procurement teams. Every product is healthcare-grade.' },
]

const STATS = [
  { value: '5,000+', label: 'Medical Products' },
  { value: '300+',   label: 'Healthcare Clients' },
  { value: '98%',    label: 'Order Accuracy' },
  { value: '24h',    label: 'Avg. Delivery' },
]

const FEATURED = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 4)

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-700 to-primary-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(46,196,182,0.15),transparent_60%)]" />
        <div className="page-container relative">
          <motion.div
            className="max-w-2xl"
            initial="hidden" animate="show" variants={stagger}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Bot className="w-4 h-4 text-secondary" />
              AI-Powered Medical Procurement
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-display font-bold leading-tight mb-6">
              Smarter procurement for{' '}
              <span className="text-secondary">modern clinics</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-primary-200 text-lg leading-relaxed mb-8">
              TEBK combines AI-powered recommendations, smart bundles, and subscription refills to transform how healthcare providers buy medical supplies.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/assistant">Try AI Assistant <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-white">
        <div className="page-container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-display font-bold text-primary">{value}</p>
                <p className="text-sm text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold text-primary">Everything your clinic needs</h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">From one-click reorders to AI-driven procurement recommendations — TEBK does the heavy lifting.</p>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="card hover:shadow-card transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-clinical flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary">Popular products</h2>
              <p className="text-muted text-sm mt-1">Most ordered by clinics this month</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">View all <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Smart Bundles preview */}
      <section className="py-20 bg-background">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary">Smart Bundles</h2>
              <p className="text-muted text-sm mt-1">Pre-built kits — save up to 22%</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/bundles">All bundles <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {MOCK_BUNDLES.filter(b => b.featured).map(bundle => (
              <Link key={bundle.id} to="/bundles" className="card hover:shadow-card transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-primary">{bundle.name}</h3>
                    <span className="badge-success ml-2 whitespace-nowrap">Save {bundle.savings_pct}%</span>
                  </div>
                  <p className="text-sm text-muted mb-4">{bundle.description}</p>
                  <p className="text-xs text-muted">{bundle.items.length} products included</p>
                </div>
                <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-muted line-through mr-2">{formatCurrency(bundle.original_price)}</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(bundle.bundle_price)}</span>
                  </div>
                  <span className="text-secondary text-sm font-medium">View bundle →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="py-20 bg-gradient-to-r from-secondary/10 to-primary/10">
        <div className="page-container text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary mb-3">Not sure what to order?</h2>
          <p className="text-muted max-w-md mx-auto mb-8">
            Answer 4 quick questions about your clinic and our AI will build a complete procurement list with quantities and cost estimates.
          </p>
          <Button size="lg" asChild>
            <Link to="/assistant">Start AI Assistant <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
