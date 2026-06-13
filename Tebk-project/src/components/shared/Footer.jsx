import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Share2, Mail, User, Power,
  Pill, Plus, Heart, Thermometer, Activity, Bandage,
  Stethoscope, Syringe, Microscope, FlaskConical, HeartPulse, TestTube, Camera, Pencil,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { TebkIcon } from '@/components/shared/TebkLogo'

/* ── Glassmorphic badge icons (white circles) ── */
const BADGE_ICONS = [
  { Icon: Stethoscope,  pos: 'left-[3%]  top-[10%]', size: 'w-6 h-6', delay: 0,   color: 'text-secondary' },
  { Icon: Pill,         pos: 'left-[12%] top-[5%]',  size: 'w-5 h-5', delay: 0.4, color: 'text-muted'     },
  { Icon: Syringe,      pos: 'left-[87%] top-[8%]',  size: 'w-5 h-5', delay: 0.6, color: 'text-secondary' },
  { Icon: Microscope,   pos: 'left-[4%]  top-[60%]', size: 'w-6 h-6', delay: 1.0, color: 'text-muted'     },
  { Icon: FlaskConical, pos: 'left-[88%] top-[52%]', size: 'w-5 h-5', delay: 0.8, color: 'text-secondary' },
  { Icon: HeartPulse,   pos: 'left-[80%] top-[25%]', size: 'w-5 h-5', delay: 0.3, color: 'text-muted'     },
  { Icon: TestTube,     pos: 'left-[93%] top-[68%]', size: 'w-5 h-5', delay: 1.2, color: 'text-secondary' },
  { Icon: Camera,       pos: 'left-[75%] top-[5%]',  size: 'w-5 h-5', delay: 0.9, color: 'text-muted'     },
]

/* ── Raw floating icons (minimal, semi-transparent) ── */
const RAW_ICONS = [
  { Icon: Plus,        pos: 'left-[28%] top-[6%]',  size: 'w-8 h-8',   rot: 15,  delay: 0.5 },
  { Icon: Heart,       pos: 'left-[60%] top-[8%]',  size: 'w-7 h-7',   rot: 0,   delay: 1.1 },
  { Icon: Thermometer, pos: 'left-[20%] top-[72%]', size: 'w-6 h-6',   rot: 18,  delay: 0.3 },
  { Icon: Activity,    pos: 'left-[55%] top-[75%]', size: 'w-7 h-7',   rot: 0,   delay: 0.9 },
  { Icon: Bandage,     pos: 'left-[42%] top-[4%]',  size: 'w-6 h-6',   rot: -15, delay: 0.7 },
  { Icon: Pencil,      pos: 'left-[93%] top-[16%]', size: 'w-5 h-5',   rot: -20, delay: 1.4 },
  { Icon: Plus,        pos: 'left-[68%] top-[70%]', size: 'w-5 h-5',   rot: 45,  delay: 1.6 },
]

const SOCIALS = [
  { icon: Share2, label: 'Share'    },
  { icon: Mail,   label: 'Email'    },
  { icon: User,   label: 'Profile'  },
  { icon: Power,  label: 'Platform' },
]

export function Footer() {
  const { t } = useTranslation()

  const LINKS = [
    {
      title: t('footer.platform'),
      items: [
        { to: '/products',     label: t('footer.products')     },
        { to: '/bundles',      label: t('footer.bundles')      },
        { to: '/assistant',    label: t('footer.assistant')    },
        { to: '/image-search', label: t('footer.image_search') },
      ],
    },
    {
      title: t('footer.account'),
      items: [
        { to: '/dashboard', label: t('footer.dashboard') },
        { to: '/orders',    label: t('footer.orders')    },
        { to: '/profile',   label: t('footer.profile')   },
        { to: '/settings',  label: t('footer.settings')  },
      ],
    },
    {
      title: t('footer.legal'),
      items: [
        { to: '/terms',              label: t('footer.terms')      },
        { to: '/privacy',            label: t('footer.privacy')    },
        { to: '/medical-disclaimer', label: t('footer.disclaimer') },
      ],
    },
  ]

  return (
    <footer>

      {/* ═══════════════════════════════════════════════════
          TOP HERO — light mint gradient + floating icons
      ═══════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: 420,
          background: 'linear-gradient(160deg, #e4faf9 0%, #f4fffe 40%, #eaf8f7 70%, #f0faf8 100%)',
        }}
      >
        {/* Soft glow orbs */}
        <div
          className="absolute -top-20 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(33,205,192,0.12) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(33,205,192,0.08) 0%, transparent 65%)' }}
        />

        {/* Glassmorphic badge icons */}
        {BADGE_ICONS.map((b, i) => (
          <motion.div
            key={`badge-${i}`}
            className={`absolute pointer-events-none ${b.pos}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: b.delay },
              scale:   { duration: 0.5, delay: b.delay },
              y:       { duration: 4.5 + i * 0.3, delay: b.delay, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/70 border border-white/80 backdrop-blur-sm flex items-center justify-center shadow-soft">
              <b.Icon className={`${b.size} ${b.color}`} aria-hidden="true" />
            </div>
          </motion.div>
        ))}

        {/* Raw floating icons */}
        {RAW_ICONS.map((r, i) => (
          <motion.div
            key={`raw-${i}`}
            className={`absolute pointer-events-none text-secondary/25 ${r.pos}`}
            initial={{ opacity: 0, rotate: r.rot }}
            animate={{
              opacity: [0.15, 0.35, 0.15],
              y:       [0, -18, 0],
              rotate:  [r.rot, r.rot + 8, r.rot - 4, r.rot],
            }}
            transition={{ duration: 5.5 + i * 0.3, delay: r.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <r.Icon className={r.size} />
          </motion.div>
        ))}

        {/* Subtle pulsing rings */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none border border-secondary/10"
          style={{ width: 440, height: 440 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none border border-secondary/8"
          style={{ width: 300, height: 300 }}
          animate={{ scale: [1, 1.09, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />

        {/* ── Center content ── */}
        <div
          className="relative z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ minHeight: 420 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-4"
            >
              <TebkIcon className="w-16 h-16 drop-shadow-md" />
            </motion.div>

            {/* Wordmark */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="font-display font-bold text-primary text-5xl md:text-6xl tracking-wide mb-3"
            >
              TEBK
            </motion.h2>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="text-ink/70 text-sm md:text-base max-w-xl leading-relaxed mb-8"
            >
              {t('footer.tagline')}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="flex items-center gap-3 flex-wrap justify-center"
            >
              <Link
                to="/products"
                className="px-8 py-3 rounded-full bg-secondary text-white font-semibold text-sm hover:bg-secondary-500 active:scale-95 transition-all shadow-soft"
              >
                {t('footer.shop_now')} →
              </Link>
              <Link
                to="/assistant"
                className="px-8 py-3 rounded-full border border-ink/20 text-ink/80 text-sm font-medium hover:border-secondary hover:text-secondary active:scale-95 transition-all bg-white/50 backdrop-blur-sm"
              >
                {t('nav.assistant')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          BOTTOM LINKS BAR — white/cream
      ═══════════════════════════════════════════════════ */}
      <div className="bg-white border-t border-border">
        <div className="page-container py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 justify-between">

            {/* Brand column */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="shrink-0 lg:max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-3">
                <TebkIcon className="w-7 h-7" />
                <span className="font-display font-bold text-primary text-base tracking-wide">TEBK</span>
              </div>
              <p className="text-muted text-xs leading-relaxed">
                {t('footer.brand_tagline')}
              </p>
            </motion.div>

            {/* Nav columns */}
            <div className="flex flex-wrap gap-x-12 gap-y-8">
              {LINKS.map((group, gi) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.07 * gi }}
                  className="min-w-[130px]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-3.5 rounded-full bg-secondary shrink-0" />
                    <h4 className="text-muted text-[11px] font-semibold uppercase tracking-widest">
                      {group.title}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {group.items.map(link => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="text-ink/60 text-sm hover:text-secondary transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex items-start gap-2.5 shrink-0"
            >
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-secondary hover:border-secondary/50 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>

          </div>

          {/* Bottom divider */}
          <div className="mt-8 pt-5 border-t border-border">
            <p className="text-muted text-[11px] text-center">
              © {new Date().getFullYear()} TEBK Medical Co. {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>

    </footer>
  )
}
