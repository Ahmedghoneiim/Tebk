import { motion } from 'framer-motion'
import {
  ShieldCheck, Lightbulb, Zap, Heart, Users, Globe,
  ArrowRight, Package, Star, CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}
const sc = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

const STATS = [
  { value: '15k+', label: 'Medical Products',    icon: Package },
  { value: '500+', label: 'Healthcare Clients',   icon: Users   },
  { value: '12',   label: 'Cities Served',        icon: Globe   },
  { value: '99%',  label: 'Client Satisfaction',  icon: Star    },
]

const VALUES = [
  { icon: Heart,       title: 'Patient-First',            desc: 'Every decision we make traces back to better patient outcomes.',        from: '#f43f5e', to: '#e11d48', light: '#fff1f2' },
  { icon: ShieldCheck, title: 'Healthcare-Grade Quality',  desc: 'All products sourced from certified, B2B-verified suppliers.',           from: '#21cdc0', to: '#0d9488', light: '#f0fdfa' },
  { icon: Lightbulb,   title: 'AI-Driven Innovation',      desc: 'Smart technology that simplifies complex procurement decisions.',        from: '#f59e0b', to: '#d97706', light: '#fffbeb' },
  { icon: Zap,         title: 'Speed & Efficiency',         desc: 'From discovery to delivery with zero friction.',                       from: '#8b5cf6', to: '#7c3aed', light: '#f5f3ff' },
  { icon: Users,       title: 'Built for Teams',            desc: 'Designed for procurement managers and clinic admins to collaborate.',   from: '#0ea5e9', to: '#0284c7', light: '#f0f9ff' },
  { icon: Globe,       title: "Scaling Egypt's Health",     desc: "Modernizing healthcare procurement across every city in Egypt.",        from: '#22c55e', to: '#16a34a', light: '#f0fdf4' },
]

const TEAM = [
  { name: 'Ahmed Mohamed', role: 'CEO & Co-Founder',  initials: 'AM', from: '#21cdc0', to: '#0d9488', featured: true },
  { name: 'Sara Hassan',   role: 'CTO & Co-Founder',  initials: 'SH', from: '#8b5cf6', to: '#7c3aed', featured: true },
  { name: 'Omar Khaled',   role: 'Head of Product',   initials: 'OK', from: '#f43f5e', to: '#e11d48' },
  { name: 'Nour Elsayed',  role: 'Lead Designer',     initials: 'NE', from: '#f59e0b', to: '#d97706' },
  { name: 'Youssef Ali',   role: 'Backend Engineer',  initials: 'YA', from: '#0ea5e9', to: '#0284c7' },
  { name: 'Mona Ibrahim',  role: 'Data & AI Lead',    initials: 'MI', from: '#22c55e', to: '#16a34a' },
  { name: 'Karim Tarek',   role: 'Operations Lead',   initials: 'KT', from: '#6366f1', to: '#4f46e5' },
]

const MILESTONES = [
  { year: '2023',    title: 'Founded',           desc: 'Born from a vision to fix fragmented healthcare procurement in Egypt.' },
  { year: 'Q1 2024', title: 'First 100 Clients', desc: 'Onboarded our first clinics across Cairo and Alexandria.' },
  { year: 'Q3 2024', title: 'AI Launch',          desc: 'Introduced the AI Buyer Assistant — a first in Egyptian medical B2B.' },
  { year: '2025',    title: 'National Scale',     desc: 'Expanding to 12+ cities with 15,000+ products and global suppliers.' },
]

const FEATURES = [
  'B2B-verified supplier network',
  'AI-powered product recommendations',
  'Real-time inventory tracking',
  'Multi-clinic procurement management',
  'Regulatory compliance built-in',
  'Arabic & English full support',
]

export default function AboutPage() {
  usePageTitle('About TEBK')

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '88vh', background: 'linear-gradient(135deg, #0A2540 0%, #0d3d6b 45%, #0a6b5f 100%)' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(33,205,192,.18),transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(33,205,192,.12),transparent 70%)' }} />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none" aria-hidden>
          <span
            className="font-display font-extrabold text-white leading-none"
            style={{ fontSize: 'clamp(120px,20vw,280px)', opacity: 0.035 }}
          >
            TEBK
          </span>
        </div>

        <div className="page-container relative z-10 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left – copy */}
            <motion.div variants={sc} initial="hidden" animate="show">
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  About TEBK
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display font-extrabold text-white mb-6 leading-[1.05]"
                style={{ fontSize: 'clamp(36px,5vw,64px)' }}
              >
                Egypt's Future of{' '}
                <span
                  className="block"
                  style={{ background: 'linear-gradient(90deg,#21cdc0,#5eead4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Healthcare
                </span>
                Procurement
              </motion.h1>

              <motion.p variants={fadeUp} className="text-white/65 text-base leading-relaxed max-w-md mb-8">
                We built an intelligent B2B platform that helps clinics, hospitals, and healthcare
                providers discover, purchase, and manage medical supplies — all in one place.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg"
                  style={{ background: 'linear-gradient(90deg,#21cdc0,#1bb3a7)' }}
                >
                  Explore Products <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#team"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white/90 border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Meet the Team
                </a>
              </motion.div>
            </motion.div>

            {/* Right – glass dashboard card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.35 }}
              className="relative hidden lg:block"
            >
              <div
                className="rounded-3xl p-6 shadow-2xl"
                style={{ background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.12)' }}
              >
                {/* Window chrome */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <div className="flex-1 h-5 rounded-md bg-white/10 ml-2" />
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {STATS.map(({ value, label, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-2xl p-4"
                      style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)' }}
                    >
                      <Icon className="w-4 h-4 mb-2 text-teal-400" />
                      <p className="font-display font-bold text-white text-xl leading-none">{value}</p>
                      <p className="text-white/50 text-[11px] mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-white/10 mb-2">
                  <div className="h-full w-4/5 rounded-full" style={{ background: 'linear-gradient(90deg,#21cdc0,#5eead4)' }} />
                </div>
                <p className="text-white/40 text-xs">Platform health — 99% uptime</p>
              </div>

              {/* Floating badge – top left */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -left-8 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.2)' }}
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span className="text-white text-xs font-semibold">B2B Verified</span>
              </motion.div>

              {/* Floating badge – bottom right */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-6 -right-6 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.2)' }}
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white text-xs font-semibold">Trusted by 500+ Clinics</span>
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20 fill-white">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════ */}
      <section className="bg-white py-16 border-b border-border">
        <div className="page-container">
          <motion.div
            variants={sc}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border"
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp} className="flex flex-col items-center text-center px-6 py-4 group">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
                  <Icon className="w-4 h-4 text-secondary" />
                </div>
                <p className="font-display font-extrabold text-5xl text-primary mb-1">{value}</p>
                <p className="text-sm text-muted font-medium">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STORY
      ══════════════════════════════════════ */}
      <section className="bg-secondary-50 py-24">
        <div className="page-container">
          <motion.div
            variants={sc}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left – text */}
            <div>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-widest mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  Our Story
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-display font-bold text-4xl text-primary mb-6 leading-tight">
                Built to solve a real<br />problem in healthcare
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-4 text-muted leading-relaxed text-[15px]">
                <p>
                  Clinics in Egypt face a fragmented procurement landscape — dozens of suppliers,
                  no standardized pricing, and zero transparency. Our founders lived this problem firsthand.
                </p>
                <p>
                  TEBK centralizes medical supply procurement: one platform, verified suppliers,
                  AI-powered recommendations, and real-time inventory management.
                </p>
                <p>
                  We started with seven people and a shared belief: that healthcare workers deserve
                  better tools — so they can focus on patients, not paperwork.
                </p>
              </motion.div>
            </div>

            {/* Right – features checklist */}
            <motion.div variants={fadeUp} className="space-y-3">
              {FEATURES.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-soft border border-border hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(33,205,192,.12)' }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-ink">{f}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VALUES
      ══════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="page-container">
          <motion.div
            variants={sc}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp} className="text-center max-w-xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                What We Stand For
              </span>
              <h2 className="font-display font-bold text-4xl text-primary mb-3">Our Core Values</h2>
              <p className="text-muted text-sm">
                The principles that guide every decision we make — from product features to supplier partnerships.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VALUES.map(({ icon: Icon, title, desc, from, to, light }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="group relative bg-white rounded-3xl p-6 border border-border hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Colored top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{ background: `linear-gradient(90deg,${from},${to})` }}
                  />
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: light }}
                  >
                    <Icon className="w-5 h-5" style={{ color: from }} />
                  </div>
                  <h3 className="font-display font-semibold text-base text-ink mb-2">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0A2540 0%,#0d4d6b 60%,#0a6b5f 100%)' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="page-container relative z-10">
          <motion.div
            variants={sc}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest mb-5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Our Journey
              </span>
              <h2 className="font-display font-bold text-4xl text-white">From Idea to Impact</h2>
            </motion.div>

            {/* Timeline row */}
            <div className="relative">
              {/* Connector line */}
              <div
                className="absolute top-6 left-0 right-0 h-px hidden lg:block"
                style={{ background: 'linear-gradient(90deg,transparent,#21cdc0 20%,#21cdc0 80%,transparent)' }}
              />
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {MILESTONES.map(({ year, title, desc }, i) => (
                  <motion.div key={year} variants={fadeUp} className="flex flex-col items-center text-center">
                    {/* Numbered dot */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4 shrink-0 relative z-10 shadow-lg"
                      style={{ background: 'linear-gradient(135deg,#21cdc0,#1bb3a7)', border: '3px solid #0A2540' }}
                    >
                      <span className="text-white font-bold text-xs">{i + 1}</span>
                    </div>
                    <span
                      className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold mb-2 text-teal-400"
                      style={{ background: 'rgba(33,205,192,.12)' }}
                    >
                      {year}
                    </span>
                    <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TEAM
      ══════════════════════════════════════ */}
      <section id="team" className="bg-secondary-50 py-24">
        <div className="page-container">
          <motion.div
            variants={sc}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp} className="mb-12">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                The People
              </span>
              <h2 className="font-display font-bold text-4xl text-primary mb-2">Meet the Team</h2>
              <p className="text-muted text-sm max-w-md">Seven passionate people building the future of healthcare procurement in Egypt.</p>
            </motion.div>

            {/* Featured founders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {TEAM.filter(m => m.featured).map(({ name, role, initials, from, to }) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  className="bg-white rounded-3xl p-8 shadow-card border border-border flex items-center gap-6 group hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform"
                    style={{ background: `linear-gradient(135deg,${from},${to})` }}
                  >
                    <span className="font-display font-extrabold text-2xl text-white">{initials}</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-xl text-ink">{name}</p>
                    <p className="text-sm text-muted mt-1">{role}</p>
                    <span
                      className="inline-block mt-3 px-3 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: `${from}20`, color: from }}
                    >
                      Co-Founder
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Rest of team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEAM.filter(m => !m.featured).map(({ name, role, initials, from, to }) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-border flex items-center gap-4 group hover:-translate-y-0.5 hover:shadow-card transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                    style={{ background: `linear-gradient(135deg,${from},${to})` }}
                  >
                    <span className="font-display font-bold text-sm text-white">{initials}</span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-ink">{name}</p>
                    <p className="text-xs text-muted mt-0.5">{role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#21cdc0 0%,#1bb3a7 40%,#0d9488 100%)' }}
      >
        {/* Dot decorations */}
        <div className="absolute top-6 left-6 grid grid-cols-6 gap-3 opacity-20 pointer-events-none">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>
        <div className="absolute bottom-6 right-6 grid grid-cols-6 gap-3 opacity-20 pointer-events-none">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>

        <div className="page-container relative z-10 text-center">
          <motion.div
            variants={sc}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display font-extrabold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(28px,4vw,52px)' }}
            >
              Ready to Transform<br />Your Clinic's Procurement?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 text-base mb-8 max-w-lg mx-auto">
              Join 500+ healthcare providers already using TEBK to save time, reduce costs, and improve patient care.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-secondary bg-white hover:bg-clinical shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all"
              >
                Browse Products
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
