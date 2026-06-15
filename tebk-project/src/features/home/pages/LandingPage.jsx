import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bot, Package, RefreshCw, Warehouse, Camera,
  ArrowRight, CheckCircle, ShoppingCart, Sparkles, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shared/ProductCard'
import { MOCK_PRODUCTS, MOCK_BUNDLES } from '@/utils/mockData'
import { formatCurrency } from '@/utils/format'
import { useTranslation } from '@/hooks/useTranslation'

const FEATURED = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 4)

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

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO  — Sehatin-style floating image
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #CBEDFC 0%, #daeffe 50%, #CBEDFC 100%)' }}
      >
        {/* ── Right image — absolutely positioned, full height, no frame ── */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 hidden lg:block"
          style={{ width: '52%' }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          <img
            src="/hero-pharmacy.jpg"
            alt="Pharmacist helping a client"
            className="w-full h-full object-cover object-center"
          />
          {/* Left fade — blends image into hero background */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, #CBEDFC 0%, rgba(234,246,251,0.6) 18%, transparent 42%)' }}
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, #CBEDFC 0%, transparent 20%)' }}
          />

        </motion.div>

        {/* ── Left text content ── */}
        <div className="page-container w-full py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            className=""
            initial="hidden" animate="show" variants={stagger}
          >
            {/* Top badge */}
            <motion.div variants={fadeUp}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium mb-8"
              style={{ color: '#4ea055' }}
            >
              <CheckCircle className="w-4 h-4" />
              {t('landing.badge')}
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl xl:text-[68px] font-display font-extrabold leading-[1.05] mb-6"
              style={{ color: '#1a3363' }}
            >
              {t('landing.hero_headline_1')}<br />
              <span style={{ color: '#4ea055' }}>{t('landing.hero_headline_2')}</span><br />
              {t('landing.hero_headline_3')}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              {t('landing.hero_desc')}
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ background: '#1a3363' }}
              >
                {t('landing.try_assistant')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:scale-105 bg-white/60"
                style={{ borderColor: '#1a3363', color: '#1a3363' }}
              >
                {t('landing.browse_products')}
              </Link>
            </motion.div>

            {/* Stats row — like Sehatin */}
            <motion.div variants={fadeUp} className="flex items-center gap-10">
              {STATS.map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-3">
                  {i > 0 && <div className="w-px h-8 bg-gray-200" />}
                  <div>
                    <p className="text-2xl font-display font-bold leading-none" style={{ color: '#1a3363' }}>{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-background">
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
          FEATURED PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary">{t('landing.popular_products')}</h2>
              <p className="text-muted text-sm mt-1">{t('landing.popular_subtitle')}</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">{t('landing.view_all')} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SMART BUNDLES
      ══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: 'linear-gradient(140deg, #CBEDFC 0%, #daeffe 55%, #C1E3C4 100%)' }}>
        <div className="page-container">

          {/* Top pill banner */}
          <div className="flex justify-center mb-10">
            <div
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 16px rgba(33,51,96,0.08)', color: '#444' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#4ea055' }} />
              {t('landing.prebuilt_kits')}
              <span className="w-1 h-1 rounded-full inline-block bg-gray-300" />
              {t('landing.save_22')}
            </div>
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-2xl font-display font-bold text-primary">{t('landing.bundles_title')}</h2>
              <p className="text-muted text-sm mt-1">{t('landing.bundles_subtitle')}</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/bundles">{t('landing.all_bundles')} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          {/* Bundle cards — horizontal image layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {MOCK_BUNDLES.filter(b => b.featured).map(bundle => (
              <div
                key={bundle.id}
                className="flex rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative"
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
                <div className="w-[38%] shrink-0 relative overflow-hidden">
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
                        style={{ color: '#1a3363' }}
                      >
                        {t('landing.details')}
                      </Link>
                      <Link
                        to="/bundles"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
                        style={{ background: '#1a3363' }}
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
      <section className="py-20 bg-gradient-to-r from-secondary/10 to-primary/10">
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
