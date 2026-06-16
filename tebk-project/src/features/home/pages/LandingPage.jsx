import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Bot, Package, RefreshCw, Warehouse, Camera,
  ArrowRight, ShoppingCart, Sparkles, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shared/ProductCard'
import { MOCK_BUNDLES } from '@/utils/mockData'
import { fetchFeaturedProducts } from '@/services/productService'
import { formatCurrency } from '@/utils/format'
import { useTranslation } from '@/hooks/useTranslation'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export function LandingPage() {
  const { t } = useTranslation()

  const FEATURES = [
    { icon: Bot,         title: t('landing.feature_ai_title'),        desc: t('landing.feature_ai_desc') },
    { icon: Package,     title: t('landing.feature_bundles_title'),    desc: t('landing.feature_bundles_desc') },
    { icon: RefreshCw,   title: t('landing.feature_refill_title'),     desc: t('landing.feature_refill_desc') },
    { icon: Warehouse,   title: t('landing.feature_inventory_title'),  desc: t('landing.feature_inventory_desc') },
    { icon: Camera,      title: t('landing.feature_camera_title'),     desc: t('landing.feature_camera_desc') },
    { icon: ShieldCheck, title: t('landing.feature_b2b_title'),        desc: t('landing.feature_b2b_desc') },
  ]

  const STATS = [
    { value: '5,000+', label: t('landing.stat_products') },
    { value: '300+',   label: t('landing.stat_clients') },
    { value: '98%',    label: t('landing.stat_accuracy') },
    { value: '24h',    label: t('landing.stat_delivery') },
  ]
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn:  fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  })

  const featured = (productsData?.data || []).slice(0, 8)

  return (
    <div className="overflow-x-hidden -mt-20">

      {/* ══════════════════════════════════════════
          HERO  — Full-width teal + wave bottom
      ══════════════════════════════════════════ */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ background: '#17C3CE', minHeight: '100vh' }}
      >
        {/* ── Full-width background image ── */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1 }}
        >
          <img
            src="/hero-pharmacy.jpg"
            alt="Medical supplies"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'right center' }}
          />
          {/* Left-side teal gradient — only covers text area */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(23,195,206,0.92) 0%, rgba(23,195,206,0.75) 22%, rgba(23,195,206,0.35) 42%, transparent 60%)',
            }}
          />
          {/* Bottom gradient — softens into wave */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(23,195,206,0.35) 0%, transparent 18%)' }}
          />
        </motion.div>

        {/* ── Text content ── */}
        <div className="page-container w-full relative z-10 pt-32 pb-16 sm:pb-36">
          <div className="w-full sm:max-w-[60%] lg:max-w-[50%]">
            <motion.div initial="hidden" animate="show" variants={stagger}>

              {/* Eyebrow */}
              <motion.p
                variants={fadeUp}
                className="text-sm font-semibold tracking-[0.18em] uppercase mb-3"
                style={{ color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}
              >
                Awesome Care
              </motion.p>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="font-display font-extrabold leading-[1.05] mb-6"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#fff' }}
              >
                SMARTER<br />
                <span style={{ color: '#fff' }}>MEDICAL</span><br />
                SUPPLY.
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="text-base leading-relaxed mb-10 max-w-sm"
                style={{ color: 'rgba(255,255,255,0.82)' }}
              >
                TEBK combines AI-powered recommendations, smart bundles, and subscription refills
                to transform how healthcare providers buy medical supplies.
              </motion.p>

              {/* CTA */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-14">
                <Link
                  to="/assistant"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  style={{ background: '#1a3363', letterSpacing: '0.08em' }}
                >
                  Our Solutions
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:scale-105 hover:bg-white/20"
                  style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}
                >
                  Browse Products
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeUp} className="flex items-center gap-8 flex-wrap">
                {STATS.map(({ value, label }, i) => (
                  <div key={label} className="flex items-center gap-3">
                    {i > 0 && <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.3)' }} />}
                    <div>
                      <p className="text-2xl font-display font-bold leading-none text-white">{value}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* ── Bottom white wave ── */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg
            viewBox="0 0 1440 110"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block"
            style={{ height: 110 }}
          >
            <path
              d="M0,110 C240,38 480,10 720,30 C960,50 1200,38 1440,110 L1440,110 L0,110 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="py-20 section-surface">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold text-primary">{t('landing.features_title')}</h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">{t('landing.features_subtitle')}</p>
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

      {/* ══════════════════════════════════════════
          FEATURED PRODUCTS — Infinite Marquee
      ══════════════════════════════════════════ */}
      <section className="py-20 section-white" style={{ overflow: 'hidden', backgroundColor: '#F9FAFB' }}>
        <style>{`
          @keyframes tebk-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .tebk-slider { animation: tebk-scroll 26s linear infinite; }
          .tebk-slider:hover { animation-play-state: paused; }
        `}</style>

        {/* Header */}
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary">Popular products</h2>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Most ordered by clinics this month</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">{t('landing.view_all')} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>

        {/* Slider */}
        {productsLoading ? (
          <div className="page-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="rounded-3xl bg-gray-100 animate-pulse h-72" />
              ))}
            </div>
          </div>
        ) : featured.length === 0 ? (
          <div className="page-container">
            <p className="text-center py-8" style={{ color: '#6B7280' }}>No featured products yet.</p>
          </div>
        ) : (
          <div style={{ overflow: 'hidden' }}>
            <div
              className="tebk-slider"
              style={{
                display: 'flex',
                gap: '20px',
                width: 'max-content',
                padding: '8px 0 16px',
              }}
            >
              {/* Duplicate array for seamless infinite loop — no left padding so no gap on reset */}
              {[...featured, ...featured].map((p, i) => (
                <div key={`${p.id}-${i}`} style={{ width: '272px', flexShrink: 0 }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          SMART BUNDLES
      ══════════════════════════════════════════ */}
      <section className="py-20 section-clinical">
        <div className="page-container">

          {/* Top pill banner */}
          <div className="flex justify-center mb-10">
            <div
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-medium"
              style={{ background: 'rgba(23,195,206,0.08)', border: '1px solid rgba(23,195,206,0.35)', boxShadow: '0 2px 16px rgba(23,195,206,0.12)', color: '#1a3363' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#17C3CE' }} />
              Pre-built supply kits
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#17C3CE', opacity: 0.5 }} />
              save up to 22% vs buying individually
            </div>
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary">{t('landing.bundles_title')}</h2>
              <p className="text-muted text-sm mt-1">{t('landing.bundles_subtitle')}</p>
            </div>
            <Button variant="outline" asChild style={{ borderColor: '#17C3CE', color: '#17C3CE' }}>
              <Link to="/bundles">All bundles <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          {/* Bundle cards — horizontal image layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {MOCK_BUNDLES.filter(b => b.featured).map(bundle => (
              <div
                key={bundle.id}
                className="flex flex-col sm:flex-row rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative"
                style={{
                  background: 'rgba(255,255,255,0.62)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 4px 28px rgba(33,51,96,0.09)',
                  minHeight: '220px',
                }}
              >
                {/* Sparkle decoration */}
                <div className="absolute bottom-3 right-3 opacity-20 pointer-events-none">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>

                {/* Left – image */}
                <div className="w-full h-48 sm:w-[38%] sm:h-auto shrink-0 relative overflow-hidden">
                  {bundle.image_url ? (
                    <img
                      src={bundle.image_url}
                      alt={bundle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c8edf5, #b5e8e0)' }}>
                      <Package className="w-12 h-12 text-secondary/50" />
                    </div>
                  )}
                  {/* Save badge over image */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: '#C1E3C4', color: '#1a3363' }}>
                    Save {bundle.savings_pct}%
                  </div>
                </div>

                {/* Right – content */}
                <div className="flex-1 flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#1a3363' }}>{bundle.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{bundle.description}</p>
                    <p className="text-xs text-gray-400 italic mt-3">
                      {bundle.items.length} {t('landing.products_included')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 line-through">{formatCurrency(bundle.original_price)}</span>
                      <span className="text-xl font-bold" style={{ color: '#1a3363' }}>{formatCurrency(bundle.bundle_price)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/bundles"
                        className="text-sm font-semibold transition-colors hover:underline"
                        style={{ color: '#17C3CE' }}
                      >
                        {t('landing.details')}
                      </Link>
                      <Link
                        to="/bundles"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
                        style={{ background: '#17C3CE' }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('landing.add_to_cart')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          AI ASSISTANT CTA
      ══════════════════════════════════════════ */}
      <section className="py-20 section-alt">
        <div className="page-container text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary mb-3">{t('landing.ai_cta_title')}</h2>
          <p className="text-muted max-w-md mx-auto mb-8">
            {t('landing.ai_cta_desc')}
          </p>
          <Button size="lg" asChild>
            <Link to="/assistant">{t('landing.start_assistant')} <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

    </div>
  )
}
