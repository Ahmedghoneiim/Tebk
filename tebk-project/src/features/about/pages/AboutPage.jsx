import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Target, Lightbulb, Award } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } }
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

/* ── 4 specialty cards ─────────────────────────────── */
const SPECIALTIES = [
  {
    label: 'Smart Procurement',
    desc:  'Order the right medical supplies in seconds using our AI-driven recommendation engine tailored to your clinic type and size.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.4" stroke="#17C3CE" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto">
        <circle cx="32" cy="20" r="10" />
        <path d="M14 54c0-9.94 8.06-18 18-18s18 8.06 18 18" />
        <path d="M44 30l4 4-4 4M20 30l-4 4 4 4" />
        <path d="M48 34H56M8 34h8" />
      </svg>
    ),
  },
  {
    label: 'Inventory Control',
    desc:  'Track stock in real time, receive low-stock alerts before you run out, and automate reorder cycles for consumables.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.4" stroke="#17C3CE" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto">
        <rect x="8"  y="28" width="20" height="28" rx="3" />
        <rect x="36" y="16" width="20" height="40" rx="3" />
        <path d="M8 20l8-12 8 12" />
        <path d="M16 8v20" />
      </svg>
    ),
  },
  {
    label: 'AI Assistant',
    desc:  'Answer 4 quick questions about your practice and get a complete, costed procurement list — powered by advanced AI.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.4" stroke="#17C3CE" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto">
        <rect x="12" y="18" width="40" height="32" rx="6" />
        <circle cx="24" cy="30" r="3" />
        <circle cx="40" cy="30" r="3" />
        <path d="M22 38c2.5 3 17.5 3 20 0" />
        <path d="M32 18v-8M24 10h16" />
      </svg>
    ),
  },
  {
    label: 'Smart Bundles',
    desc:  'Pre-built supply kits for dental, ICU, lab, and general clinics — already negotiated for the best bulk price.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.4" stroke="#17C3CE" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto">
        <path d="M32 8L56 20v24L32 56 8 44V20L32 8z" />
        <path d="M32 8v48M8 20l24 12 24-12" />
        <path d="M20 14l24 12M44 14L20 26" />
      </svg>
    ),
  },
]

/* ── Stats ─────────────────────────────────────────── */
const STATS = [
  { value: '7',      label: 'Team Members' },
  { value: '5,000+', label: 'Medical Products' },
  { value: '300+',   label: 'Healthcare Clients' },
  { value: '24h',    label: 'Average Delivery' },
]

/* ── Values ────────────────────────────────────────── */
const VALUES = [
  { icon: Target,    title: 'Our Mission',  body: 'Make medical procurement simpler, faster, and more organized — saving time and reducing operational effort for every healthcare business.' },
  { icon: Lightbulb, title: 'Innovation',   body: 'We use smart technology: AI recommendations, image search, and auto-refill subscriptions to keep clinics always stocked.' },
  { icon: Users,     title: 'Our Team',     body: 'Seven passionate developers and designers who share a common goal — building a reliable, modern healthcare platform for the future.' },
  { icon: Award,     title: 'Quality First',body: 'Every product on TEBK is healthcare-grade and sourced from verified suppliers. Your patients deserve the best.' },
]

export function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO BANNER ══════════════════════════════════ */}
      <section
        className="relative py-20 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3363 0%, #17C3CE 100%)', minHeight: 260 }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
          <p className="text-secondary-200 text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Who We Are
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">About Us</h1>
          {/* Wavy teal underline */}
          <svg viewBox="0 0 200 18" className="w-40 mx-auto" fill="none">
            <path d="M0,9 C25,0 50,18 75,9 C100,0 125,18 150,9 C175,0 200,18 200,9" stroke="#17C3CE" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </section>

      {/* ══ SPECIALTIES / SERVICES ═══════════════════════ */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {SPECIALTIES.map(({ label, desc, icon }) => (
              <motion.div key={label} variants={fadeUp} className="text-center group">
                <div className="mb-5 transition-transform duration-300 group-hover:-translate-y-2">
                  {icon}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#17C3CE' }}>{label}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ DIVIDER ══════════════════════════════════════ */}
      <div className="h-px bg-border mx-auto" style={{ maxWidth: '80%' }} />

      {/* ══ OUR STORY ════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Text */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-xs font-bold tracking-widest uppercase text-secondary mb-2">
                Our Story
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-display font-bold text-primary mb-6 leading-snug">
                Our History
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-4 text-muted leading-relaxed text-[15px]">
                <p>
                  We built an intelligent medical platform that helps clinics, hospitals, and healthcare providers
                  easily purchase and manage medical supplies and equipment — all in one place.
                </p>
                <p>
                  The platform uses smart technology to help users find the right products faster, manage inventory,
                  receive refill reminders, and explore medical equipment through a modern and easy-to-use experience.
                </p>
                <p>
                  Our goal is to make medical purchasing <strong className="text-primary font-semibold">simpler, faster, and more organized</strong> — while
                  saving time and reducing operational effort for healthcare businesses.
                </p>
                <p>
                  This platform was developed by a team of <strong className="text-primary font-semibold">seven passionate members</strong> working
                  together to create a reliable and modern healthcare solution for the future.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-teal"
                  style={{ background: '#17C3CE' }}
                >
                  Explore Our Products →
                </Link>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-card aspect-[4/3]">
                <img
                  src="/about-team.jpg"
                  alt="Our team working together"
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                {/* Fallback if image not found */}
                <div
                  className="w-full h-full items-center justify-center flex-col gap-4 hidden"
                  style={{ background: 'linear-gradient(135deg, #E0F9FB 0%, #CCFBFE 100%)', minHeight: 320 }}
                >
                  <Users className="w-16 h-16 text-secondary/40" />
                  <p className="text-muted text-sm">Team photo</p>
                </div>
              </div>
              {/* Decorative teal dot */}
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-20 blur-xl" style={{ background: '#17C3CE' }} />
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-15 blur-xl" style={{ background: '#1a3363' }} />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════ */}
      <section className="py-14 section-alt">
        <div className="page-container">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {STATS.map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <p className="text-4xl font-display font-extrabold text-primary mb-1">{value}</p>
                <p className="text-sm text-muted font-medium">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ VALUES ═══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold text-primary">What We Stand For</h2>
            <p className="text-muted mt-3 max-w-lg mx-auto text-sm">
              Our values guide every decision we make — from product selection to platform design.
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {VALUES.map(({ icon: Icon, title, body }) => (
              <motion.div key={title} variants={fadeUp} className="card flex gap-5 hover:border-secondary/30 transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center" style={{ background: '#E0F9FB' }}>
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1.5">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA BANNER ═══════════════════════════════════ */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1a3363 0%, #17C3CE 100%)' }}>
        <div className="page-container text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to transform your procurement?</h2>
          <p className="text-white/70 text-sm max-w-md mx-auto mb-8">
            Join hundreds of clinics already using TEBK to save time and reduce costs.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3 rounded-full font-bold text-primary text-sm bg-white hover:bg-white/90 transition-all duration-200 hover:scale-105 shadow-md"
            >
              Get Started Free
            </Link>
            <Link
              to="/assistant"
              className="px-8 py-3 rounded-full font-semibold text-white text-sm border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              Try AI Assistant
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
