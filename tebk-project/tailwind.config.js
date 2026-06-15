/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {

        /* ── Primary  (Navy — Authority / Trust) ── */
        primary: {
          DEFAULT: '#1a3363',
          50:  '#EEF3FF',
          100: '#DCE6FF',
          200: '#BACEFF',
          300: '#8AACFF',
          400: '#5577EE',
          500: '#2E52D5',
          600: '#2240AF',
          700: '#1a3363',   // DEFAULT
          800: '#132648',
          900: '#0D192F',
        },

        /* ── Secondary (Teal — Brand / Health) ── */
        secondary: {
          DEFAULT: '#17C3CE',
          50:  '#EFFFFE',
          100: '#CCFBFD',
          200: '#9AF6FA',
          300: '#5DE8F2',
          400: '#22D3DE',
          500: '#17C3CE',   // DEFAULT
          600: '#0EA3AC',
          700: '#0C7F87',
          800: '#095C63',
          900: '#063C40',
        },

        /* ── Neutrals ── */
        background: '#F9FAFB',   // clean off-white — page bg
        ink:        '#111827',   // near-black — primary text
        muted:      '#6B7280',   // gray-500  — secondary text
        subtle:     '#9CA3AF',   // gray-400  — placeholders, captions
        border:     '#E5E7EB',   // gray-200  — dividers, card borders

        /* ── Brand tints (section backgrounds) ── */
        clinical:   '#F0FDFE',   // barely-teal  — alt sections
        mint:       '#ECFDF5',   // barely-green — success tints
        sky:        '#F0F9FF',   // barely-blue  — info tints

        /* ── Semantic ── */
        success:  '#059669',
        warning:  '#D97706',
        danger:   '#DC2626',
      },

      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },

      /* Neutral shadows — no color tint, clean depth */
      boxShadow: {
        soft:  '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        card:  '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)',
        modal: '0 4px 6px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.14)',
        teal:  '0 4px 16px rgba(23,195,206,0.28)',
        navy:  '0 4px 16px rgba(26,51,99,0.22)',
      },

      borderRadius: {
        xl:    '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
