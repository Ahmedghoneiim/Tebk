import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bot, Package, RefreshCw, Warehouse, Camera, ShieldCheck,
  ArrowRight, Star, CheckCircle,
  ShoppingCart, Stethoscope, HeartPulse, Play,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shared/ProductCard'
import { MOCK_PRODUCTS, MOCK_BUNDLES } from '@/utils/mockData'
import { formatCurrency } from '@/utils/format'

/* ─────────────── animation presets ─────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

/* ─────────────── features ─────────────── */
const FEATURES = [
  { icon: Bot,         title: 'AI Buyer Assistant',  desc: 'Answer 4 questions, get a full procurement recommendation tailored to your clinic type and budget.', bg: 'bg-skySoft text-primary' },
  { icon: Package,     title: 'Smart Bundles',        desc: 'Pre-built, AI-adjusted supply bundles for dental, ICU, lab, and general clinics — buy more, save more.', bg: 'bg-peach-light text-peach' },
  { icon: RefreshCw,   title: 'Auto-Refill',          desc: 'Subscribe to consumables and never run out. Pause, resume, or change frequency anytime.', bg: 'bg-secondary/10 text-secondary' },
  { icon: Warehouse,   title: 'Inventory Management', desc: 'Track stock levels, get low-stock alerts, and generate reorder suggestions automatically.', bg: 'bg-skySoft text-primary' },
  { icon: Camera,      title: 'Image Search',         desc: 'Photograph any medical item and instantly find the exact product or the closest alternative.', bg: 'bg-peach-light text-peach' },
  { icon: ShieldCheck, title: 'B2B Verified',         desc: 'Purpose-built for clinics, hospitals, and procurement teams. Every product is healthcare-grade.', bg: 'bg-secondary/10 text-secondary' },
]

const FEATURED = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 4)

/* ═══════════════════════════════════════════════════════
   HERO SECTION — Full-width background image
═══════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <div className="relative overflow-hidden -mt-24">

      {/* ── Full-screen image hero ── */}
      <div className="relative w-full" style={{ minHeight: 'calc(100vh + 24px)' }}>

        {/* Background photo — covers 100% width & height */}
        <img
          src="/src/assets/pharmacist_hero.jpg"
          alt="Pharmacist helping a patient"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />

        {/* White gradient overlay — comes from the right side (RTL text side) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.45) 38%, rgba(255,255,255,0.93) 62%, #ffffff 100%)',
          }}
        />

        {/* Bottom edge fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.6), transparent)' }}
        />

        {/* ── Overlaid text content — RIGHT side in RTL ── */}
        <div
          className="relative z-10 w-full h-full flex items-center"
          style={{ minHeight: 'calc(100vh + 24px)', direction: 'rtl' }}
        >
          <div className="page-container w-full pt-32 pb-20 lg:pt-28 lg:pb-0">
            {/* Content is max half the width on desktop — on the right (RTL) */}
            <motion.div
              className="w-full lg:w-1/2 flex flex-col gap-7"
              initial="hidden"
              animate="show"
              variants={stagger}
            >

              {/* Eyebrow tag */}
              <motion.div variants={fadeUp}>
                <span
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
                  style={{ background: '#E4FAF9', color: '#21cdc0' }}
                >
                  رعاية أفضل، حياة أفضل
                </span>
              </motion.div>

              {/* Big headline */}
              <motion.div variants={fadeUp}>
                <h1
                  className="font-display font-bold text-ink leading-[1.12]"
                  style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}
                >
                  توريد أذكى للمستلزمات
                  <br />
                  الطبية المصممة
                  <br />
                  <span className="relative inline-block" style={{ color: '#213360' }}>
                    لعيادتك.
                    <svg
                      viewBox="0 0 200 14"
                      className="absolute pointer-events-none"
                      style={{ bottom: '-4px', right: 0, width: '100%' }}
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        d="M198,9 C160,3 120,11 80,7 C50,4 25,10 2,6"
                        stroke="#21cdc0" strokeWidth="4" strokeLinecap="round" fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.0, delay: 0.8, ease: 'easeOut' }}
                      />
                    </svg>
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="text-muted leading-relaxed max-w-[420px]"
                style={{ fontSize: '0.97rem' }}
              >
                تيبك تجمع بين توصيات الذكاء الاصطناعي، الباقات الذكية، واشتراكات إعادة التزويد التلقائي — لتحويل طريقة شراء المستلزمات الطبية في عيادتك.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4" dir="ltr">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    asChild
                    className="rounded-lg px-7 font-semibold text-white border-0 shadow-card"
                    style={{ background: '#213360', fontSize: '0.95rem' }}
                  >
                    <Link to="/assistant">
                      <Bot className="w-4 h-4 ml-2" />
                      جرب المساعد الذكي
                    </Link>
                  </Button>
                </motion.div>

                {/* How it works */}
                <motion.div
                  whileHover={{ x: -3 }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-soft border"
                    style={{ background: '#fff', borderColor: '#e7ebef' }}
                  >
                    <Play className="w-4 h-4" style={{ color: '#213360', marginRight: '-2px' }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#213360' }}>
                    كيف يعمل؟
                  </span>
                </motion.div>
              </motion.div>


            </motion.div>
          </div>
        </div>
      </div>


    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   FULL LANDING PAGE
═══════════════════════════════════════════════════════ */
export function LandingPage() {
  return (
    <div className="overflow-x-hidden">

      <HeroSection />


      {/* ════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════ */}
      <section className="py-20" style={{ background: '#F0F9FF' }}>
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-peach bg-peach-light mb-3">
                Top Picks
              </span>
              <h2 className="text-2xl font-display font-bold text-ink">Popular this month</h2>
              <p className="text-muted text-sm mt-1">Most ordered by clinics right now</p>
            </div>
            <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" asChild className="rounded-full border-border hover:border-secondary hover:text-secondary">
                <Link to="/products">View all <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SMART BUNDLES
      ════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-secondary bg-secondary/10 mb-3">
                Smart Bundles
              </span>
              <h2 className="text-2xl font-display font-bold text-ink">Pre-built clinic kits</h2>
              <p className="text-muted text-sm mt-1">Save up to 22% vs. individual orders</p>
            </div>
            <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" asChild className="rounded-full border-border hover:border-secondary hover:text-secondary">
                <Link to="/bundles">All bundles <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {MOCK_BUNDLES.filter(b => b.featured).map(bundle => (
              <motion.div
                key={bundle.id}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/bundles" className="card hover:shadow-card transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-ink">{bundle.name}</h3>
                      <span className="badge-success ml-2 whitespace-nowrap">Save {bundle.savings_pct}%</span>
                    </div>
                    <p className="text-sm text-muted mb-4">{bundle.description}</p>
                    <p className="text-xs text-muted">{bundle.items.length} products included</p>
                  </div>
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <span className="text-xs text-muted line-through mr-2">{formatCurrency(bundle.original_price)}</span>
                      <span className="text-lg font-display font-bold text-primary">{formatCurrency(bundle.bundle_price)}</span>
                    </div>
                    <span className="text-secondary text-sm font-medium">View bundle →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          AI ASSISTANT CTA
      ════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFEFE6 0%, #ffffff 50%, #F0F9FF 100%)' }}>
        <div className="absolute -top-16 right-8 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(186,230,253,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,176,133,0.25) 0%, transparent 70%)' }} />

        <div className="page-container text-center relative">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-card"
            style={{ background: 'linear-gradient(135deg, #213360 0%, #21cdc0 100%)' }}
          >
            <Bot className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-3xl font-display font-bold text-ink mb-3"
          >
            Not sure what to order?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-muted max-w-md mx-auto mb-8 text-sm leading-relaxed"
          >
            Answer 4 quick questions about your clinic and our AI will build a complete procurement list with quantities and cost estimates.
          </motion.p>
          <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Button size="lg" asChild className="rounded-full bg-primary text-white hover:bg-primary-700 px-10 shadow-card font-semibold">
              <Link to="/assistant">Start AI Assistant <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
