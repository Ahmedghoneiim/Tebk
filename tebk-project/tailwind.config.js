/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#213360',
          50:  '#e8ebf2',
          100: '#c5cedf',
          200: '#9faec8',
          300: '#798eb0',
          400: '#5e779f',
          500: '#436090',
          600: '#354d7a',
          700: '#273a64',
          800: '#213360',
          900: '#16234a',
        },
        secondary: {
          DEFAULT: '#4ea055',
          50:  '#f4fbf4',
          100: '#e4f5e6',
          200: '#C1E3C4',
          300: '#9cd0a0',
          400: '#74b87a',
          500: '#4ea055',
          600: '#358a3c',
          700: '#25712c',
          800: '#155820',
          900: '#083f14',
        },
        background: '#EDF9FE',
        ink:      '#0e204d',
        clinical: '#CBEDFC',
        subtitle: '#435ba1',
        success:  '#16A34A',
        warning:  '#F59E0B',
        danger:   '#E11D48',
        muted:    '#848e9f',
        border:   '#e7ebef',
        mint:     '#C1E3C4',
        sky:      '#CBEDFC',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft:  '0 2px 12px 0 rgba(33,51,96,0.08)',
        card:  '0 4px 24px 0 rgba(33,51,96,0.10)',
        modal: '0 8px 40px 0 rgba(33,51,96,0.16)',
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
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
